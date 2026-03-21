import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { lessonService } from '../services/lessonService.js'

const getYoutubeEmbed = (url) => {
  if (!url) return null
  if (url.includes('youtube.com/embed/')) return url
  if (url.includes('youtube.com/watch')) {
    try {
      const videoId = new URL(url).searchParams.get('v')
      return `https://www.youtube.com/embed/${videoId}`
    } catch { return null }
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0]
    return `https://www.youtube.com/embed/${videoId}`
  }
  return null
}

const isYoutube = (url) =>
  url && (url.includes('youtube.com') || url.includes('youtu.be'))

export default function LessonPlayer() {
  const { lessonId } = useParams()
  const navigate     = useNavigate()
  const [lesson, setLesson]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [marked, setMarked]   = useState(false)

  useEffect(() => {
    lessonService.getById(lessonId)
      .then(setLesson)
      .finally(() => setLoading(false))
  }, [lessonId])

  const handleMarkComplete = async () => {
    try {
      await lessonService.markComplete(lesson.track, lesson._id)
      setMarked(true)
    } catch (err) {
      console.error('Failed to mark complete:', err)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">
      Loading lesson...
    </div>
  )

  if (!lesson) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">
      Lesson not found
    </div>
  )

  const embedUrl = isYoutube(lesson.videoUrl) ? getYoutubeEmbed(lesson.videoUrl) : null

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">

      <button onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1 transition">
        ← Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">{lesson.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{lesson.topic}</p>

      {/* Video player */}
      <div className="rounded-2xl overflow-hidden mb-6 bg-black"
        style={{ aspectRatio: '16/9' }}>
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title={lesson.title}
            style={{ border: 'none' }}
          />
        ) : lesson.videoUrl ? (
          <video
            src={lesson.videoUrl}
            controls
            className="w-full h-full"
            onEnded={handleMarkComplete}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No video available for this lesson
          </div>
        )}
      </div>

      {/* Description */}
      {lesson.description && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6">
          <h2 className="font-semibold text-gray-800 mb-2">About this lesson</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{lesson.description}</p>
        </div>
      )}

      {/* Notes download */}
      {lesson.notesUrl && (
        <a href={lesson.notesUrl} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm hover:border-indigo-300 hover:bg-indigo-50 transition mb-6">
          📄 Download notes (PDF)
        </a>
      )}

      {/* Mark complete */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl p-5">
        <div>
          <p className="font-medium text-gray-900">Done with this lesson?</p>
          <p className="text-sm text-gray-500">Mark it complete to track your progress</p>
        </div>
        <button
          onClick={handleMarkComplete}
          disabled={marked}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${
            marked
              ? 'bg-green-100 text-green-700 cursor-default'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}>
          {marked ? '✓ Completed' : 'Mark complete'}
        </button>
      </div>
    </div>
  )
}