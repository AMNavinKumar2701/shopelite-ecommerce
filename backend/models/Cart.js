const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User reference is required for cart'],
            unique: true
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },

                title: {
                    type: String,
                    required: true
                },

                price: {
                    type: Number,
                    required: true,
                    min: [0, 'Price cannot be negative']
                },

                image: {
                    type: String
                },

                quantity: {
                    type: Number,
                    default: 1,
                    min: [1, 'Quantity must be at least 1']
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Cart', cartSchema);