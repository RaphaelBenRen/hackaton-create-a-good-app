const router = require('express').Router();
const supabase = require('../supabase');
const authenticate = require('../middleware/auth');

// POST /api/offers
router.post('/', authenticate, async (req, res) => {
  if (!req.body.title) return res.status(400).json({ error: 'title is required' });

  // Verify the authenticated user owns the company
  const { data: company } = await supabase
    .from('companies').select('id').eq('user_id', req.user.id).single();
  if (!company) return res.status(403).json({ error: 'Only company owners can create offers' });
  if (req.body.company_id && req.body.company_id !== company.id) return res.status(403).json({ error: 'Cannot create offers for another company' });

  const { data, error } = await supabase
    .from('offers')
    .insert({ ...req.body, company_id: company.id })
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET /api/offers — all active offers with company info
router.get('/', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('offers')
    .select('*, companies(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET /api/offers/mine — company's own offers
router.get('/mine', authenticate, async (req, res) => {
  // Find company profile
  const { data: company } = await supabase
    .from('companies').select('id').eq('user_id', req.user.id).single();
  if (!company) return res.status(404).json({ error: 'Company not found' });

  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET /api/offers/search/query?q=...&type=...&sector=...&city=...
router.get('/search/query', authenticate, async (req, res) => {
  const { q, type, sector, city } = req.query;
  let query = supabase.from('offers').select('*, companies(*)').eq('is_active', true);
  if (type && type !== 'all') query = query.eq('type', type);
  if (sector && sector !== 'all') query = query.eq('sector', sector);
  if (city) query = query.ilike('location', `%${city}%`);
  if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET /api/offers/:id
router.get('/:id', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('offers').select('*, companies(*)').eq('id', req.params.id).single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// PUT /api/offers/:id
router.put('/:id', authenticate, async (req, res) => {
  // Verify ownership
  const { data: company } = await supabase
    .from('companies').select('id').eq('user_id', req.user.id).single();
  if (!company) return res.status(403).json({ error: 'Company not found' });
  const { data: offer } = await supabase
    .from('offers').select('company_id').eq('id', req.params.id).single();
  if (!offer || offer.company_id !== company.id) return res.status(403).json({ error: 'Not authorized to update this offer' });

  const { data, error } = await supabase
    .from('offers')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// DELETE /api/offers/:id
router.delete('/:id', authenticate, async (req, res) => {
  // Verify ownership
  const { data: company } = await supabase
    .from('companies').select('id').eq('user_id', req.user.id).single();
  if (!company) return res.status(403).json({ error: 'Company not found' });
  const { data: offer } = await supabase
    .from('offers').select('company_id').eq('id', req.params.id).single();
  if (!offer || offer.company_id !== company.id) return res.status(403).json({ error: 'Not authorized to delete this offer' });

  const { error } = await supabase.from('offers').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
