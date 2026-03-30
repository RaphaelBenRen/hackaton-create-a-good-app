const router = require('express').Router();
const supabase = require('../supabase');
const authenticate = require('../middleware/auth');

// POST /api/students — create student profile
router.post('/', authenticate, async (req, res) => {
  if (!req.body.first_name || !req.body.last_name) return res.status(400).json({ error: 'first_name and last_name are required' });
  const { data, error } = await supabase
    .from('students')
    .insert({ ...req.body, user_id: req.user.id })
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET /api/students — list active students
router.get('/', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .in('search_status', ['active', 'open'])
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET /api/students/search?q=...&field=...
router.get('/search/query', authenticate, async (req, res) => {
  const { q, field, status } = req.query;
  let query = supabase.from('students').select('*').in('search_status', ['active', 'open']);
  if (q) query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,study_field.ilike.%${q}%,city.ilike.%${q}%`);
  if (field && field !== 'all') query = query.eq('study_field', field);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET /api/students/:id
router.get('/:id', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('students').select('*').eq('id', req.params.id).single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// PUT /api/students — update own profile
router.put('/', authenticate, async (req, res) => {
  const { user_id, ...updateData } = req.body;
  const { data, error } = await supabase
    .from('students')
    .update(updateData)
    .eq('user_id', req.user.id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
