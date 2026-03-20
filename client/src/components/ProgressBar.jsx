export default function ProgressBar({ percentage, label, color = 'bg-indigo-500' }) {
    return (
      <div className="w-full">
        {label && (
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{label}</span>
            <span>{percentage}%</span>
          </div>
        )}
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className={`${color} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    )
  }