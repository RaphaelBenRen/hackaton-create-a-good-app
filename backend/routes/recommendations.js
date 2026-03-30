const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// Route to get recommended offers for a student
router.get('/offers/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

    // 1. Fetch student data
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', studentId)
      .single();

    if (studentError || !student) {
      return res.status(404).json({ error: 'Étudiant non trouvé' });
    }

    const studentSkills = student.skills || [];
    const studentQualities = student.qualities || [];
    const studentField = student.study_field || '';
    
    // Create a set of keywords from the student profile (lowercase for case-insensitive matching)
    const profileKeywords = new Set([
      ...studentSkills.map(s => s.toLowerCase()),
      ...studentQualities.map(q => q.toLowerCase()),
      ...studentField.split(' ').map(w => w.toLowerCase())
    ]);

    // 2. Fetch all active offers
    const { data: offers, error: offersError } = await supabase
      .from('offers')
      .select('*, companies(company_name, logo_url)')
      .eq('is_active', true);

    if (offersError) throw offersError;

    // 3. Calculate matching score
    const scoredOffers = offers.map(offer => {
      let score = 0;
      let matchedSkills = [];

      const requiredSkills = offer.skills_required || [];
      const offerDescWords = (offer.description || '').toLowerCase().split(/\\W+/);
      const offerTitleWords = (offer.title || '').toLowerCase().split(/\\W+/);
      
      // Match skills
      requiredSkills.forEach(reqSkill => {
        const lowerReq = reqSkill.toLowerCase();
        if (profileKeywords.has(lowerReq) || studentSkills.some(s => s.toLowerCase().includes(lowerReq))) {
          score += 20; // High weight for exact skill match
          matchedSkills.push(reqSkill);
        }
      });

      // Match sector/field
      if (offer.sector && studentField.toLowerCase().includes(offer.sector.toLowerCase())) {
        score += 30; // Very high weight for matching sector
      }

      // Semantic matching with description & title
      offerTitleWords.forEach(word => {
        if (word.length > 3 && profileKeywords.has(word)) score += 5;
      });
      offerDescWords.forEach(word => {
        if (word.length > 3 && profileKeywords.has(word)) score += 2;
      });

      // Cap at 100%
      const matchPercentage = Math.min(Math.round(score), 100);

      return {
        ...offer,
        matchPercentage,
        matchedSkills
      };
    });

    // Sort by match percentage descending
    scoredOffers.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Return top 15 matches (or ones with > 0% match)
    res.json(scoredOffers.filter(o => o.matchPercentage > 0).slice(0, 15));
  } catch (error) {
    console.error('Erreur recommandations offres:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Route to get recommended candidates for an offer
router.get('/students/:offerId', async (req, res) => {
  try {
    const { offerId } = req.params;

    // 1. Fetch offer data
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select('*')
      .eq('id', offerId)
      .single();

    if (offerError || !offer) {
      return res.status(404).json({ error: 'Offre non trouvée' });
    }

    const requiredSkills = offer.skills_required || [];
    const offerSector = offer.sector || '';

    // 2. Fetch all active students
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('*')
      .in('search_status', ['active', 'open']);

    if (studentsError) throw studentsError;

    // 3. Calculate matching score
    const scoredStudents = students.map(student => {
      let score = 0;
      let matchedSkills = [];

      const studentSkills = student.skills || [];
      const studentField = student.study_field || '';

      // Match skills
      requiredSkills.forEach(reqSkill => {
        const lowerReq = reqSkill.toLowerCase();
        if (studentSkills.some(s => s.toLowerCase().includes(lowerReq))) {
          score += 25;
          matchedSkills.push(reqSkill);
        }
      });

      // Match sector/field
      if (offerSector && studentField.toLowerCase().includes(offerSector.toLowerCase())) {
        score += 25;
      }
      
      // Bonus if they have many qualities or experiences (shows active profile)
      if (student.qualities && student.qualities.length > 0) score += 10;
      if (student.experiences && student.experiences.length > 0) score += 10;

      const matchPercentage = Math.min(Math.round(score), 100);

      return {
        ...student,
        matchPercentage,
        matchedSkills
      };
    });

    scoredStudents.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    res.json(scoredStudents.filter(s => s.matchPercentage > 0).slice(0, 10));
  } catch (error) {
    console.error('Erreur recommandations candidats:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
