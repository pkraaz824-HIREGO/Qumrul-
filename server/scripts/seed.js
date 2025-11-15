import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Banner from '../models/Banner.js';
import Order from '../models/Order.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Banner.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin and regular users
    const users = await User.create([
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'admin123',
        isAdmin: true,
        phone: '+1-555-0001'
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        isAdmin: false,
        phone: '+1-555-0002'
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: 'password123',
        isAdmin: false,
        phone: '+1-555-0003'
      }
    ]);
    console.log('👥 Users created');

    // Create products
    const products = await Product.create([
      {
        name: 'MacBook Pro 16" M3 Max',
        description: 'Powerful 16-inch MacBook Pro with M3 Max chip, 48GB RAM, 1TB SSD. Perfect for creative professionals and developers.',
        price: 3499.99,
        originalPrice: 3999.99,
        category: 'Laptops',
        subcategory: 'Professional',
        brand: 'Apple',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop',
        stock: 24,
        sku: 'MBP-M3MAX-16',
        rating: 4.9,
        reviews: 487,
        featured: true
      },
      {
        name: 'Dell XPS 15 OLED',
        description: 'Stunning 15.6" OLED display, Intel Core i9-13900H, NVIDIA RTX 4060, 32GB RAM, 1TB SSD.',
        price: 2299.99,
        originalPrice: 2799.99,
        category: 'Laptops',
        subcategory: 'Professional',
        brand: 'Dell',
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=800&fit=crop',
        stock: 18,
        sku: 'DELL-XPS15-OLED',
        rating: 4.8,
        reviews: 342,
        featured: true
      },
      {
        name: 'iPhone 15 Pro Max',
        description: 'Latest iPhone with A17 Pro chip, titanium design, 256GB storage, advanced camera system.',
        price: 1199.99,
        originalPrice: 1299.99,
        category: 'Mobile Phones',
        subcategory: 'Flagship',
        brand: 'Apple',
        image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=800&fit=crop',
        stock: 50,
        sku: 'IP15PM-256',
        rating: 4.9,
        reviews: 1523,
        featured: true
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: '6.8" Dynamic AMOLED display, Snapdragon 8 Gen 3, 512GB storage, S Pen included.',
        price: 1299.99,
        originalPrice: 1399.99,
        category: 'Mobile Phones',
        subcategory: 'Flagship',
        brand: 'Samsung',
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop',
        stock: 35,
        sku: 'S24U-512',
        rating: 4.8,
        reviews: 892,
        featured: true
      },
      {
        name: 'AirPods Pro (2nd Gen)',
        description: 'Premium wireless earbuds with active noise cancellation, adaptive audio, and USB-C charging.',
        price: 249.99,
        originalPrice: 279.99,
        category: 'Accessories',
        subcategory: 'Audio',
        brand: 'Apple',
        image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800&h=800&fit=crop',
        stock: 100,
        sku: 'APP-2GEN',
        rating: 4.7,
        reviews: 2341,
        featured: true
      },
      {
        name: 'Sony WH-1000XM5',
        description: 'Industry-leading noise cancellation, exceptional sound quality, 30-hour battery life.',
        price: 399.99,
        originalPrice: 449.99,
        category: 'Accessories',
        subcategory: 'Audio',
        brand: 'Sony',
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcf?w=800&h=800&fit=crop',
        stock: 45,
        sku: 'WH1000XM5',
        rating: 4.8,
        reviews: 1876,
        featured: true
      },
      {
        name: 'ASUS ROG Zephyrus G16',
        description: '16" QHD+ 240Hz display, Intel Core i9, RTX 4070, 32GB RAM, 1TB SSD. Premium gaming laptop.',
        price: 2599.99,
        originalPrice: 2999.99,
        category: 'Laptops',
        subcategory: 'Gaming',
        brand: 'ASUS',
        image: 'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=800&h=800&fit=crop',
        stock: 12,
        sku: 'ROG-G16',
        rating: 4.7,
        reviews: 278,
        featured: false
      },
      {
        name: 'Google Pixel 8 Pro',
        description: 'Advanced AI features, exceptional camera, 128GB storage, pure Android experience.',
        price: 999.99,
        originalPrice: 1099.99,
        category: 'Mobile Phones',
        subcategory: 'Flagship',
        brand: 'Google',
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop',
        stock: 28,
        sku: 'PX8P-128',
        rating: 4.6,
        reviews: 645,
        featured: false
      }
    ]);
    console.log('📦 Products created');

    // Create banners
    await Banner.create([
      {
        title: 'Premium Laptops',
        subtitle: 'Up to 30% off on select models',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1920&h=600&fit=crop',
        link: '/products?category=Laptops',
        order: 1,
        isActive: true
      },
      {
        title: 'Latest Mobile Phones',
        subtitle: 'Discover cutting-edge technology',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1920&h=600&fit=crop',
        link: '/products?category=Mobile Phones',
        order: 2,
        isActive: true
      },
      {
        title: 'Exclusive Deals',
        subtitle: 'Limited time offers on accessories',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1920&h=600&fit=crop',
        link: '/products?category=Accessories',
        order: 3,
        isActive: true
      }
    ]);
    console.log('🎨 Banners created');

    console.log('✨ Database seeded successfully!');
    console.log('\n📝 Test Accounts:');
    console.log('Admin: admin@example.com / admin123');
    console.log('User: john@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
