const router = require('express').Router();
const supabase = require('../supabase');
const authenticate = require('../middleware/auth');

// POST /api/applications
router.post('/', authenticate, async (req, res) => {
  if (!req.body.offer_id) return res.status(400).json({ error: 'offer_id is required' });
  // Fix: allow companies to invite students (bypass student_id restriction)
  let finalStudentId = req.user.id;
  if (req.body.student_id && req.body.student_id !== req.user.id) {
    const { data: company } = await supabase.from('companies').select('id').eq('user_id', req.user.id).single();
    if (!company) {
      return res.status(403).json({ error: 'Cannot apply on behalf of another student' });
    }
    finalStudentId = req.body.student_id;
    // Set type to 'invite' if not provided and it's a company inviting
    if (!req.body.type) req.body.type = 'invite';
  } else {
    // Student applying
    if (!req.body.type) req.body.type = 'apply';
  }

  const { data, error } = await supabase
    .from('applications')
    .insert({ ...req.body, student_id: finalStudentId })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  // If it's an invitation (company to student), send an automated message
  if (finalStudentId !== req.user.id) {
    try {
      // 1. Create or get conversation
      const { data: conv } = await supabase
        .from('conversations')
        .upsert(
          { student_id: finalStudentId, company_id: req.user.id, offer_id: req.body.offer_id },
          { onConflict: 'student_id,company_id,offer_id' }
        )
        .select()
        .single();
      
      if (conv) {
        // 2. Send automated message
        await supabase.from('messages').insert({
          sender_id: req.user.id,
          receiver_id: finalStudentId,
          conversation_id: conv.id,
          application_id: data.id,
          content: "Bonjour ! Nous avons consulté votre profil et nous aimerions vous inviter à postuler pour notre offre.",
        });
      }
    } catch (msgErr) {
      console.error('Failed to send invitation message:', msgErr);
      // We don't fail the application creation just because the message failed
    }
  }

  res.json(data);
});

// GET /api/applications/student — student's applications
router.get('/student', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('applications')
    .select('*, offers(*, companies(*))')
    .eq('student_id', req.user.id)
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET /api/applications/company — company's received applications
router.get('/company', authenticate, async (req, res) => {
  const { data: company } = await supabase
    .from('companies').select('id').eq('user_id', req.user.id).single();
  if (!company) return res.status(404).json({ error: 'Company not found' });

  const { data, error } = await supabase
    .from('applications')
    .select('*, offers(*), students(*)')
    .eq('company_id', company.id)
    .eq('type', 'apply') // Filter to only show received applications
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET /api/applications/check?offer_id=...
router.get('/check', authenticate, async (req, res) => {
  const { offer_id } = req.query;
  const { data } = await supabase
    .from('applications')
    .select('id')
    .eq('offer_id', offer_id)
    .eq('student_id', req.user.id)
    .single();
  res.json({ applied: !!data });
});

// GET /api/applications/check-as-company?student_id=...&offer_id=...
router.get('/check-as-company', authenticate, async (req, res) => {
  const { student_id, offer_id } = req.query;
  const { data: company } = await supabase.from('companies').select('id').eq('user_id', req.user.id).single();
  if (!company) return res.status(404).json({ error: 'Company not found' });

  const query = supabase
    .from('applications')
    .select('offer_id')
    .eq('company_id', company.id)
    .eq('student_id', student_id);

  if (offer_id) {
    query.eq('offer_id', offer_id);
    const { data } = await query.maybeSingle();
    return res.json({ invited: !!data });
  }

  const { data } = await query;
  const invitedOfferIds = data ? data.map(app => app.offer_id) : [];
  res.json({ invitedOfferIds });
});

// PUT /api/applications/:id — update status
router.put('/:id', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('applications')
    .update({ ...req.body, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// DELETE /api/applications/:id
router.delete('/:id', authenticate, async (req, res) => {
  const { error } = await supabase.from('applications').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
