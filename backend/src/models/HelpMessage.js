import mongoose from 'mongoose';

const helpMessageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'in_review', 'resolved'],
      default: 'new',
    },
  },
  { timestamps: true }
);

export const HelpMessage =
  mongoose.models.HelpMessage || mongoose.model('HelpMessage', helpMessageSchema);
