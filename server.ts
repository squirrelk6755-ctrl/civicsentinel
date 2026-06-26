import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase body limit to support base64 image uploads
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Helper function to create Gemini client
  const getGeminiClient = (req: express.Request) => {
    // Check for client-provided API key from headers, otherwise server env
    const apiKey = (req.headers['x-gemini-key'] as string) || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("No Gemini API key found. Please provide an API key in the settings panel.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // API Route: validate-key
  app.post("/api/gemini/validate-key", async (req, res) => {
    try {
      const { key } = req.body;
      if (!key) {
        return res.status(400).json({ error: "Missing API Key" });
      }
      const ai = new GoogleGenAI({ apiKey: key });
      await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: "ping"
      });
      res.json({ valid: true });
    } catch (e: any) {
      console.error("Gemini validation failure:", e);
      res.status(400).json({ valid: false, error: e.message || "Invalid Key" });
    }
  });

  // API Route: analyze-report
  app.post("/api/gemini/analyze-report", async (req, res) => {
    try {
      const { title, description, category, urgency, location, image } = req.body;
      const ai = getGeminiClient(req);

      let contents: any[] = [];
      let promptParts: string[] = [];

      promptParts.push(`You are a civic mediation expert and a professional city planner AI.
Your task is to perform an AI-powered visual/hazard analysis, safety assessment, stakeholder impact mapping, and draft a community consensus plan of a local civic/infrastructure conflict.

Here is the citizen's report details:
Title: ${title}
Category: ${category}
Urgency/Impact: ${urgency}
Location: ${location || 'Municipal Area'}
Description: ${description}

Format your response as a valid JSON object matching the JSON schema below.
${image ? 'CRITICAL: Analyze the uploaded image context to detect objects, assess severity, estimate affected area, determine public safety/environmental/infrastructure impacts, and tailor the hazard analysis.' : 'No image uploaded. Deduce realistic context based on description.'}

If the image is completely unclear, blurry, or lacks any visible infrastructure/environmental hazard, set "isUnclear" to true in the output. Otherwise, set it to false.

Return the exact JSON structure matching the following template:
{
  "hazardType": "A precise, formal title for the detected hazard or conflict",
  "severityScore": 85, // out of 100 based on visual/context cues
  "riskLevel": "Low" | "Medium" | "High" | "Critical",
  "estimatedAffectedArea": "A specific realistic estimated affected area e.g. '150-meter radius around main intersection' or 'Approximately 0.5 sq km'",
  "publicSafetyImpact": "Detailed 1-2 sentence assessment of first-level hazards like pedestrian slips, vehicles, fallback zones",
  "environmentalImpact": "Detailed 1-2 sentence ecological assessment, e.g., runoff, local vegetation contamination, light/noise pollution",
  "infrastructureImpact": "Detailed 1-2 sentence assessment of subgrade integrity, grid load, structural fatigue, etc.",
  "recommendedPriorityLevel": "Low" | "Medium" | "High" | "Emergency",
  "isUnclear": false, // MUST set to true ONLY if the uploaded/selected image is blurry, dark, blank, or completely unrelated to any civic/hazard issue.
  "confidenceScore": 95.8, // out of 100 based on vision model detection alignment (must be a dynamic value like 94.2)
  "detectedObjects": ["Detected Object 1 (confidence%)", "Detected Object 2 (confidence%)", "Detected Object 3 (confidence%)"], // Array of strings representing visual elements or infrastructure points related to this hazard (minimum 3)
  "recommendation": "A detailed engineering safety & planning recommendation to solve this",
  "aiSummary": "A balanced, professional 2-3 sentence executive AI summary explaining the conflict, its impact, and general compromise direction.",
  "stakeholders": [
    {
      "name": "Local Homeowners & Residents",
      "type": "Community Representation",
      "influence": 75, // integer out of 100
      "sentiment": "neutral", // "supportive" | "neutral" | "skeptical" | "opposed"
      "primaryConcern": "Succinctly state their primary concern regarding safety or impact",
      "concerns": ["State concern 1 specifically for this issue", "State concern 2 specifically for this issue"], // Array of strings representing dynamic tailored worries
      "benefits": ["State expected benefit 1 specifically for this issue", "State expected benefit 2 specifically for this issue"], // Array of strings representing dynamic benefits
      "mitigations": ["State suggested mitigation 1 specifically for this issue", "State suggested mitigation 2 specifically for this issue"] // Array of strings representing dynamic mitigations suggested
    },
    ... (MUST generate exactly 4 key stakeholders. Choose highly logical groups based on hazard. Examples: Waterlogging -> Residents, Traffic Police, Municipal Drainage Department, Local Businesses; Broken Streetlight -> Pedestrians, Women Commuters, Students, Electricity Department; Garbage Dump -> Residents, Sanitation Workers, Shopkeepers, Health Department; Road Damage -> Drivers, Emergency Services, Municipal Engineering Department, Delivery Workers; Custom hazards -> generate 4 appropriate groups.)
  ],
  "consensusSteps": [
    {
      "phase": "Phase 1",
      "title": "Phase title",
      "description": "Concrete conflict mitigation or exploration step",
      "votes": 125, // dynamic votes
      "unanimous": false,
      "status": "completed" // "completed" for Phase 1, "active" for Phase 2, "pending" for Phase 3
    },
    {
      "phase": "Phase 2",
      "title": "Phase title",
      "description": "Active active phase",
      "votes": 85,
      "unanimous": false,
      "status": "active"
    },
    {
      "phase": "Phase 3",
      "title": "Phase title",
      "description": "Pending final ratification phase",
      "votes": 195,
      "unanimous": true,
      "status": "pending"
    }
  ],
  "multilingualDrafts": {
    "en": "📢 COMMUNITY NOTICE: AI Sentinel has audited \\"${title}\\". A balanced consensus action plan has been loaded at the public portal.",
    "es": "Spanish translation of the english notice draft",
    "zh": "Chinese translation of the english notice draft",
    "vi": "Vietnamese translation of the english notice draft",
    "hi": "Hindi translation of the english notice draft"
  },
  "multilingualAnalysis": {
    "hi": {
      "hazardType": "Formal Hindi translation of the hazardType",
      "estimatedAffectedArea": "Formal Hindi translation of the estimatedAffectedArea",
      "publicSafetyImpact": "Detailed dynamic Hindi translation of publicSafetyImpact",
      "environmentalImpact": "Detailed dynamic Hindi translation of environmentalImpact",
      "infrastructureImpact": "Detailed dynamic Hindi translation of infrastructureImpact",
      "recommendation": "Detailed dynamic Hindi translation of recommendation",
      "aiSummary": "Detailed dynamic Hindi translation of aiSummary"
    }
  }
}

Do not include any extra markdown formatting wrappers like \`\`\`json. Return only raw stringified JSON. Ensure compliance and validity.`);

      if (image && image.data) {
        // Prepare multimodal contents
        const base64Data = image.data;
        const mimeType = image.mimeType || "image/jpeg";
        contents.push({
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        });
      }

      contents.push({
        text: promptParts.join("\n")
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text || "{}";
      const cleaned = responseText.trim();
      res.json(JSON.parse(cleaned));
    } catch (e: any) {
      console.error("Gemini Analyze Error:", e);
      res.status(500).json({ error: e.message || "Failed to analyze report" });
    }
  });

  // API Route: generate-consensus-plan
  app.post("/api/gemini/generate-consensus-plan", async (req, res) => {
    try {
      const { title, description, category, location, activeReport, directive, tone, focus, lang } = req.body;
      const ai = getGeminiClient(req);

      const targetTitle = title || activeReport?.title || "Civic Project";
      const targetDesc = description || activeReport?.description || "";
      const targetCategory = category || activeReport?.category || "Infrastructure";
      const targetLocation = location || activeReport?.location || "Municipal Zone";

      const prompt = `You are a high-level public diplomat mediator or Panchayat counselor AI.
Generate a comprehensive official public mediation document (Mediation Treaty) in ${lang === 'hi' ? 'Hindi text' : 'English text'} to resolve a municipal infrastructure conflict.

Context details:
Report Title: ${targetTitle}
Category: ${targetCategory}
Description: ${targetDesc}
Location: ${targetLocation}
Arbitration directive: ${directive}
Arbitration mode/tone: ${tone}
Focused stakeholder constituency: ${focus}

Instructions:
Create a highly detailed, professional, authoritative, and structured treaty text.
Structure the treaty with the following sections exactly:
========================================================================
OFFICE OF THE MUNICIPAL COMMISSIONER & CIVIC RESOLUTION BUREAU (or Hindi equivalent if lang is hi)
CIVIL ACTION COEXISTENCE DIVISION
------------------------------------------------------------------------
DOCUMENT TYPE: OFFICIAL PUBLIC MEDIATION INSTRUMENT OF AGREEMENT
DATE OF RATIFICATION: 2026-06-23
ARBITRATOR: AI DIPLOMAT AGENT SYSTEM
DIRECTIVE: [State Directive Name]
ARBITRATION MODE: [State Mode/Tone Name]
========================================================================

PREAMBLE:
[Provide 2-3 detailed paragraphs of professional, formal context introducing the conflict and framing the compromise as a way to restore communal coexistence under article 14-B]

1. COMMUNITY CONCERNS ASSESSED
[Provide a rich, comprehensive bulleted breakdown detailing the unique stakes and fears of each group (Students, Indigenous/Tribal families, property homeowners, shopkeepers, etc.) specifically adjusted for this project.]

2. THE HOLISTIC PROPOSED COMPROMISE SOLUTION
[Draft highly concrete compromise frameworks based on the directive and tone chosen (e.g. subterranean installation, rerouted alignments, green space bio-filters) to bridge both viewpoints or needs.]

3. STRUCTURED SAFETY & RISK MITIGATION PROTOCOLS
[List exact, legally binding safety rules for the construction contractor (e.g. sensor-based monitoring, dusk-to-dawn curfew hours, translucent sound and privacy barriers, dust cannons, etc.)]

4. PHASED CONSTRUCTION TIMELINE
[Provide a clear, quarterly phased execution path (Phase I, Phase II, Phase III, Phase IV) with detailed, realistic task logs.]

5. PUBLIC PARTICIPATION STRATEGY
[Details on joint governance panels, open administrative review boards, real-time telemetry streaming (WQI, noise meters), and citizen feedback voting rights.]

6. EXPECTED OUTCOMES
[Specific metrics on flood-control efficiency, local ecology and old-root trees conservation, resident privacy protection, merchant parking restoration, and commercial growth.]

========================================================================
SIGNATORIES IN AGREEMENT:
[Include digital sign lines for the AI Diplomat, Girls Hostel student committee, Adivasi Elders council, and Municipal engineers]
========================================================================

Output the entire treaty text natively in ${lang === 'hi' ? 'Hindi (हिंदी)' : 'English'}. Keep the visual structure clean and aligned, with separator bars using equal signs (=) and hyphens (-), as modeled in the guidelines. Keep formatting highly polished. Do not use any markdown formatting or \`\`\` code wrappers.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });

      res.json({ treatyText: response.text });
    } catch (e: any) {
      console.error("Gemini Plan Error:", e);
      res.status(500).json({ error: e.message || "Failed to generate consensus plan" });
    }
  });

  // Serve static files in production, Vite in dev
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
