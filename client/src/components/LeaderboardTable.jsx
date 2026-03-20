import { useAuth } from '../context/AuthContext.jsx'

export default function LeaderboardTable({ data, myRank }) {
  const { user } = useAuth()

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
          <tr>
            <th className="px-4 py-3 text-left">Rank</th>
            <th className="px-4 py-3 text-left">Student</th>
            <th className="px-4 py-3 text-left">College</th>
            <th className="px-4 py-3 text-left">Branch</th>
            <th className="px-4 py-3 text-right">Best Score</th>
            <th className="px-4 py-3 text-right">Attempts</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, i) => {
            const isMe = entry._id === user?._id
            return (
              <tr key={entry._id} className={`border-t border-gray-100 ${isMe ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}>
                <td className="px-4 py-3 font-semibold text-gray-700">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {entry.user?.avatar
                      ? <img src={entry.user.avatar} className="w-7 h-7 rounded-full object-cover" />
                      : <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">{entry.user?.name?.[0]}</div>
                    }
                    <span className={`font-medium ${isMe ? 'text-indigo-700' : 'text-gray-900'}`}>
                      {entry.user?.name} {isMe && '(You)'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{entry.user?.college || '—'}</td>
                <td className="px-4 py-3 text-gray-500">{entry.user?.branch || '—'}</td>
                <td className="px-4 py-3 text-right font-semibold text-indigo-600">{entry.bestScore}%</td>
                <td className="px-4 py-3 text-right text-gray-500">{entry.attempts}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {myRank && (
        <div className="px-4 py-2 bg-indigo-50 border-t border-indigo-100 text-xs text-indigo-700 text-center">
          Your rank: #{myRank}
        </div>
      )}
    </div>
  )
}