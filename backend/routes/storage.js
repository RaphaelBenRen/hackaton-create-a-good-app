const router = require('express').Router();
const multer = require('multer');
const supabase = require('../supabase');
const authenticate = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/storage/cv — upload CV
router.post('/cv', authenticate, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier' });

  const ext = req.file.originalname.split('.').pop().toLowerCase();
  if (ext !== 'pdf' || req.file.mimetype !== 'application/pdf') {
    return res.status(400).json({ error: 'Only PDF files are allowed for CVs' });
  }
  const path = `${req.user.id}/cv.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('CV')
    .upload(path, req.file.buffer, { upsert: true, contentType: req.file.mimetype });

  if (uploadError) return res.status(400).json({ error: uploadError.message });

  const { data: urlData } = supabase.storage.from('CV').getPublicUrl(path);
  const cvUrl = urlData?.publicUrl || null;

  // Update student profile
  await supabase
    .from('students')
    .update({ cv_url: cvUrl })
    .eq('user_id', req.user.id);

  res.json({ cv_url: cvUrl });
});

// DELETE /api/storage/cv
router.delete('/cv', authenticate, async (req, res) => {
  const files = [`${req.user.id}/cv.pdf`, `${req.user.id}/cv.doc`, `${req.user.id}/cv.docx`];
  await supabase.storage.from('CV').remove(files);
  await supabase.from('students').update({ cv_url: null }).eq('user_id', req.user.id);
  res.json({ success: true });
});

// GET /api/storage/cv/:userId — download CV
router.get('/cv/:userId', authenticate, async (req, res) => {
  const { data: student } = await supabase
    .from('students').select('cv_url').eq('user_id', req.params.userId).single();
  if (!student?.cv_url) return res.status(404).json({ error: 'CV not found' });

  // Download from Supabase and pipe
  const response = await fetch(student.cv_url);
  const buffer = await response.arrayBuffer();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="cv.pdf"`);
  res.send(Buffer.from(buffer));
});

module.exports = router;
