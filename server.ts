import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Persistent JSON file user database setup
const USERS_FILE = path.join(process.cwd(), 'users.json');

if (!fs.existsSync(USERS_FILE)) {
  const initialUsers = [
    {
      name: 'Suresh Perera',
      emailOrPhone: 'suresh@taiga.lk',
      password: 'password123',
      role: 'user',
    },
    {
      name: 'Taiga Admin',
      emailOrPhone: 'admin@taiga.lk',
      password: 'admin123',
      role: 'admin',
    },
    {
      name: 'Taiga Vendor',
      emailOrPhone: 'vendor@taiga.lk',
      password: 'vendor123',
      role: 'vendor',
    },
  ];
  fs.writeFileSync(USERS_FILE, JSON.stringify(initialUsers, null, 2), 'utf8');
}

function getUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading users file:', e);
  }
  return [];
}

function saveUsers(users: any[]) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing users file:', e);
  }
}

// Auth Endpoints
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, emailOrPhone, password, role } = req.body;
    if (!name || !emailOrPhone || !password) {
      return res.status(400).json({ error: 'Name, email/phone, and password are required' });
    }

    const users = getUsers();
    const normalizedInput = emailOrPhone.trim().toLowerCase();

    const exists = users.find((u: any) => u.emailOrPhone.toLowerCase() === normalizedInput);
    if (exists) {
      return res.status(400).json({ error: 'A user with this email or phone already exists' });
    }

    const newUser = {
      name: name.trim(),
      emailOrPhone: normalizedInput,
      password: password,
      role: role || 'user',
    };

    users.push(newUser);
    saveUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ user: userWithoutPassword });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register user', details: error.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    if (!emailOrPhone || !password) {
      return res.status(400).json({ error: 'Email/phone and password are required' });
    }

    const users = getUsers();
    const normalizedInput = emailOrPhone.trim().toLowerCase();

    const user = users.find(
      (u: any) => u.emailOrPhone.toLowerCase() === normalizedInput && u.password === password
    );

    if (!user) {
      return res.status(400).json({ error: 'Invalid email/phone or password' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login', details: error.message });
  }
});

// Initialize Gemini SDK lazily to avoid crashing on start if key is missing
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('WARNING: GEMINI_API_KEY is not configured in environment secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || 'MOCK_KEY_FOR_NON_BREAKING_STARTS',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. AI Shopping Assistant Route
app.post('/api/chat-assistant', async (req, res) => {
  try {
    const { messages, contextProduct } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const ai = getAiClient();
    if (!process.env.GEMINI_API_KEY) {
      // Return a simulated, friendly response if the API key is not yet set up
      return res.json({
        text: "👋 Ayubowan! I am your Market Treats AI Shop Assistant. (Note: Please set your GEMINI_API_KEY in Settings > Secrets to enable live Gemini AI!). In the meantime, I can tell you that we have excellent deals on the Samsung Galaxy A55 and Nike Air Max shoes with Sri Lankan Rupee pricing! Let me know if you would like me to add these to your cart or recommend anything else!"
      });
    }

    // Format the conversation for Gemini
    const systemInstruction = `You are "Daraz Smart Assistant", a friendly, high-energy Sri Lankan shopping helper. 
Your goal is to help customers find products, give deals, calculate discounts, and help them checkout. 
Be helpful, energetic, and talk like a local shopping host (use words like "Ayubowan", "Machan", "Deals" or standard retail jargon, but stay professional). 
Always refer to pricing in Sri Lankan Rupees (LKR).
If the user asks about a product, here is the context product details: ${JSON.stringify(contextProduct || 'None selected')}.
Keep responses relatively concise, scannable, and styled with markdown (bullet points, bold highlights, LKR pricing format).`;

    // Map messages array to Gemini format
    // We can join them together as a combined prompt to simplify
    const conversationPrompt = messages.map((m: any) => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n') + '\nAssistant:';

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: conversationPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini Chat Error:', error);
    res.status(500).json({ error: 'Failed to generate response', details: error.message });
  }
});

// 2. AI Product Review / Description Generator Route
app.post('/api/generate-review', async (req, res) => {
  try {
    const { productTitle, rating } = req.body;
    if (!productTitle) {
      return res.status(400).json({ error: 'productTitle is required' });
    }

    const ai = getAiClient();
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        comment: `Excellent product! Reached Colombo within 2 days. The quality of this ${productTitle} is top-notch for the price. Highly recommend this seller!`
      });
    }

    const prompt = `Write a realistic, brief, high-energy shopping review for ${productTitle} with a star rating of ${rating}/5. 
The review should sound like a real buyer from Sri Lanka (mentioning local elements like fast delivery to Colombo, Kandy, or Gampaha, or friendly courier). 
Keep it under 3 lines, authentic, and direct. Do not use generic corporate language.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    res.json({ comment: response.text?.trim() });
  } catch (error: any) {
    console.error('Gemini Review Generator Error:', error);
    res.status(500).json({ error: 'Failed to generate review comment', details: error.message });
  }
});

// Serve static assets and Vite middleware
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('[Server] Critical start failure:', err);
});
