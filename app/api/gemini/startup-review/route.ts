import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        review: `### Nexivra AI Analyst Feedback (Simulation Mode)

Thank you for submitting your pitch!

**Notice:** To enable live Gemini AI reviews, please add your \`GEMINI_API_KEY\` in **Settings > Secrets**.

1. **Value Proposition:** Concept seems viable, solving a real-world pain point.
2. **Moat / Scalability:** Good initial approach; focus on securing early partners.
3. **Suggested Next Steps:** Connect with a senior startup founder in our **Mentors** tab for localized deck advice.`
      });
    }

    const { title, elevator, market, model } = await req.json();

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `You are an expert venture capitalist and startup incubator analyst at Rooman University's Nexivra portal.
Analyze the following student/alumni startup pitch outline and provide detailed, constructive, and highly professional VC-style analysis.

Startup Name: ${title}
Elevator Pitch: ${elevator}
Target Market: ${market}
Business Model: ${model || "Not specified"}

Format the response beautifully using Markdown with clear numbered/bulleted points, evaluating:
1. Concept Viability & Problem-Solution Fit
2. Market Opportunities & GTM (Go-To-Market) Strategy
3. Constructive Moat Suggestions (how to defend against competitors)
4. Specific Recommendations (e.g. suggesting they connect with a founder or mentor)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return NextResponse.json({ review: response.text });
  } catch (error: any) {
    console.error("Gemini Startup Review Error:", error);
    return NextResponse.json({ 
      error: error.message,
      review: "An error occurred while compiling AI analysis. Please verify your GEMINI_API_KEY."
    }, { status: 500 });
  }
}
