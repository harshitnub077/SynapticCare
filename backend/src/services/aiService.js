const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;
let model = null;

// Only initialize if API key is provided
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_api_key_here") {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log("✅ Gemini API initialized successfully");
} else {
    console.warn("⚠️  Gemini API key not configured. AI features will be disabled.");
}

const SYSTEM_PROMPT = `You are SynapticCare+, an expert AI medical consultant. Your role is to analyze medical reports and provide precise, clinically relevant information for patients.

STRICT INTERACTION FLOW:
1. **Collect basic clinical context without nagging**:
   - Only when the user message looks like an initial greeting or very first contact (e.g., "hi", "hello", "I have a problem") you may ask for: age, sex, approximate weight, major chronic conditions, regular medicines, and drug allergies.
   - If the user already describes symptoms, a diagnosis, or lab values, **do not stop to ask for demographics first**. Instead, answer their question and, at most, add one short line noting that missing information limits accuracy.
   - If the user gives partial info (e.g., just age and sex), **do not ask for the same items again in later replies**. Work with what is available and avoid repeating those questions.
2. **Then focus on the user's concern or uploaded report**:
   - Clarify the main symptom or question (e.g., chest pain, high sugar, lab value) only if it is unclear from the current message.
   - If report data is available, use it; otherwise, reason from general clinical knowledge.

STYLE AND STRUCTURE:
1. **Be Direct & Concise**: Answer the user's question clearly and specifically. Avoid small talk and avoid information that is not directly relevant to the question.
2. **Medical Focus**: Focus on clinical reasoning, likely causes, risk factors, and when to seek urgent care.
3. **No Repetition**: Do not repeat long parts of previous messages or repeat the same advice unless the user explicitly asks for a recap.
4. **Structure**: Prefer short bullet points and brief paragraphs (2–3 sentences). Put the most important answer to the user’s question first.
5. **Tone**: Calm, neutral, and professional.

SAFETY RULES (MANDATORY):
- You are **not the patient's doctor** and you **must not prescribe** specific drugs, doses, or treatment plans.
- You may mention classes of medicines in general terms (e.g., "pain relievers such as paracetamol") but:
  - Do **not** choose exact brands or products for the user.
  - Do **not** give exact doses or duration.
  - Do **not** guarantee a “cure”.
- When the user asks about treatment or medicines:
  - Focus on explaining typical options that doctors consider (e.g., lifestyle changes, common medicine classes, further tests).
  - You may say that, **if a doctor prescribes a medicine**, it can usually be obtained from licensed local pharmacies or reputable online pharmacy platforms, but you must **not** recommend a specific website or give direct purchase links.
- Always explain red-flag symptoms where the user should seek urgent or in‑person medical care.
- **Disclaimer**: End every response with a short footer: "Note: AI analysis. This is not a diagnosis or prescription. Please consult a licensed doctor before taking any medication or buying any medicine."

TASK:
- If analyzing a report: Summarize findings, flag abnormalities with context, and suggest questions the patient should ask their doctor.
- If answering a question: Provide a clear medical explanation, typical next steps, and what to discuss with a healthcare professional.`;

class AIService {
    /**
     * Analyze report using Gemini
     */
    async analyzeReport(parsedData, flags) {
        if (!model) {
            return {
                summary: "AI analysis is currently unavailable. Gemini API key not configured.",
                concerns: [],
                recommendations: ["Please configure GEMINI_API_KEY in .env to enable AI analysis."],
                urgency: "medium",
                disclaimer: "This is not medical advice.",
            };
        }

        try {
            const userPrompt = `
${SYSTEM_PROMPT}

Report Data:
${JSON.stringify(parsedData, null, 2)}

Detected Abnormalities:
${JSON.stringify(flags, null, 2)}

Task:
- Summarize the report in plain language.
- Explain the abnormal results and their potential implications.
- Provide 3 recommended next steps.
- Rate urgency (low/medium/high).

Output format (JSON only, no additional text):
{
  "summary": "...",
  "concerns": ["...", "...", "..."],
  "recommendations": ["...", "...", "..."],
  "urgency": "low|medium|high",
  "disclaimer": "This is not medical advice. Please consult a healthcare professional."
}
`;

            const result = await model.generateContent(userPrompt);
            const response = await result.response;
            const text = response.text();

            // Extract JSON from response (Gemini might wrap it in markdown)
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            return JSON.parse(text);
        } catch (error) {
            console.error("Gemini API error:", error);
            return {
                summary: "Unable to generate AI analysis at this time.",
                concerns: [],
                recommendations: ["Please consult a healthcare professional for interpretation."],
                urgency: "medium",
                disclaimer: "This is not medical advice.",
            };
        }
    }

    /**
     * Chat with AI assistant
     */
    async chat(userMessage, reportContext = null) {
        if (!model) {
            console.log("⚠️ Gemini not configured. Using mock response.");

            const lowerMsg = userMessage.toLowerCase();

            // Simple rule-based responses for demo mode
            if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
                return "Hello! I'm your SynapticCare+ assistant. I'm running in demo mode right now. How can I help you with your health reports today?";
            }

            if (lowerMsg.includes("report") || lowerMsg.includes("result")) {
                return "I can see your reports in the system. In this demo mode, I can tell you that your uploaded files have been processed. For detailed AI analysis of specific values like hemoglobin or glucose, please configure the Gemini API key.";
            }

            if (lowerMsg.includes("blood") || lowerMsg.includes("hemoglobin")) {
                return "Blood test results are important indicators of health. Typically, normal hemoglobin levels are 13.8 to 17.2 gm/dL for men and 12.1 to 15.1 gm/dL for women. Always consult a doctor for accurate interpretation.";
            }

            if (lowerMsg.includes("thank")) {
                return "You're welcome! Stay healthy.";
            }

            return "I'm currently running in demo mode (no Gemini API key configured). I can answer basic questions, but for personalized medical analysis of your specific reports, please add your GEMINI_API_KEY to the .env file.";
        }

        try {
            let prompt = SYSTEM_PROMPT + "\n\n";

            if (reportContext) {
                prompt += `User's Report Context: ${JSON.stringify(reportContext)}\n\n`;
            }

            prompt += `User: ${userMessage}\n\nAssistant:`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Chat API error:", error);
            return "I'm having trouble processing your request. Please try again later.";
        }
    }
}

module.exports = new AIService();
