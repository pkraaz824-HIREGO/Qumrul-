import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    default: function() { return this.price; }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Laptops', 'Mobile Phones', 'Accessories', 'Fashion', 'Home', 'Electronics']
  },
  subcategory: {
    type: String,
    default: ''
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Product image is required']
  },
  images: [{
    type: String
  }],
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  isRefurbished: {
    type: Boolean,
    default: false
  },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Very Good', 'Good', 'Acceptable'],
    default: 'New'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search optimization
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, price: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
