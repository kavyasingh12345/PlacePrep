import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { trackService } from "../services/trackService.js";
import { testService } from "../services/testService.js";
import ProgressBar from "../components/ProgressBar.jsx";
import ResumeAnalyzer from "../components/ResumeAnalyzer.jsx";
import { companyService } from "../services/companyservice.js";

export default function Dashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [scores, setScores] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    trackService.getMyEnrolled().then(setEnrollments);
    testService.getMyScores().then((data) => setScores(data.slice(0, 5)));
    companyService.getAll().then(setCompanies);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
  
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Hey, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {user?.college} · {user?.branch} · Batch of {user?.gradYear}
        </p>
      </div>
  
      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-gray-200">
        {[
          { id: 'overview', label: '📊 Overview' },
          { id: 'resume',   label: '🤖 AI Resume Analyzer' },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition ${
              activeTab === t.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>
  
      {/* Overview tab */}
      {activeTab === 'overview' && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {user?.role === 'student' ? (
      <>
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-3">Your enrolled tracks</h2>
          {enrollments.length === 0
            ? <div className="bg-gray-50 rounded-2xl p-6 text-center text-sm text-gray-400">
                No tracks yet. <Link to="/companies" className="text-indigo-600">Pick a company →</Link>
              </div>
            : enrollments.map(e => (
                <Link key={e._id} to={`/companies/${e.track?.company?.slug}`}
                  className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 mb-3 hover:border-indigo-300 transition">
                  {e.track?.company?.logo
                    ? <img src={e.track.company.logo} className="w-9 h-9 object-contain" />
                    : <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-sm">
                        {e.track?.company?.name?.[0]}
                      </div>
                  }
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{e.track?.title}</p>
                  </div>
                  <span className="text-xs text-indigo-600 whitespace-nowrap">Continue →</span>
                </Link>
              ))
          }
        </div>

        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-3">Recent test scores</h2>
          {scores.length === 0
            ? <div className="bg-gray-50 rounded-2xl p-6 text-center text-sm text-gray-400">
                No tests attempted yet
              </div>
            : scores.map(s => (
                <div key={s._id} className="bg-white border border-gray-200 rounded-xl p-4 mb-3 flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold ${
                    s.percentage >= 60 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {s.percentage}%
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{s.mockTest?.title}</p>
                    <p className="text-xs text-gray-500">
                      {s.company?.name} · {new Date(s.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full border ${
                    s.isPassed
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-red-50 text-red-600 border-red-200'
                  }`}>
                    {s.isPassed ? 'Passed' : 'Failed'}
                  </span>
                </div>
              ))
          }
        </div>
      </>
    ) : (
      <div className="col-span-2 bg-gray-50 rounded-2xl p-8 text-center">
        <p className="text-gray-500 text-sm">
          {user?.role === 'instructor'
            ? 'Go to Instructor dashboard to manage your tracks, lessons and questions.'
            : 'Go to Admin dashboard to manage the platform.'
          }
        </p>
        <Link
          to={user?.role === 'instructor' ? '/instructor' : '/admin'}
          className={`inline-block mt-4 px-5 py-2 rounded-full text-sm font-medium text-white transition ${
            user?.role === 'instructor' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
          }`}>
          Go to {user?.role === 'instructor' ? 'Instructor' : 'Admin'} dashboard →
        </Link>
      </div>
    )}
  </div>
)}
      {/* Resume Analyzer tab */}
      {activeTab === 'resume' && (
        <ResumeAnalyzer companies={companies} />
      )}
  
    </div>
  )
}