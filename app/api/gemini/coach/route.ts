import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        text: `Hello! I am your Nexivra AI Career Coach. 🎓🤖

**Notice:** To get live AI coaching advice, please configure your \`GEMINI_API_KEY\` in **Settings > Secrets**.

In simulation mode, here is standard guidance:
1. **Resume Tip:** Ensure your resume begins with a strong profile summary highlighting achievements and specific metrics (e.g., 'Optimized query latencies by 30%').
2. **Networking Tip:** When reaching out to senior alumni, be brief, state what you have in common (e.g., graduated from Rooman University), and ask for a quick 10-minute chat rather than a job right away.`
      });
    }

    const { prompt } = await req.json();

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the Nexivra AI Career Coach, a virtual mentor for Rooman University's alumni and student network. You help users write professional posts, craft networking template messages, review resumes, suggest career paths, and simulate mock interview questions. Keep answers clear, supportive, professional, and structured using clean formatting.",
      }
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Coach Error:", error);
    return NextResponse.json({ 
      error: error.message,
      text: "I ran into an issue connecting to my core brain. Please check your GEMINI_API_KEY in Secrets."
    }, { status: 500 });
  }
}
