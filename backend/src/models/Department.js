import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    categories: [
      {
        type: String,
        required: true,
      },
    ],
    contactPhone: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      default: 'Greater Chennai Corporation',
    },
  },
  { timestamps: true }
);

export const Department =
  mongoose.models.Department || mongoose.model('Department', departmentSchema);
