const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: [true, 'Product ID is required'],
            unique: true
        },

        title: {
            type: String,
            required: [true, 'Product title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters']
        },

        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price cannot be negative']
        },

        description: {
            type: String,
            trim: true,
            maxlength: [2000, 'Description cannot exceed 2000 characters']
        },

        category: {
            type: String,
            trim: true,
            maxlength: [100, 'Category cannot exceed 100 characters']
        },

        image: {
            type: String,
            trim: true
        },

        rating: {
            rate: {
                type: Number,
                min: [0, 'Rating cannot be less than 0'],
                max: [5, 'Rating cannot exceed 5'],
                default: 0
            },
            count: {
                type: Number,
                min: [0, 'Count cannot be negative'],
                default: 0
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Product', productSchema);