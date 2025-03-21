import mongoose, { Schema, Types } from 'mongoose';

const CustomerRequestSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    completedDescription: {
        type: String,
    },
    cancelledDescription: {
        type: String,
    },
    status: {
        type: String,
        enum: ['new', 'in_progress', 'completed', 'cancelled'],
        default: 'new',
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

const CustomerRequest = mongoose.model('CustomerRequest', CustomerRequestSchema);

export default CustomerRequest;
