const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
    },
    image: {
      url: String,
      public_id: String,
    },
    link: {
      type: String,
    },
    type: {
      type: String,
      enum: ['Hero', 'Offer', 'Category'],
      default: 'Hero',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Banner', bannerSchema);
