import Company from '../models/Company.js';

export const getCompanies = async (req, res) => {
  const { branch, premium } = req.query;
  const filter = { isActive: true };
  if (branch) filter.branches = branch;
  if (premium !== undefined) filter.isPremium = premium === 'true';
  const companies = await Company.find(filter).sort('name');
  res.json(companies);
};

export const getCompanyBySlug = async (req, res) => {
  const company = await Company.findOne({ slug: req.params.slug });
  if (!company) return res.status(404).json({ message: 'Company not found' });
  res.json(company);
};

export const createCompany = async (req, res) => {
  const company = await Company.create(req.body);
  res.status(201).json(company);
};

export const updateCompany = async (req, res) => {
  const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(company);
};