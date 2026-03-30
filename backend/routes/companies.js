const router = require('express').Router();
const supabase = require('../supabase');
const authenticate = require('../middleware/auth');

// GET /api/companies — list all companies
router.get('/', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// POST /api/companies
router.post('/', authenticate, async (req, res) => {
  if (!req.body.company_name) return res.status(400).json({ error: 'company_name is required' });
  const { data, error } = await supabase
    .from('companies')
    .insert({ ...req.body, user_id: req.user.id })
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET /api/companies/:id
router.get('/:id', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('companies').select('*').eq('id', req.params.id).single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// PUT /api/companies
router.put('/', authenticate, async (req, res) => {
  const { user_id, ...updateData } = req.body;
  const { data, error } = await supabase
    .from('companies')
    .update(updateData)
    .eq('user_id', req.user.id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
