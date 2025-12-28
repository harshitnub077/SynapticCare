const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;
let model = null;

const apiKey = (process.env.GEMINI_API_KEY || "").trim();
const isDummyKey = apiKey === "your-gemini-api-key-here" || apiKey === "your_api_key_here" || apiKey === "";

if (apiKey && !isDummyKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash as originally intended
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("✅ Gemini API initialized successfully");
} else {
    console.warn("⚠️  Gemini API key not configured or dummy key used. AI features will be disabled.");
}

const SYSTEM_PROMPT = `You are SynapticCare+, an advanced expert AI medical consultant designed to provide detailed, clinically accurate medical guidance. Your goal is to help patients understand their health better by asking specific medical questions and providing clear explanations of potential treatments, while maintaining safety boundaries.

STRICT INTERACTION FLOW:
1. **Medical History Taking (Be Specific)**:
   - When a user presents a symptom, Ask 2-3 targeted, clinically relevant questions to narrow down the differential diagnosis (e.g., "radiating pain", "aggravating factors", "duration").
   - Do NOT just ask generic questions; use your medical knowledge to probe for specific red flags or associated symptoms.

2. **Analysis & Treatment Guidance**:
   - **Explain the "Why"**: Clearly explain the physiological or pathological cause of their symptoms.
   - **Mention Treatments/Medicines**: You MAY list standard, over-the-counter medications and common prescription classes used for the condition (e.g., "For tension headaches, first-line treatments often include NSAIDs like Ibuprofen or Paracetamol...").
   - **Home Risks & Remedies**: Suggest non-pharmacological remedies (e.g., "hydration", "cold compress").
   - **Safety First**: ALWAYS preface specific medicine names with "Common pharmacological treatments include..." or "Doctors often prescribe..." and NEVER say "I prescribe..." or "You must take...".

3. **Analysis of Reports**:
   - If a report is provided, analyze every abnormal value detailedly. Explain the clinical significance and what it might indicate about their organ function or disease state.

STYLE AND STRUCTURE:
1. **Professional & Authoritative**: Use precise medical terminology but explain it immediately in plain English.
2. **Structured Response**: Use bold headings for **Symptoms**, **Possible Causes**, **Treatment Options**, and **Next Steps**.
3. **Comprehensive**: Don't be too brief. Give a fulfilling, thorough answer that educates the user.

SAFETY RULES (MANDATORY):
- You are **not a doctor** and cannot issue valid prescriptions.
- **Critical Disclaimer**: You MUST end every message with: "Note: This information is for educational purposes. I am an AI, not a doctor. Please verify any medication choices with a licensed physician."
- If symptoms suggest a life-threatening emergency (e.g., heart attack signs, stroke signs), explicitly tell them to go to the ER immediately.`;

class AIService {
    /**
     * Helper to get or initialize the model
     */
    getModel() {
        if (model) return model;

        const apiKey = (process.env.GEMINI_API_KEY || "").trim();
        const isDummyKey = apiKey === "your-gemini-api-key-here" || apiKey === "your_api_key_here" || apiKey === "";

        if (apiKey && !isDummyKey) {
            try {
                genAI = new GoogleGenerativeAI(apiKey);
                model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                console.log("✅ Gemini API initialized successfully (Lazy Load)");
                return model;
            } catch (error) {
                console.error("❌ Failed to initialize Gemini API:", error.message);
                return null;
            }
        }
        return null;
    }

    /**
     * Analyze report using Gemini
     */
    async analyzeReport(parsedData, flags, rawText = null) {
        const aiModel = this.getModel();

        if (!aiModel) {
            console.warn("⚠️  Gemini API key not configured or invalid. Falling back to mock.");
            return this.getMockReportAnalysis();
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

            const result = await aiModel.generateContent(userPrompt);
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

            // Fallback to mock analysis so the UI doesn't break for the user
            console.log("Falling back to Mock Report Analysis");
            return this.getMockReportAnalysis();
        }
    }

    /**
     * Chat with AI assistant
     */
    /**
     * Chat with AI assistant
     */
    async getChatResponse(userMessage, context = []) {
        const aiModel = this.getModel();

        if (!aiModel) {
            console.log("⚠️ Gemini not configured (or init failed). Using mock response.");

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

            // Add chat history context
            if (context && context.length > 0) {
                prompt += "PREVIOUS CONVERSATION:\n";
                context.forEach(msg => {
                    const role = msg.role === "user" ? "User" : "Assistant";
                    prompt += `${role}: ${msg.content}\n`;
                });
                prompt += "\n";
            }

            prompt += `User: ${userMessage}\n\nAssistant:`;

            console.log(`[AI Service] Calling Gemini API with prompt length: ${prompt.length}`);
            const result = await aiModel.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            console.log(`[AI Service] Received response length: ${text.length}`);
            return text + "\n\n_(✅ Analyzed by Gemini 1.5)_";
        } catch (error) {
            console.error("[AI Service] Chat API error message:", error.message);

            // Safe logging to avoid circular structure errors
            try {
                if (error.response) console.error("API Response Error:", error.response.data);
            } catch (e) { /* ignore log error */ }

            // Detailed fallback for debugging
            console.log("[AI Service] Falling back to Mock AI response");
            try {
                const mockResponse = this.getMockChatResponse(userMessage);
                return `${mockResponse}\n\n_(⚠️ Gemini Error: ${error.message} - Using Backup System)_`;
            } catch (fallbackError) {
                return "I'm having trouble connecting to the AI, but I'm here to help. Please try asking again.";
            }
        }
    }

    /**
     * Generate sophisticated mock responses based on keywords
     */
    getMockChatResponse(message) {
        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes("hi") || lowerMsg.includes("hello") || lowerMsg.includes("hey")) {
            return "Hello! I'm your SynapticCare+ health assistant. I can help explain your medical reports, answer general health questions, or guide you through the app. How can I help you today?";
        }

        if (lowerMsg.includes("appointment") || lowerMsg.includes("book")) {
            return "To book an appointment, go to the 'Find Doctors' page (click 'Doctors' in the sidebar). You can search for specialists and book a slot that works for you.";
        }

        if (lowerMsg.includes("report") || lowerMsg.includes("upload")) {
            return "You can upload medical reports in the 'Upload Report' section. I'll analyze them for you! (Note: In this demo version, I will provide a simulated analysis if real AI processing isn't available).";
        }

        if (lowerMsg.includes("pain") || lowerMsg.includes("symptom") || lowerMsg.includes("sick")) {
            return "I'm sorry to hear you're not feeling well. Common recommendations include rest and hydration, but as an AI, I cannot provide a diagnosis. Please book an appointment with one of our doctors for a proper check-up.";
        }

        if (lowerMsg.includes("thank")) {
            return "You're very welcome! Let me know if you need anything else.";
        }

        return "I understand. Since I'm currently operating in offline mode, I can't provide a specific medical analysis for that query. However, I suggest checking your latest reports in the dashboard or consulting with a doctor for personalized advice.";
    }


    /**
     * Generate mock report analysis
     */
    getMockReportAnalysis(filename) {
        return {
            summary: "This report indicates generally normal parameters with a few minor fluctuations. The blood counts are stable, and organ function tests appear within standard range. A comprehensive review by a physician is recommended to correlate these findings with clinical symptoms.",
            concerns: [
                "Minor variation in lymphocyte count (Common in recovery phases)",
                "Vitamin D levels could be optimized"
            ],
            recommendations: [
                "Maintain a balanced diet rich in leafy greens",
                "Consider a follow-up appointment in 6 months",
                "Daily moderate exercise is encouraged"
            ],
            urgency: "low",
            disclaimer: "This is a SIMULATED analysis for demonstration purposes. Please consult a real doctor.",
        };
    }
}

module.exports = new AIService();
