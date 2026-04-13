require('dotenv').config();
const express = require('express');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const anthropic = new Anthropic();

app.post('/api/generate', async (req, res) => {
  const { characters, count } = req.body;

  if (!characters || !count) {
    return res.status(400).json({ error: 'Missing characters or count' });
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [{
        role: 'user',
        content: `Generate exactly ${count} Thai words for typing practice.

ALLOWED CHARACTERS: ${[...characters].join(' ')}

CRITICAL: Every single character in every word MUST be from the allowed list above. Do NOT use any character not in that list. For example if า is not listed, you cannot use กา.

Rules:
- Return ONLY the words, one per line, nothing else
- Each word 2-4 characters long
- Real Thai words preferred, but simple combinations are OK
- No spaces within words, no English, no numbers, no punctuation

Generate ${count} words now:`
      }]
    });

    const text = message.content[0].text.trim();
    const words = text.split('\n').map(w => w.trim()).filter(w => w.length > 0);
    res.json({ words });
  } catch (err) {
    console.error('Anthropic API error:', err.message);
    res.status(500).json({ error: 'API call failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
