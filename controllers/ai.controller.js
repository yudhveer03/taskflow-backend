const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});



module.exports.suggestEstimate = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const prompt = `You are an experienced software project manager.
            I will provide you with a task title and description.

            Your job is to:
                1. Estimate the effort required to complete the task.
                2. Suggest a realistic due date.
                3. Explain your reasoning in 2 - 3 sentences.

                Return ONLY valid JSON in the following format:
                    {
                        "estimatedEffort": "",
                        "suggestedDueDate": "",
                        "reasoning": ""
                    }

                Do not include markdown, code fences, or any extra text outside the JSON.
                Task Title:${title}
                Task Description:${description} `
                
        const interaction = await ai.interactions.create({
            model: "gemini-3.5-flash",
            input: prompt,
        });
        
        try {
            const aiResponse = JSON.parse(interaction.output_text)

            return res.status(200).json({
                message: "Response Generated Successfully",
                aiResponse
            })
        }
        catch (err) {
            console.error(err)
            return res.status(500).json({
                message:"AI Returned Invalid JSON"
            })
    }
    }


    catch (err) { 
        console.error(err);
       return res.status(500).json({
            message:"AI Suggestion Failed"
        })
    }
}