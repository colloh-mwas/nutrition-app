const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = "API_KEY_HERE"; // <--- replace this

app.get('/api/recipe', async (req, res) => {
    const query = req.query.q;
    
    if (!query) return res.status(400).json({ error: "No query provided" });

    try {
        const apiURL = `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`;

        const response = await fetch(apiURL, {
            headers: { 'X-Api-Key': API_KEY }
        });


        const text = await response.text();

        if (!response.ok) {
            console.log("API returned non-OK response");
            return res.status(500).json({
                error: "CalorieNinjas API error",
                status: response.status,
                body: text
            });
        }

        let data;
        try {
            data = JSON.parse(text);
        } catch (err) {
            console.log("JSON parse error:", err);
            return res.status(500).json({
                error: "Failed to parse JSON",
                raw: text
            });
        }

        res.json(data);

    } catch (err) {
        console.log("UNEXPECTED SERVER ERROR:");
        console.log(err);

        res.status(500).json({
            error: "Internal server error",
            details: err.message
        });
    }
});

app.listen(4000, () =>
    console.log("Backend running on http://localhost:4000")
);
