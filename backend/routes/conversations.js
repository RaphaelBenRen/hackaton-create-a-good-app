const router = require('express').Router();
const supabase = require('../supabase');
const authenticate = require('../middleware/auth');

// GET /api/conversations
router.get('/', authenticate, async (req, res) => {
  const userId = req.user.id;
  const { data, error } = await supabase
    .from('conversations')
    .select('*, offers(title), messages(content, created_at, sender_id)')
    .or(`student_id.eq.${userId},company_id.eq.${userId}`)
    .order('last_message_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });

  // Enrich with other party info
  const enriched = await Promise.all(
    (data || []).map(async (conv) => {
      try {
        const isStudent = conv.student_id === userId;
        const otherUserId = isStudent ? conv.company_id : conv.student_id;
        let otherName = '', otherInitials = '';

        if (isStudent) {
          const { data: company, error } = await supabase
            .from('companies').select('company_name').eq('user_id', otherUserId).single();
          if (error || !company) {
            otherName = 'Entreprise';
          } else {
            otherName = company.company_name || 'Entreprise';
          }
          otherInitials = otherName.substring(0, 2).toUpperCase();
        } else {
          const { data: student, error } = await supabase
            .from('students').select('first_name, last_name').eq('user_id', otherUserId).single();
          if (error || !student) {
            otherName = 'Étudiant·e';
            otherInitials = 'ET';
          } else {
            otherName = `${student.first_name} ${student.last_name}`;
            otherInitials = `${student.first_name[0]}${student.last_name[0]}`.toUpperCase();
          }
        }

        const lastMsg = conv.messages?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

        return {
          ...conv,
          otherName,
          otherInitials,
          otherUserId,
          lastMessage: lastMsg?.content || '',
          lastMessageTime: lastMsg?.created_at || conv.created_at,
          isOwnLastMessage: lastMsg?.sender_id === userId,
        };
      } catch (err) {
        return {
          ...conv,
          otherName: 'Inconnu',
          otherInitials: '??',
          otherUserId: null,
          lastMessage: '',
          lastMessageTime: conv.created_at,
          isOwnLastMessage: false,
        };
      }
    })
  );

  res.json(enriched);
});

// POST /api/conversations
router.post('/', authenticate, async (req, res) => {
  const { student_id, company_id, offer_id } = req.body;

  // Check if exists
  let query = supabase.from('conversations').select('*')
    .eq('student_id', student_id).eq('company_id', company_id);
  if (offer_id) query = query.eq('offer_id', offer_id);

  const { data: existing } = await query.single();
  if (existing) return res.json(existing);

  const { data, error } = await supabase
    .from('conversations')
    .insert({ student_id, company_id, offer_id })
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// PUT /api/conversations/:id
router.put('/:id', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('conversations')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
