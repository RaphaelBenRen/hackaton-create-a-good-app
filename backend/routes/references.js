const router = require('express').Router();
const supabase = require('../supabase');
const authenticate = require('../middleware/auth');

// GET /api/references - Fetch jobs, sectors, and cities
router.get('/', authenticate, async (req, res) => {
  try {
    const [jobsRes, sectorsRes, citiesRes, skillsRes] = await Promise.all([
      supabase.from('reference_jobs').select('*').order('name'),
      supabase.from('reference_sectors').select('*').order('name'),
      supabase.from('reference_cities').select('*').order('name'),
      supabase.from('reference_skills').select('*').order('name')
    ]);

    res.json({
      jobs: jobsRes.data || [],
      sectors: sectorsRes.data || [],
      cities: citiesRes.data || [],
      skills: skillsRes.data || []
    });
  } catch (error) {
    console.error('References error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
