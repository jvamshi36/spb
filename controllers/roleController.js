const Role = require('../models/Role');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
  const roles = await Role.find();
  res.json(roles);
};

exports.getOne = async (req, res) => {
  const role = await Role.findById(req.params.id);
  if (!role) return res.status(404).json({ message: 'Role not found' });
  res.json(role);
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { roleLevel, name, description, permissions, allowanceRates } = req.body;
  const existing = await Role.findOne({ roleLevel });
  if (existing) return res.status(400).json({ message: 'Role level already exists' });
  // Ensure allowanceRates structure
  const rates = {
    headquarter: allowanceRates?.headquarter || 0,
    exStation: allowanceRates?.exStation || 0,
    outStation: allowanceRates?.outStation || 0,
    travelPerKm: allowanceRates?.travelPerKm || 0
  };
  const role = new Role({ roleLevel, name, description, permissions, allowanceRates: rates });
  await role.save();
  res.status(201).json(role);
};

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { roleLevel, name, description, permissions, allowanceRates } = req.body;
  // Ensure allowanceRates structure
  let rates = {
    headquarter: allowanceRates?.headquarter || 0,
    exStation: allowanceRates?.exStation || 0,
    outStation: allowanceRates?.outStation || 0,
    travelPerKm: allowanceRates?.travelPerKm || 0
  };
  const updateObj = {
    roleLevel, name, description, permissions,
    'allowanceRates.headquarter': rates.headquarter,
    'allowanceRates.exStation': rates.exStation,
    'allowanceRates.outStation': rates.outStation,
    'allowanceRates.travelPerKm': rates.travelPerKm,
  };
  console.log('Updating role:', req.params.id, updateObj);
  let role;
  try {
    role = await Role.findByIdAndUpdate(
      req.params.id,
      { $set: updateObj },
      { new: true, runValidators: true }
    );
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.roleLevel) {
      return res.status(400).json({ message: 'Role level already exists' });
    }
    throw err;
  }
  if (!role) return res.status(404).json({ message: 'Role not found' });
  res.json(role);
};

exports.delete = async (req, res) => {
  const role = await Role.findByIdAndDelete(req.params.id);
  if (!role) return res.status(404).json({ message: 'Role not found' });
  res.json({ message: 'Role deleted' });
}; 