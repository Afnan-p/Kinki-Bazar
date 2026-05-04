const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

const categories = [
  { name: 'Plastic Items', description: 'Durable plastic containers and household items.' },
  { name: 'Cleaning Items', description: 'Essential tools for a spotless home.' },
  { name: 'Crockery', description: 'Premium plates, bowls, and dinner sets.' },
  { name: 'Bedsheets', description: 'Luxury cotton and silk bedding.' },
  { name: 'Mud Pots', description: 'Traditional and earthy clay cookware.' },
  { name: 'Kitchen Tools', description: 'Professional grade knives and utensils.' },
  { name: 'Storage Containers', description: 'Smart organizers for your kitchen.' },
  { name: 'Bathroom Essentials', description: 'Modern accessories for your bathroom.' },
  { name: 'Home Decor', description: 'Elegant vases and wall art.' },
  { name: 'Steel Items', description: 'Premium stainless steel cookware.' }
];

const products = [
  {
    name: 'Royal Gold Ceramic Dinner Set',
    price: 189.99,
    discountPrice: 249.99,
    description: 'A luxurious 24-piece dinner set with gold rim.',
    stock: 25,
    images: [{ url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80', public_id: 'p1' }],
    isNewArrival: true,
    isFeatured: true,
    isTrending: true,
    ratings: 4.8
  },
  {
    name: 'Professional Knife Set',
    price: 124.50,
    description: 'High-carbon stainless steel knife set.',
    stock: 15,
    images: [{ url: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=800&q=80', public_id: 'p2' }],
    isTrending: true,
    isBestSeller: true,
    ratings: 4.5
  },
  {
    name: 'Egyptian Cotton Bedsheet',
    price: 75.00,
    discountPrice: 99.00,
    description: '1000 thread count luxury bedding.',
    stock: 40,
    images: [{ url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', public_id: 'p3' }],
    isBestSeller: true,
    ratings: 4.9
  },
  {
    name: 'Airtight Glass Storage Set',
    price: 59.00,
    description: 'Eco-friendly glass containers with bamboo lids.',
    stock: 50,
    images: [{ url: 'https://images.unsplash.com/photo-1584263347416-85a696b4eda7?auto=format&fit=crop&w=800&q=80', public_id: 'p4' }],
    isTrending: true,
    ratings: 4.6
  },
  {
    name: 'Traditional Mud Cooking Pot',
    price: 35.00,
    description: 'Handcrafted clay pot for authentic flavor.',
    stock: 20,
    images: [{ url: 'https://images.unsplash.com/photo-1590001158193-79013018e2de?auto=format&fit=crop&w=800&q=80', public_id: 'p5' }],
    ratings: 4.7
  },
  {
    name: 'Modern Bathroom Accessory Set',
    price: 45.99,
    description: '4-piece ceramic set for a clean bathroom look.',
    stock: 30,
    images: [{ url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', public_id: 'p6' }],
    ratings: 4.4
  }
];

const adminUser = {
  name: 'Admin User',
  email: 'admin@kinkibazar.com',
  password: 'adminpassword123',
  role: 'admin'
};

const importData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    await User.create(adminUser);
    const createdCategories = await Category.insertMany(categories);
    
    // Assign categories randomly to products
    products[0].category = createdCategories[2]._id; // Crockery
    products[1].category = createdCategories[5]._id; // Kitchen Tools
    products[2].category = createdCategories[3]._id; // Bedsheets
    products[3].category = createdCategories[6]._id; // Storage
    products[4].category = createdCategories[4]._id; // Mud Pots
    products[5].category = createdCategories[7]._id; // Bathroom

    await Product.insertMany(products);

    console.log('Data Overhauled Successfully!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
