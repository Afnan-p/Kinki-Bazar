const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, default: "Crafting Elegant Spaces For Modern Living" },
      subtitle: { type: String, default: "Luxury Living Redefined" },
      description: { type: String, default: "Discover curated home essentials blending timeless craftsmanship with modern elegance. Designed for those who appreciate the finer details." },
      image: { type: String, default: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" },
      ctaText: { type: String, default: "Enter The Collection" },
      ctaLink: { type: String, default: "/shop" },
      compImage: { type: String, default: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
      compBadge: { type: String, default: "Artisanal Selection" },
      compTitleTop: { type: String, default: "The Classic" },
      compTitleBottom: { type: String, default: "Vase" },
      compLinkText: { type: String, default: "View Piece Details" },
      compLinkUrl: { type: String, default: "/shop" }
    },
    anatomy: {
      title: { type: String, default: "The Anatomy Of Absolute Perfection" },
      subtitle: { type: String, default: "Unrivaled Detail" },
      description: { type: String, default: "We don't just curate furniture; we orchestrate sensory experiences. Every stitch, every grain, and every reflection is calculated to transcend the mundane." },
      image: { type: String, default: "https://images.unsplash.com/photo-1616489953149-866993244903?q=80&w=1200&auto=format" },
      ratingText: { type: String, default: "Excellence Rating" },
      ratingValue: { type: String, default: "99.9% Mastery" },
      box1Title: { type: String, default: "Sustainable" },
      box1Desc: { type: String, default: "Eco-Elite Materials" },
      box2Title: { type: String, default: "Timeless" },
      box2Desc: { type: String, default: "Generational Value" }
    },
    footer: {
      about: { type: String, default: "Crafting a legacy of modern luxury and architectural excellence." },
      facebook: { type: String, default: "#" },
      instagram: { type: String, default: "#" },
      twitter: { type: String, default: "#" },
      youtube: { type: String, default: "#" },
      address: { type: String, default: "123 Luxury Ave, Beverly Hills, CA" },
      email: { type: String, default: "support@kinkibazar.com" }
    },
    about: {
      title: { type: String, default: "Our Heritage" },
      subtitle: { type: String, default: "A Legacy of Excellence" },
      description: { type: String, default: "Founded on the principles of timeless design and uncompromising quality, Kinki Bazar represents the pinnacle of modern luxury living. Every piece in our collection is a testament to architectural beauty and artisanal craftsmanship." },
      image: { type: String, default: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" },
      missionTitle: { type: String, default: "Our Mission" },
      missionDesc: { type: String, default: "To redefine the spaces where life unfolds by curating objects of extraordinary beauty and profound functionality." },
      visionTitle: { type: String, default: "Our Vision" },
      visionDesc: { type: String, default: "To be the definitive global destination for those who seek to surround themselves with mastery and elegance." },
      valuesTitle: { type: String, default: "Our Values" },
      valuesDesc: { type: String, default: "Unwavering commitment to quality, sustainability in sourcing, and a dedication to the preservation of true artisanship." }
    },
    contact: {
      title: { type: String, default: "Get in Touch" },
      subtitle: { type: String, default: "Private Consultations" },
      description: { type: String, default: "Connect with our global concierge team for personalized sourcing, bespoke commissions, or general inquiries." },
      mapUrl: { type: String, default: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3303.784260020473!2d-118.4037599238386!3d34.0954313151743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d147ab%3A0xd664a7dc929ea763!2sBeverly%20Hills%2C%20CA%2090210!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" },
      email: { type: String, default: "concierge@kinkibazar.com" },
      phone: { type: String, default: "+1 (800) 555-0199" },
      address: { type: String, default: "123 Luxury Ave, Beverly Hills, CA 90210" }
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
