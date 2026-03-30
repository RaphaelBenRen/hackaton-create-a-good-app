const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { OpenAI } = require("openai");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/analyze", upload.single("cv"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier CV fourni" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "La clé API OPENAI_API_KEY n'est pas configurée dans le backend" });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const pdfData = await pdfParse(req.file.buffer);
    const cvText = pdfData.text;

    if (!cvText || cvText.trim().length === 0) {
      return res.status(400).json({ error: "Impossible de lire le texte de ce CV" });
    }

    const prompt = `Vous êtes un expert en recrutement. Analysez le CV suivant et extrayez les informations de manière structurée au format JSON exact, sans aucun autre texte avant ou après.
    
Format JSON attendu :
{
  "skills": ["Compétence 1", "Compétence 2"],
  "qualities": ["Qualité 1", "Qualité 2"],
  "education": [
    { "degree": "Nom du diplôme", "institution": "École", "year": "Année" }
  ],
  "experiences": [
    { "title": "Poste", "company": "Entreprise", "duration": "Durée" }
  ]
}

Texte du CV :
${cvText}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Tu es un extracteur de données JSON. Réponds uniquement avec le JSON valide, sans formattage Markdown." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1
    });

    const outputText = completion.choices[0].message.content;
    const extractedData = JSON.parse(outputText);

    res.json(extractedData);
  } catch (error) {
    console.error("Erreur lors de l'analyse du CV:", error);
    res.status(500).json({ error: "Erreur lors de l'analyse du CV", details: error.message });
  }
});

module.exports = router;
