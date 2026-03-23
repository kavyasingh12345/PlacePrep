import PDFParser from 'pdf2json'
import { analyzeResume } from '../utils/groq.js'
import Company from '../models/Company.js'

const extractTextFromPDF = (buffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser()

    pdfParser.on('pdfParser_dataError', err => reject(err))

    pdfParser.on('pdfParser_dataReady', pdfData => {
      try {
        const text = pdfData.Pages.map(page =>
          page.Texts.map(t => {
            try {
              return decodeURIComponent(t.R.map(r => r.T).join(' '))
            } catch {
              // If decoding fails, return raw text as-is
              return t.R.map(r => r.T).join(' ')
            }
          }).join(' ')
        ).join('\n')
        resolve(text)
      } catch (err) {
        reject(err)
      }
    })

    pdfParser.parseBuffer(buffer)
  })
}

export const analyzeResumeController = async (req, res) => {
  try {
    const { companyId } = req.body

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF resume' })
    }

    if (!companyId) {
      return res.status(400).json({ message: 'Please select a company' })
    }

    const company = await Company.findById(companyId)
    if (!company) {
      return res.status(404).json({ message: 'Company not found' })
    }

    // Extract text from PDF buffer
    const resumeText = await extractTextFromPDF(req.file.buffer)

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        message: 'Could not extract text from PDF. Make sure it is a text-based PDF not a scanned image.'
      })
    }

    console.log(`Analyzing resume for ${company.name}, text length: ${resumeText.length}`)

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