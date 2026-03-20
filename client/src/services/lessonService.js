import api from './api.js'

export const lessonService = {
  getByTrack:  (trackId)  => api.get(`/lessons/track/${trackId}`),
  getById:     (id)       => api.get(`/lessons/${id}`),
  markComplete:(trackId, lessonId) => api.post('/progress/complete', { trackId, lessonId }),
  getProgress: (trackId)  => api.get(`/progress/${trackId}`),
}