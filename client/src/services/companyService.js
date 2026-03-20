import api from './api.js'

export const companyService = {
  getAll:      (params) => api.get('/companies', { params }),
  getBySlug:   (slug)   => api.get(`/companies/${slug}`),
}