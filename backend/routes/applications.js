const router = require('express').Router();
const supabase = require('../supabase');
const authenticate = require('../middleware/auth');

// POST /api/applications
router.post('/', authenticate, async (req, res) => {
  if (!req.body.offer_id) return res.status(400).json({ error: 'offer_id is required' });
  if (req.body.student_id && req.body.student_id !== req.user.id) return res.status(403).json({ error: 'Cannot apply on behalf of another student' });

  const { data, error } = await supabase
    .from('applications')
    .insert({ ...req.body, student_id: req.user.id })
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
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
