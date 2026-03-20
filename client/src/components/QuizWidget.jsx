import { useState } from 'react'

export default function QuizWidget({ question, onAnswer, answered }) {
  const [selected, setSelected] = useState(null)

  const handleSelect = (idx) => {
    if (answered) return
    setSelected(idx)
    onAnswer(idx)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <p className="font-medium text-gray-900 mb-5 leading-relaxed">{question.text}</p>
      <div className="flex flex-col gap-2.5">
        {question.options.map((opt, idx) => {
          let style = 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
          if (answered) {
            if (idx === question.correctIndex) style = 'border-green-400 bg-green-50'
            else if (idx === selected)         style = 'border-red-400 bg-red-50'
            else                               style = 'border-gray-200 opacity-50'
          } else if (idx === selected) {
            style = 'border-indigo-400 bg-indigo-50'
          }
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${style}`}
            >
              <span className="font-medium mr-2 text-gray-400">{String.fromCharCode(65 + idx)}.</span>
              {opt}
            </button>
          )
        })}
      </div>
      {answered && question.explanation && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
          <span className="font-medium">Explanation: </span>{question.explanation}
        </div>
      )}
    </div>
  )
}