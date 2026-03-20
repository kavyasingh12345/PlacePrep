import { Link } from 'react-router-dom'

export default function CompanyCard({ company }) {
  return (
    <Link
      to={`/companies/${company.slug}`}
      className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all group"
    >
      <div className="flex items-center gap-3 mb-3">
        {company.logo
          ? <img src={company.logo} alt={company.name} className="w-10 h-10 object-contain" />
          : <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-sm">{company.name[0]}</div>
        }
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition">{company.name}</h3>
          <p className="text-xs text-gray-500">{company.ctc}</p>
        </div>
        {company.isPremium && (
          <span className="ml-auto text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">Premium</span>
        )}
      </div>

      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{company.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {company.rounds?.map(r => (
          <span key={r} className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{r}</span>
        ))}
      </div>

      <div className="mt-3 text-xs text-gray-400">
        CGPA ≥ {company.minCGPA} · {company.branches?.slice(0,3).join(', ')}{company.branches?.length > 3 ? ' +more' : ''}
      </div>
    </Link>
  )
}