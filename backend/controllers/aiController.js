const Performance = require("../models/Performance");
const asyncHandler = require("express-async-handler");

// @desc    Get AI-powered performance insights
// @route   GET /api/ai/insights
// @access  Private/Admin, Private/Manager, Private/HR
exports.getAIInsights = asyncHandler(async (req, res) => {
  // ... (Your existing getAIInsights function code is here) ...
  // ... (Leaving it out for brevity, but it should be here) ...
  const reviews = await Performance.find({}).populate(
    "employee",
    "firstName lastName"
  );

  if (reviews.length === 0) {
    res.status(404);
    throw new Error("No performance reviews found to analyze.");
  }

  const performanceData = reviews
    .map(
      (r) =>
        `Employee: ${r.employee.firstName} ${r.employee.lastName}, Rating: ${r.rating}, Comment: ${r.comments}`
    )
    .join("\n");

  const systemPrompt =
    "Act as an expert HR analyst. Your tone is professional and insightful.";
  const userQuery = `Analyze the following performance data and provide a 2-3 sentence summary of overall team sentiment and performance. Then, identify the single "Top Performer" and the "Employee to Watch" (lowest performer) based on ratings and comments.

  Data:
  ${performanceData}`;

  const apiKey = process.env.GOOGLE_AI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("AI API Error Body:", errorBody);
      throw new Error(
        `AI API call failed with status: ${response.status} - ${errorBody.error.message}`
      );
    }

    const result = await response.json();
    const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
      throw new Error("No content returned from AI");
    }

    res.status(200).json({
      sourceData: reviews,
      aiSummary: aiText,
    });
  } catch (error) {
    console.error("AI call error:", error);
    throw new Error(`Failed to get AI insights: ${error.message}`);
  }
});

// @desc    Analyze (screen) a resume against a job description
// @route   POST /api/ai/screen-resume
// @access  Private/Admin, Private/HR
exports.screenResume = asyncHandler(async (req, res) => {
  // 1. Get the job description from the request body
  const { jobDescription } = req.body; // <-- THIS LINE IS NOW FIXED

  // 2. Check if a file was uploaded by multer
  if (!req.file) {
    res.status(400);
    throw new Error("No resume file uploaded");
  }

  if (!jobDescription) {
    res.status(400);
    throw new Error("No job description provided");
  }

  // 3. Convert the file buffer (from memory) into a base64 string
  const base64Resume = req.file.buffer.toString("base64");
  const mimeType = req.file.mimetype; // e.g., "application/pdf"

  // 4. Prepare the AI prompt (this is a multimodal prompt)
  const systemPrompt =
    "Act as a senior HR recruiter. You are screening a resume against a job description.";
  const userQuery = `Analyze the attached resume (file) against the provided job description (text).
    
    Job Description:
    ${jobDescription}
    
    Provide your analysis with:
    1.  A "Fit Score" from 1 to 100.
    2.  A 2-3 sentence "Summary" of the candidate's qualifications.
    3.  A list of "Missing Key Skills".`;

  // 5. Call the Gemini AI API with text and file data
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: userQuery },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Resume,
                },
              },
            ],
          },
        ],
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("AI API Error Body:", errorBody);
      throw new Error(`AI API call failed: ${errorBody.error.message}`);
    }

    const result = await response.json();
    const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
      throw new Error("No content returned from AI");
    }

    // 6. Send the AI's response
    res.status(200).json({
      fileName: req.file.originalname,
      analysis: aiText,
    });
  } catch (error) {
    console.error("AI call error:", error);
    throw new Error(`Failed to get AI insights: ${error.message}`);
  }
});
