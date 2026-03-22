import Groq from 'groq-sdk'

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export const analyzeResume = async ({ resumeText, companyName, jobRole, companyRounds }) => {
  const prompt = `
You are an expert ATS (Applicant Tracking System) and resume analyzer for campus placements in India.

Analyze the following resume for a student applying to ${companyName} for the role of ${jobRole}.

Company details:
- Company: ${companyName}
- Role: ${jobRole}
- Selection rounds: ${companyRounds?.join(', ') || 'Aptitude, Technical, HR'}

Resume text:
"""
${resumeText}
"""

Analyze the resume and respond ONLY with a valid JSON object in this exact format, nothing else:
{
  "atsScore": <number between 0-100>,
  "matchPercentage": <number between 0-100>,
  "missingKeywords": [<list of important missing keywords for this company/role>],
  "presentKeywords": [<list of strong keywords already present>],
  "skillsGap": [
    { "skill": "<skill name>", "importance": "<high/medium/low>", "suggestion": "<how to acquire>" }
  ],
  "improvements": [
    { "section": "<Resume section>", "issue": "<what is wrong>", "fix": "<how to fix it>" }
  ],
  "strengths": [<list of strong points in the resume>],
  "summary": "<2-3 sentence overall assessment>"
}

Be specific to ${companyName}'s requirements. Focus on skills like aptitude, coding, communication, technical skills relevant to ${companyName}.
`

  const response = await client.chat.completions.create({
    model:    'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature:    0.3,
    max_tokens:     2000,
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0]?.message?.content
  return JSON.parse(content)
}