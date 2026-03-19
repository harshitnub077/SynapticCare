const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");

let genAI = null;
let model = null;
let groq = null;

const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey.startsWith("gsk_")) {
    groq = new Groq({ apiKey });
    console.log("✅ Groq API initialized successfully");
} else if (apiKey && apiKey !== "your-gemini-api-key-here" && apiKey !== "your_api_key_here") {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log("✅ Gemini API initialized successfully");
} else {
    console.warn("⚠️  No valid AI API key configured. AI features will run in demo fallback.");
}

const SYSTEM_PROMPT = `You are SynapticCare+, an expert AI medical consultant. Your role is to analyze medical reports and provide precise, clinically relevant information for patients.

STRICT INTERACTION FLOW:
1. **Welcome Friendly & Polite**:
   - For initial greetings (e.g., "hi", "hello", "good morning"), introduce yourself humbly as SynapticCare+ and ask how you can help.
   - **Do NOT** ask for age, sex, weight, or medical history questionnaire upfront on a simple greeting. Only ask for context if the user explicitly describes a symptom or report that requires clarification to reason safely.
2. **Then focus on the user's concern or uploaded report**:
   - Clarify the main symptom or question (e.g., chest pain, high sugar, lab value) only if it is unclear from the current message.
   - If report data is available, use it; otherwise, reason from general clinical knowledge.

STYLE AND STRUCTURE:
1. **Be Direct & Concise**: Answer the user's question clearly and specifically. Avoid small talk and avoid information that is not directly relevant to the question.
2. **Medical Focus**: Focus on clinical reasoning, likely causes, risk factors, and when to seek urgent care.
3. **No Repetition**: Do not repeat long parts of previous messages or repeat the same advice unless the user explicitly asks for a recap.
4. **Formatting**: Use Markdown headings (e.g., ###), bold styling for critical items, and bullets for scanner readability.
5. **Tone**: Warm yet clinical, highly professional, empathetic, and neutral.
6. **Standard Response Layout**: For all detailed queries, structure your response as follows:
   ### 📋 Assessment & Overview
   [Direct answer to the user’s main concern or report finding]

   ### 🔍 Clinical Considerations
   [Explain relevant clinical concepts, potential factors, or values safely]

   ### ⚠️ Red Flags (When to Seek Urgent Care)
   [List critical symptoms requiring immediate medical evaluation]

   ### 💡 Actionable Next Steps
   [Practical suggestions like tracking symptoms, questions for your GP, or tests to discuss]

   ### 🏥 Location-Based Advice (If Asked)
   - If user asks for nearby care/hospitals, advise that you don't have automatic location access.
   - Encourage them to provide their city, neighborhood, or postal code to assist.
   - Advise on looking for general medical centers based on their input, without recommending a specific address.

7. **Multilingual Support**: Use the language the user is chatting in:
   - You must detect the language of the user's message (e.g., Spanish, French, Hindi, German, etc.).
   - Respond fluently and professionally in the **same language** that was used by the user.
   - All response headers (e.g., Assessment, Considerations, Red Flags) and safety disclaimers must be translated accurately into that same language.

8. **Avoid Canned Responses**: Vary your phrasing, introductions, and transition layout structures. Do not sound like a uniform template or repeat boilerplate phrases across multiple questions on identical topics.

SAFETY RULES (MANDATORY):
- You are **not the patient's doctor** and you **must not prescribe** specific drugs, doses, or treatment plans. You may list or summarize medications EXPLICITLY documented as ALREADY PRESCRIBED in uploaded medical records or reports description upon request, but do not prescribe new or change existing dosages.
- You may mention classes of medicines in general terms (e.g., "pain relievers such as paracetamol") but:
  - Do **not** choose exact brands or products for the user.
  - Do **not** give exact doses or duration.
  - Do **not** guarantee a “cure”.
- When the user asks about treatment or medicines:
  - Focus on explaining typical options that doctors consider (e.g., lifestyle changes, common medicine classes, further tests).
  - You may say that, **if a doctor prescribes a medicine**, it can usually be obtained from licensed local pharmacies or reputable online pharmacy platforms, but you must **not** recommend a specific website or give direct purchase links.
- **STRICT SCOPE REFUSAL**: You must **ONLY** answer questions regarding actual real-world human health, clinical symptoms, diseases, or report interpretation.
  - **Core Intent Check**: If the query requests Software Code, General Jokes, Fictional/Fantasy scenarios (even about dragons/doctors), historical trivia, or general layout guides, you MUST strictly refuse. 
  - **Refusal Phrase**: If Refused, your response must be EXACTLY without headings: "I am an AI medical assistant and can only answer questions related to your health and medical reports."
  - **Examples of Rigid Blockers (DO NOT ANSWER ANY OF THESE)**:
    - User: "How do I build a dashboard in React for health?" -> Refuse.
    - User: "Tell me a story about a dragon/monster with symptoms" -> Refuse.
    - User: "Tell me a doctor joke" -> Refuse.
- Always explain red-flag symptoms where the user should seek urgent or in‑person medical care.
- **Disclaimer**: End every response with a short footer **translated into the user's language**: "Note: AI analysis. This is not a diagnosis or prescription. Please consult a licensed doctor before taking any medication or buying any medicine."

TASK:
- If analyzing a report: Summarize findings, flag abnormalities with context, and suggest questions the patient should ask their doctor.
- If answering a question: Provide a clear medical explanation, typical next steps, and what to discuss with a healthcare professional.`;

class AIService {
    /**
     * Analyze report using Gemini
     */
    async analyzeReport(parsedData, flags, rawText = null) {
        if (!model && !groq) {
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

1. **Summary** (1-2 paragraphs, easy language): 
   - Write in VERY SIMPLE, EASY-TO-UNDERSTAND language that anyone can read.
   - Provide a DETAILED, COMPREHENSIVE explanation of what the report shows, ensuring it translates findings into everyday terms (e.g., "This means your body might be fighting an infection").
   - Use everyday words, avoid medical jargon.
   - Do not artificially shorten explanation; contextualize abnormal values simple descriptions.

2. **Concerns** (array of 2-4 items, simple language):
   - List only the main problems found
   - Write each concern in SIMPLE language (e.g., "Your hemoglobin is low" not "Hemoglobin levels below reference range")
   - Keep each concern to 1 sentence maximum
   - Use everyday words that patients understand
   - If no problems found, say "All test results look normal"

3. **Recommendations** (array of 2-3 items, simple language):
   - Give simple, clear advice (e.g., "See your doctor soon" not "Consult a healthcare professional")
   - Focus on what the patient should do next

4. **Precautions** (array of 2-4 items, simple language):
   - List safe precautions the patient should take (e.g., rest, hydration, avoidance of certain triggers).
   - List safe over-the-counter (OTC) supportive aids or typical supplements suitable supporting general symptoms (e.g., "Consider a simple pain reliever like paracetamol for pain if okay for you"), with safety disclaimers intact. Use clear arrays.

5. **Urgency** (one of: "low", "medium", "high"):
   - "low": Routine follow-up, no immediate action needed
   - "medium": Should consult doctor soon, but not emergency
   - "high": Requires prompt medical attention or immediate care

6. **Disclaimer**: Always include: "This is not medical advice. Please consult a healthcare professional."

OUTPUT FORMAT (JSON only, no markdown code blocks, no additional text). You MUST ALWAYS include these 6 keys in the JSON response: summary, concerns, recommendations, precautions, urgency, disclaimer.
{
  "summary": "Detailed 2-3 paragraph summary here...",
  "concerns": ["Concern 1", "Concern 2"],
  "recommendations": ["Recommendation 1"],
  "precautions": ["Precaution 1 / OTC guidance", "Precaution 2"],
  "urgency": "low|medium|high",
  "disclaimer": "This is not medical advice. Please consult a healthcare professional."
}
`;

            let text = "";
            if (groq) {
                const groqResponse = await groq.chat.completions.create({
                    messages: [
                        { role: "system", content: "You are an expert medical AI assistant. You MUST return a JSON object with exactly these 6 keys: summary, concerns, recommendations, precautions, urgency, disclaimer." },
                        { role: "user", content: userPrompt }
                    ],
                    model: "llama-3.3-70b-versatile",
                    response_format: { type: "json_object" },
                    temperature: 0.5
                });
                text = groqResponse.choices[0]?.message?.content || "{}";
            } else {
                const result = await model.generateContent(userPrompt);
                const response = await result.response;
                text = response.text();
            }

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

                // Ensure precautions field exists
                if (!parsed.precautions || !Array.isArray(parsed.precautions) || parsed.precautions.length === 0) {
                    parsed.precautions = [
                        "Get adequate rest and stay hydrated",
                        "Avoid strenuous physical activity or excessive stress",
                        "Monitor your condition and seek advice if symptoms worsen",
                        "Do not administer new over-the-counter medications without professional consultation"
                    ];
                }

                return {
                    summary: parsed.summary || "Report analysis completed. Please review the detailed findings below.",
                    concerns: Array.isArray(parsed.concerns) ? parsed.concerns : [],
                    recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
                    precautions: parsed.precautions,
                    urgency: parsed.urgency || "medium",
                    disclaimer: parsed.disclaimer || "This is not medical advice. Please consult a healthcare professional.",
                };
            }

            // Fallback if JSON parsing fails
            return {
                summary: cleanedText.substring(0, 500) || "Unable to parse AI response.",
                concerns: [],
                recommendations: ["Please consult a healthcare professional for detailed interpretation."],
                precautions: ["Rest well and track your vitals closely"],
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
    /**
     * Chat with AI assistant
     */
    async getChatResponse(userMessage, context = []) {
        if (!model && !groq) {
            console.log("⚠️ AI not configured. Using mock response.");

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
            if (groq) {
                const groqResponse = await groq.chat.completions.create({
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        ...context.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
                        { role: "user", content: userMessage }
                    ],
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.7
                });
                return groqResponse.choices[0]?.message?.content || "";
            }

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
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            console.log(`[AI Service] Received response length: ${text.length}`);
            return text;
        } catch (error) {
            console.error("[AI Service] Chat API error:", error.message);
            console.error("[AI Service] Error details:", error);
            return "I'm having trouble processing your request. Please try again later.";
        }
    }
}

module.exports = new AIService();
