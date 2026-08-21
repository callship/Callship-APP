import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Callship API" });
});

// AI Icebreakers & Late-to-the-Party Scripts Generator
app.post("/api/ai/icebreakers", async (req, res) => {
  try {
    const { contactName, relationship, vibe, notes, daysSinceLastContact, userTone } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      // Return high quality built-in ADHD fallback scripts if no API key
      return res.json({
        success: true,
        source: "fallback",
        scripts: [
          {
            title: "ADHD Brain Truth (Light & Real)",
            text: `Hey ${contactName}! My ADHD brain put you in a drawer for a bit, but I'm pulling you back out because I was just thinking of you and miss you! How are you doing?`,
            tag: "Shame-Free",
          },
          {
            title: "Casual & Low Pressure",
            text: `Hey ${contactName}! Zero pressure to reply right away, just wanted to send some love and see how life has been treating you lately!`,
            tag: "Zero Pressure",
          },
          {
            title: "Quick Spark Check-in",
            text: `Hey ${contactName}, saw something today that reminded me of you! Hope things are going great with you. Let's catch up for 5 mins whenever you're free!`,
            tag: "Friendly Spark",
          },
        ],
      });
    }

    const prompt = `You are a warm, empathetic communication assistant for people with ADHD in an app called Callship.
People with ADHD struggle with "out of sight, out of mind" (social object permanence), time blindness, and Rejection Sensitive Dysphoria (fear that after weeks/months of silence, reaching out is awkward or shameful).

Generate 3 distinct, ready-to-send text/call opening scripts to reach out to this contact.
Contact Details:
- Name: ${contactName || "Friend"}
- Relationship / Category: ${relationship || "Friend"}
- Vibe / Orbit: ${vibe || "Warm Orbit"}
- Notes / Context about them: ${notes || "None provided"}
- Days since last connection: ${daysSinceLastContact || "A while"}
- Preferred Tone: ${userTone || "Casual, lighthearted, and shame-free"}

Return ONLY a JSON array with 3 objects formatted as:
[
  {
    "title": "Short title describing style (e.g. 'ADHD Truth & Charm', 'Low-Stakes Hug', 'Memory Callback')",
    "text": "The exact script to send or say (natural, warm, zero shame, 1-3 sentences)",
    "tag": "e.g. 'Shame-Free' | 'Low Pressure' | 'Playful' | 'Deep Catch-up'"
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const rawText = response.text || "[]";
    let parsed = [];
    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = [
        {
          title: "ADHD Brain Truth (Light & Real)",
          text: `Hey ${contactName}! My ADHD brain put you in a drawer for a bit, but I'm pulling you back out because I was just thinking of you! How are things going?`,
          tag: "Shame-Free",
        },
        {
          title: "Casual & Low Pressure",
          text: `Hey ${contactName}! Zero pressure to reply right away, just wanted to check in and see how you're doing!`,
          tag: "Zero Pressure",
        },
      ];
    }

    return res.json({ success: true, source: "gemini", scripts: parsed });
  } catch (error: any) {
    console.error("Gemini Icebreaker error:", error);
    return res.json({
      success: true,
      source: "fallback",
      scripts: [
        {
          title: "Warm ADHD Truth",
          text: `Hey! Time flew by in a blur, but you popped into my head and I wanted to say hi! No pressure to reply right away, hope you're having an awesome week!`,
          tag: "Shame-Free",
        },
        {
          title: "Quick Spark",
          text: `Hey! Just thought of you and wanted to check in. How's everything going?`,
          tag: "Casual",
        },
      ],
    });
  }
});

// AI Call Prep & Talking Points Generator (Pre-call anxiety reducer)
app.post("/api/ai/prep", async (req, res) => {
  try {
    const { contactName, notes, relationship } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        source: "fallback",
        points: [
          `Ask how their recent projects and life updates are going`,
          `Keep it low pressure—even a 3-5 minute quick hello is a huge win`,
          `Mention you were just thinking about them and wanted to hear their voice`,
        ],
      });
    }

    const prompt = `You are a pre-call helper for an ADHD user feeling phone anxiety before calling "${contactName}" (${relationship || "Contact"}).
Their saved scratchpad notes: "${notes || "No previous notes"}".
Provide 3 concise, bullet-ready talking points or low-stress conversation prompts to make the call effortless and enjoyable.
Return ONLY a JSON array of 3 strings. Example: ["Ask about ...", "Bring up ...", "Suggest ..."]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let points = [];
    try {
      points = JSON.parse(response.text || "[]");
    } catch {
      points = [
        `Ask how their week is rolling along`,
        `Share a brief funny thought or memory`,
        `Remember: a 2-minute call is 100% valid!`,
      ];
    }

    return res.json({ success: true, source: "gemini", points });
  } catch (error: any) {
    console.error("Gemini Prep error:", error);
    return res.json({
      success: true,
      source: "fallback",
      points: [
        `Ask about what they've been excited about lately`,
        `Check in on what's new in their world`,
        `Set a comfortable 5-minute timer so you don't feel trapped in an endless call`,
      ],
    });
  }
});

// Vite middleware in dev, static in prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Callship server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
