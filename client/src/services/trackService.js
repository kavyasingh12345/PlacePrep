import api from './api.js'

export const trackService = {
  getByCompany: (companyId) => api.get(`/tracks/company/${companyId}`),
  getById:      (id)        => api.get(`/tracks/${id}`),
  create:       (data)      => api.post('/tracks', data),
  enrollFree:   (trackId)   => api.post('/payments/enroll-free', { trackId }),
  checkEnroll: (trackId) => api.get(`/enrollments/check/${trackId}`),
  getMyEnrolled:()          => api.get('/enrollments/my'),
}