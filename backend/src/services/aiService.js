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
    async analyzeReport(parsedData, flags, rawText = null) {
        if (!model) {
            return {
                summary: "AI analysis is currently unavailable. Gemini API key not configured.",
                concerns: [],
                recommendations: ["Please configure GEMINI_API_KEY in .env to enable AI analysis."],
                urgency: "medium",
                disclaimer: "This is not medical advice. Please consult a healthcare professional.",
            };
        }

        try {
            // Build comprehensive prompt for patient summary
            const hasAbnormalities = flags && flags.length > 0;
            const hasData = parsedData && parsedData.length > 0;
            
            let dataContext = "";
            if (hasData) {
                dataContext = `\n\nLABORATORY RESULTS FOUND:\n${JSON.stringify(parsedData, null, 2)}`;
            }
            
            // Always include the FULL extracted text for comprehensive analysis
            if (rawText && rawText.trim().length > 0) {
                // Use the complete extracted text - Gemini can handle large contexts
                const fullText = rawText.trim();
                dataContext += `\n\nCOMPLETE EXTRACTED REPORT TEXT (scanned from entire image):\n${fullText}\n\n`;
                dataContext += "Analyze ALL the text above comprehensively. Look for:\n";
                dataContext += "- Patient name, age, gender, date of report\n";
                dataContext += "- All test names and values (even if not in structured format)\n";
                dataContext += "- Doctor's notes, observations, or comments\n";
                dataContext += "- Diagnosis, findings, or recommendations mentioned\n";
                dataContext += "- Any abnormal values or flagged items\n";
                dataContext += "- Reference ranges or normal values mentioned\n";
            } else {
                dataContext += "\n\nNote: No text was extracted from the image. Please ensure the image is clear and readable.";
            }

            let abnormalityContext = "";
            if (hasAbnormalities) {
                abnormalityContext = `\n\nABNORMAL VALUES DETECTED:\n${JSON.stringify(flags, null, 2)}\n\nPay special attention to these abnormal values and explain their clinical significance.`;
            } else if (hasData) {
                abnormalityContext = "\n\nAll detected lab values appear to be within normal ranges. Mention this in the summary.";
            }

            const userPrompt = `You are an expert medical AI assistant analyzing a complete medical report that was scanned from an image using OCR (Optical Character Recognition) technology.

CRITICAL INSTRUCTIONS:
- The text below was extracted by scanning the ENTIRE medical report image pixel by pixel
- You MUST analyze EVERY piece of information in the extracted text
- Do NOT skip any sections, values, notes, or findings
- Extract patient information, test results, doctor's notes, and all clinical data
- Provide a comprehensive analysis covering ALL aspects of the report

${dataContext}${abnormalityContext}

TASK: Generate a comprehensive patient summary by analyzing ALL the information in the scanned report. Your analysis must be thorough and cover:

1. **Summary** (1-2 short paragraphs, simple language): 
   - Write in VERY SIMPLE, EASY-TO-UNDERSTAND language that anyone can read
   - Keep it SHORT and CONCISE - maximum 4-5 sentences total
   - Use everyday words, avoid medical jargon
   - Briefly explain what the report shows in plain terms
   - Mention the main findings only
   - If something is wrong, say it simply (e.g., "Your blood sugar is high" not "Hyperglycemia detected")

2. **Concerns** (array of 2-4 items, simple language):
   - List only the main problems found
   - Write each concern in SIMPLE language (e.g., "Your hemoglobin is low" not "Hemoglobin levels below reference range")
   - Keep each concern to 1 sentence maximum
   - Use everyday words that patients understand
   - If no problems found, say "All test results look normal"

3. **Recommendations** (array of 2-3 items, simple language):
   - Give simple, clear advice (e.g., "See your doctor soon" not "Consult a healthcare professional")
   - Keep each recommendation to 1 sentence
   - Use plain language
   - Focus on what the patient should do next

4. **Urgency** (one of: "low", "medium", "high"):
   - "low": Routine follow-up, no immediate action needed
   - "medium": Should consult doctor soon, but not emergency
   - "high": Requires prompt medical attention or immediate care

5. **Disclaimer**: Always include: "This is not medical advice. Please consult a healthcare professional."

OUTPUT FORMAT (JSON only, no markdown code blocks, no additional text):
{
  "summary": "Detailed 2-3 paragraph summary here...",
  "concerns": ["Concern 1", "Concern 2", "Concern 3"],
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "urgency": "low|medium|high",
  "disclaimer": "This is not medical advice. Please consult a healthcare professional."
}`;

            const result = await model.generateContent(userPrompt);
            const response = await result.response;
            const text = response.text();

            // Clean the response - remove markdown code blocks if present
            let cleanedText = text.trim();
            if (cleanedText.startsWith("```json")) {
                cleanedText = cleanedText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
            } else if (cleanedText.startsWith("```")) {
                cleanedText = cleanedText.replace(/```\n?/g, "");
            }

            // Extract JSON from response
            const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                
                // Ensure all required fields exist
                return {
                    summary: parsed.summary || "Report analysis completed. Please review the detailed findings below.",
                    concerns: Array.isArray(parsed.concerns) ? parsed.concerns : [],
                    recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
                    urgency: parsed.urgency || "medium",
                    disclaimer: parsed.disclaimer || "This is not medical advice. Please consult a healthcare professional.",
                };
            }

            // Fallback if JSON parsing fails
            return {
                summary: cleanedText.substring(0, 500) || "Unable to parse AI response.",
                concerns: [],
                recommendations: ["Please consult a healthcare professional for detailed interpretation."],
                urgency: "medium",
                disclaimer: "This is not medical advice. Please consult a healthcare professional.",
            };
        } catch (error) {
            console.error("Gemini API error:", error);
            return {
                summary: "Unable to generate AI analysis at this time. Please try again or consult a healthcare professional.",
                concerns: [],
                recommendations: ["Please consult a healthcare professional for interpretation."],
                urgency: "medium",
                disclaimer: "This is not medical advice. Please consult a healthcare professional.",
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
