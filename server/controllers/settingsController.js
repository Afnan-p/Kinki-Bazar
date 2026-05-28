const asyncHandler = require('../utils/asyncHandler');
const SiteSettings = require('../models/SiteSettings');

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
const getSiteSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne({});

  if (!settings) {
    settings = await SiteSettings.create({});
  }

  res.json(settings);
});

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSiteSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne({});

  if (!settings) {
    settings = await SiteSettings.create({});
  }

  // Update hero
  if (req.body.hero) {
    settings.hero = { ...settings.hero, ...req.body.hero };
  }

  // Update anatomy
  if (req.body.anatomy) {
    settings.anatomy = { ...settings.anatomy, ...req.body.anatomy };
  }

  // Update footer
  if (req.body.footer) {
    settings.footer = { ...settings.footer, ...req.body.footer };
  }

  // Update about (Our Story)
  if (req.body.about) {
    settings.about = { ...settings.about, ...req.body.about };
  }

  // Update contact
  if (req.body.contact) {
    settings.contact = { ...settings.contact, ...req.body.contact };
  }

  const updatedSettings = await settings.save();
  res.json(updatedSettings);
});

module.exports = {
  getSiteSettings,
  updateSiteSettings,
};
