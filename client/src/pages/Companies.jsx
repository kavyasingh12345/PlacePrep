import { useState, useEffect } from 'react'
import { companyService } from '../services/companyservice.js'
import CompanyCard from '../components/CompanyCard.jsx'

const BRANCHES = ['All', 'CSE', 'IT', 'ECE', 'EEE', 'Mech']

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading]     = useState(true)
  const [branch, setBranch]       = useState('All')
  const [search, setSearch]       = useState('')

  useEffect(() => {
    companyService.getAll()
      .then(setCompanies)
      .finally(() => setLoading(false))
  }, [])

  const filtered = companies
    .filter(c => branch === 'All' || c.branches?.includes(branch))
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Pick your company</h1>
        <p className="text-gray-500">Choose a company and start your targeted placement prep</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text" placeholder="Search company..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-400 transition"
        />
        <div className="flex gap-2 flex-wrap">
          {BRANCHES.map(b => (
            <button key={b} onClick={() => setBranch(b)}
              className={`px-3 py-1.5 rounded-full text-sm border transition ${branch === b ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600 hover:border-indigo-300'}`}>
              {b}
            </button>
          ))}
        </div>
      </div>

      {loading
        ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array(6).fill(0).map((_, i) => <div key={i} className="h-44 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
        : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(c => <CompanyCard key={c._id} company={c} />)}
          </div>
      }

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">No companies found</div>
      )}
    </div>
  )
}