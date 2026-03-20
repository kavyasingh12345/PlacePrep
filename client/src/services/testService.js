import api from './api.js'

export const testService = {
  getByTrack:  (trackId)       => api.get(`/tests/track/${trackId}`),
  start:       (testId)        => api.get(`/tests/${testId}/start`),
  submit:      (data)          => api.post('/tests/submit', data),
  getMyScores: ()              => api.get('/leaderboard/my'),
}