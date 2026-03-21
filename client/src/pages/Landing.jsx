import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const companies = ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture', 'HCL', 'Tech Mahindra', 'Capgemini']

const features = [
  { icon: '🏢', title: 'Company-specific tracks', desc: 'Prep tailored exactly to TCS NQT, Infosys SP, Wipro NLTH patterns — not generic content.' },
  { icon: '🧪', title: 'Real mock tests', desc: 'Timed tests matching the exact format, section order and question types of each company.' },
  { icon: '🏆', title: 'Live leaderboard', desc: 'See your rank among all students targeting the same company. Know where you stand.' },
  { icon: '📊', title: 'Weak area analysis', desc: 'After every test, see exactly which topics you need to work on — not just your total score.' },
  { icon: '🔔', title: 'Drive alerts', desc: 'Get notified by email the moment a company opens placements for your branch and batch.' },
  { icon: '📝', title: 'Interview Q&A bank', desc: 'Real questions asked in technical and HR rounds, with suggested answers.' },
]

export default function Landing() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
          Built for Indian college students
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-5">
          Crack placements at your<br />
          <span className="text-indigo-600">dream company</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
          Company-specific prep tracks, real mock tests, and live leaderboards — everything you need to get placed at TCS, Infosys, Wipro and more.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {user
            ? <Link to="/companies" className="bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition">Browse companies →</Link>
            : <>
                <Link to="/register" className="bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition">Start for free →</Link>
                <Link to="/login" className="border border-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium hover:border-gray-300 transition">Login</Link>
              </>
          }
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-10 mt-14 flex-wrap">
          {[['10,000+', 'Students preparing'], ['25+', 'Company tracks'], ['500+', 'Mock test questions'], ['98%', 'Satisfaction rate']].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{num}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Company logos */}
      <section className="bg-gray-50 border-y border-gray-100 py-8">
        <p className="text-center text-xs text-gray-400 uppercase tracking-widest mb-5">Prep tracks available for</p>
        <div className="flex items-center justify-center gap-4 flex-wrap px-6">
          {companies.map(c => (
            <span key={c} className="bg-white border border-gray-200 text-gray-700 font-medium text-sm px-4 py-2 rounded-full">
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Everything you need to get placed</h2>
        <p className="text-gray-500 text-center mb-12">Not a generic course platform — built specifically for campus placements</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:border-indigo-200 transition">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-3">Your placement season is coming.</h2>
        <p className="text-indigo-200 mb-7">Start prepping today — it's completely free for top company tracks.</p>
        {user
          ? <Link to="/companies" className="bg-white text-indigo-600 px-6 py-3 rounded-full font-medium hover:bg-indigo-50 transition">Go to companies →</Link>
          : <Link to="/register" className="bg-white text-indigo-600 px-6 py-3 rounded-full font-medium hover:bg-indigo-50 transition">Create free account →</Link>
        }
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        © 2025 PlacePrep — Built for college students, by college students.
      </footer>
    </div>
  )
}