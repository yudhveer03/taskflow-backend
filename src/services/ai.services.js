const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

module.exports.generateEstimate = async (title, description) => {

    const prompt = `
You are an experienced software project manager.

I will provide you with a task title and description.

Your job is to:

1. Estimate the effort required.
2. Suggest a due date in YYYY-MM-DD format.
3. Explain your reasoning in 2-3 sentences.

Return ONLY valid JSON.

{
    "estimatedEffort":"",
    "dueDate":"",
    "reasoning":""
}

Task Title:
${title}

Task Description:
${description}
`;

    const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash",
        input: prompt
    });

    return JSON.parse(interaction.output_text);
}