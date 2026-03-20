import { useState, useEffect } from 'react'
import { companyService } from '../services/companyservice.js'
import { testService } from '../services/testService.js'
import LeaderboardTable from '../components/LeaderboardTable.jsx'
import api from '../services/api.js'

export default function Leaderboard() {
  const [companies, setCompanies]   = useState([])
  const [selected, setSelected]     = useState('')
  const [data, setData]             = useState([])
  const [myRank, setMyRank]         = useState(null)
  const [loading, setLoading]       = useState(false)

  useEffect(() => {
    companyService.getAll().then(setCompanies)
  }, [])

  useEffect(() => {
    if (!selected) return
    setLoading(true)
    api.get('/leaderboard', { params: { companyId: selected } })
      .then(res => { setData(res.leaderboard); setMyRank(res.myRank) })
      .finally(() => setLoading(false))
  }, [selected])

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
      <p className="text-gray-500 mb-6">See how you rank among students targeting the same company</p>

      <div className="flex gap-2 flex-wrap mb-6">
        {companies.map(c => (
          <button key={c._id} onClick={() => setSelected(c._id)}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${selected === c._id ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600 hover:border-indigo-300'}`}>
            {c.name}
          </button>
        ))}
      </div>

      {!selected && <div className="text-center py-20 text-gray-400">Select a company to see the leaderboard</div>}
      {loading && <div className="text-center py-10 text-gray-400">Loading...</div>}
      {!loading && selected && data.length > 0 && <LeaderboardTable data={data} myRank={myRank} />}
      {!loading && selected && data.length === 0 && <div className="text-center py-10 text-gray-400">No scores yet for this company. Be the first!</div>}
    </div>
  )
}