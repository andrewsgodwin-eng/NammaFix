import mongoose from 'mongoose';

const confirmationSchema = new mongoose.Schema(
  {
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Unique compound index so one user can confirm an issue once
confirmationSchema.index({ issue: 1, user: 1 }, { unique: true });

export const Confirmation =
  mongoose.models.Confirmation || mongoose.model('Confirmation', confirmationSchema);
