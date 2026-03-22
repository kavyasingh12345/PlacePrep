
import { analyzeResume } from '../utils/groq.js'
import Company from '../models/Company.js'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const pdfParse = require('pdf-parse')

export const analyzeResumeController = async (req, res) => {
  try {
    const { companyId } = req.body

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF resume' })
    }

    if (!companyId) {
      return res.status(400).json({ message: 'Please select a company' })
    }

    // Get company details
    const company = await Company.findById(companyId)
    if (!company) {
      return res.status(404).json({ message: 'Company not found' })
    }

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer)
    const resumeText = pdfData.text

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ message: 'Could not extract text from PDF. Make sure it is not a scanned image.' })
    }

    console.log(`Analyzing resume for ${company.name}...`)

    // Send to Groq for analysis
    const analysis = await analyzeResume({
      resumeText,
      companyName:   company.name,
      jobRole:       company.rounds?.[0] || 'Software Engineer',
      companyRounds: company.rounds,
    })

    res.json({
      company: { name: company.name, ctc: company.ctc },
      analysis,
    })

  } catch (err) {
    console.error('Resume analysis error:', err.message)
    res.status(500).json({ message: 'Analysis failed: ' + err.message })
  }
}