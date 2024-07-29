import express from 'express';
import path from 'path';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});

// Set the static files directory
app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    res.render('/index');
});

// API endpoint to get recipe info
app.get('/api/recipe', async (req, res) => {
    const recipeName = req.query.name as string;
    if (!recipeName) {
        return res.status(400).json({ error: 'Recipe name is required' });
    }

    try {
        const recipeInfo = await getRecipeInfo(recipeName);
        res.json(recipeInfo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recipe information' });
    }
});

const getRecipeInfo = async (recipeName: string) => {
    // 여기에 실제 요리 정보를 얻는 로직을 구현합니다.
    console.log(`${recipeName} start!`);
    const prompt = `요리재료, 대체가능한 재료 그리고 요리방법을 순서대로 
    이런 Json 형태로 알려줘.

    {
        recipeName,
        ingredients: ['ingredient1', 'ingredient2'],
        substitutes: { 'ingredient1': 'substitute1' },
        method: ['Prepare all ingredients.', 'Follow the instructions step by step.']
    }

    재료명이나 요리방식은 모두 한글로 알려줘
    요리명: ${recipeName}
    
    만약 요리이름이 아닌경우에는 
    {
        "error": "조금 더 정확한 이름으로 찾아볼까요?"
    }
    라고 알려줘.`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: 'user',
                content: prompt
            }],
            temperature: 0.7
        });
        console.log(response.choices[0].message.content)
        return JSON.parse(response.choices[0].message.content || 'null' );
    } catch (error) {
        console.log(error);
        return error;
    }
};

app.use((req, res, error) => {
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
