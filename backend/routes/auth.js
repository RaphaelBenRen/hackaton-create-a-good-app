const router = require('express').Router();
const supabase = require('../supabase');
const authenticate = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  if (!req.body) return res.status(400).json({ error: 'Request body is required' });
  const { email, password } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Valid email is required' });
  if (!password || password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  if (!req.body) return res.status(400).json({ error: 'Request body is required' });
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET /api/auth/me — get current user profile (student or company)
router.get('/me', authenticate, async (req, res) => {
  const userId = req.user.id;

  const { data: student } = await supabase
    .from('students').select('*').eq('user_id', userId).single();
  if (student) return res.json({ role: 'student', profile: student });

  const { data: company } = await supabase
    .from('companies').select('*').eq('user_id', userId).single();
  if (company) return res.json({ role: 'company', profile: company });

  res.json({ role: null, profile: null });
});

module.exports = router;
