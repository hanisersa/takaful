import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';

const transactionSchema = new mongoose.Schema(
  {
    service:    { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    requester:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    points:     { type: Number, required: true },
    message:    { type: String, default: '' },
    status:     {
      type: String,
      enum: ['pending', 'accepted', 'in_progress', 'completed', 'refused', 'cancelled'],
      default: 'pending',
    },
    requesterConfirmed: { type: Boolean, default: false },
    providerConfirmed:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Use serverless-safe model caching pattern
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

// --- Helper functions ---

export async function createTransaction(data) {
  await dbConnect();
  return Transaction.create(data);
}

export async function findTransactionById(id) {
  await dbConnect();
  return Transaction.findById(id)
    .populate('service', 'title category points')
    .populate('requester', 'firstName lastName avatar phone')
    .populate('provider', 'firstName lastName avatar phone');
}

export async function findTransactionsByUser(userId) {
  await dbConnect();
  return Transaction.find({
    $or: [{ requester: userId }, { provider: userId }],
  })
    .populate('service', 'title category points')
    .populate('requester', 'firstName lastName avatar')
    .populate('provider', 'firstName lastName avatar')
    .sort({ createdAt: -1 });
}

export async function findTransactionsByProvider(providerId) {
  await dbConnect();
  return Transaction.find({ provider: providerId })
    .populate('service', 'title category points')
    .populate('requester', 'firstName lastName avatar phone')
    .sort({ createdAt: -1 });
}

export async function findExistingTransaction(serviceId, requesterId) {
  await dbConnect();
  return Transaction.findOne({
    service: serviceId,
    requester: requesterId,
    status: { $nin: ['refused', 'cancelled'] },
  })
    .populate('service', 'title category points')
    .populate('requester', 'firstName lastName avatar')
    .populate('provider', 'firstName lastName avatar');
}

export async function updateTransaction(id, updates) {
  await dbConnect();
  return Transaction.findByIdAndUpdate(id, updates, { new: true })
    .populate('service', 'title category points')
    .populate('requester', 'firstName lastName avatar phone')
    .populate('provider', 'firstName lastName avatar phone');
}

export default Transaction;
