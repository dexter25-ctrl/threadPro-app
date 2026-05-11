import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
    // Configuration pour autoriser la connexion
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    try {
        const { url: textInput } = req.body; 
        
        if (!textInput) {
            return res.status(400).json({ error: 'Texte manquant' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `Transforme le texte suivant en un thread Twitter captivant de 5 tweets maximum. Sépare chaque tweet par une double ligne vide. Texte : ${textInput}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        const threadItems = responseText.split('\n\n').filter(t => t.trim());
        
        res.status(200).json({ threadItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la génération' });
    }
}
