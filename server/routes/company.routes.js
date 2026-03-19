import express from 'express';
import { getCompanies, getCompanyBySlug, createCompany, updateCompany }
  from '../controllers/company.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';

const router = express.Router();
router.get('/',         protect, getCompanies);
router.get('/:slug',    protect, getCompanyBySlug);
router.post('/',        protect, requireAdmin, createCompany);
router.patch('/:id',    protect, requireAdmin, updateCompany);
export default router;