import mongoose from 'mongoose';

const timelineStepSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ['reported', 'verified', 'assigned', 'in_progress', 'resolved', 'rejected', 'reopened'],
    },
    at: {
      type: Date,
      default: Date.now,
    },
    by: {
      type: String,
      default: 'System',
    },
    note: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const pointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  { _id: false }
);

const issueSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'street_light',
        'garbage',
        'pothole',
        'water',
        'drainage',
        'water_stagnation',
        'electricity',
        'traffic',
        'other',
      ],
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 280,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    location: {
      type: pointSchema,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['reported', 'verified', 'assigned', 'in_progress', 'resolved', 'rejected', 'reopened'],
      default: 'reported',
      index: true,
    },
    timeline: [timelineStepSchema],
    affectedCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    duplicateOf: {
      type: String,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Geo index for 2dsphere proximity searches
issueSchema.index({ location: '2dsphere' });

export const Issue = mongoose.models.Issue || mongoose.model('Issue', issueSchema);
