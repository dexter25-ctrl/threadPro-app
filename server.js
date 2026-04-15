require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { YoutubeTranscript } = require('youtube-transcript');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper to detect if a string is a video URL
function isVideoUrl(str) {
    const urlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|tiktok\.com|instagram\.com).+$/i;
    return urlPattern.test(str.trim());
}

function isYoutubeUrl(str) {
    const urlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be).+$/i;
    return urlPattern.test(str.trim());
}

app.post('/api/generate', async (req, res) => {
    try {
        const { url: inputContent } = req.body;

        if (!inputContent) {
            return res.status(400).json({ error: "Aucun contenu fourni." });
        }

        let textToAnalyze = "";

        if (isVideoUrl(inputContent)) {
            if (!isYoutubeUrl(inputContent)) {
                // Zéro Hallucination: Signal that transcript extraction is unavailable for non-YouTube platforms
                return res.status(400).json({ error: "La récupération de transcription pour TikTok ou Instagram n'est pas supportée. Seuls les liens YouTube sont acceptés." });
            }

            console.log(`Fetching transcript for YouTube: ${inputContent}`);
            try {
                const transcriptItems = await YoutubeTranscript.fetchTranscript(inputContent);
                if (!transcriptItems || transcriptItems.length === 0) {
                    return res.status(404).json({ error: "La transcription est vide ou indisponible pour cette vidéo." });
                }
                textToAnalyze = transcriptItems.map(item => item.text).join(' ');
            } catch (error) {
                console.error("Transcript fetch error:", error);
                // Zéro Hallucination: If the link is inaccessible or transcript unavailable, signal it.
                return res.status(404).json({ error: "Impossible de récupérer la transcription de cette vidéo YouTube. Assurez-vous que l'URL est valide et que la vidéo possède des sous-titres." });
            }
        } else {
            console.log("Input is not a video URL, treating as standard text...");
            textToAnalyze = inputContent;
        }

        console.log("Generating thread with Gemini...");

        const systemPrompt = `
Tu es un expert en création de threads Twitter/X.
Règles impératives :
1. Priorité aux Données Externes : Tu vas recevoir un texte (soit une transcription de vidéo, soit un texte brut). Tu dois IMPÉRATIVEMENT extraire tes informations de CE texte et l'analyser pour rédiger.
2. Vérification de l'Identité : Assure-toi que les points clés que tu abordes correspondent bien au texte fourni, et non à un sujet précédent ou à des connaissances générales non mentionnées.
3. Zéro Hallucination : Ne t'écarte pas du contenu. Si le sujet n'est pas clair, utilise uniquement les informations fournies, ne les invente pas.
4. Réinitialisation du Contexte : Traite ce texte de manière isolée sans te référer à des conversations passées.

Réponds avec un thread dynamique et engageant. Sépare chaque tweet par une double ligne vide (\\n\\n). Utilise un ton professionnel. Numérote les tweets (ex: 1/, 2/).
        `;

        const userPrompt = `Voici le contenu à analyser :\n\n${textToAnalyze}\n\nCrée un thread à partir de ce contenu.`;

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemPrompt,
        });

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            generationConfig: {
                temperature: 0.3,
            }
        });

        const response = result.response;
        const threadText = response.text();
        const threadItems = threadText.split('\n\n').filter(item => item.trim() !== '');

        res.json({ threadItems });

    } catch (error) {
        console.error("Error generating thread:", error);
        res.status(500).json({ error: "Une erreur est survenue lors de la génération du thread." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
