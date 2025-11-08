import mongoose from 'mongoose';

const FileRecordSchema = new mongoose.Schema(
  {
    ownerName: {
      type: String,
      trim: true,
    },
    originalFileName: {
      type: String,
      required: [true, 'Original file name is required.'],
      trim: true,
    },
    ownerEmail: {
      type: String,
      required: [true, 'Owner email is required.'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    recipientEmails: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    sizeInBytes: {
      type: Number,
      required: [true, 'File size is required.'],
    },
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required.'],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * --- Virtual Property for Expiration ---
 * This adds a virtual 'isExpired' field to the schema.
 * It is NOT saved in the database; it is calculated on the fly
 * every time you retrieve a document.
 */
FileRecordSchema.virtual('isExpired').get(function () {
  if (!this.createdAt) {
    return false;
  }
  
  // Get the creation date
  const createdAt = this.createdAt;
  
  // Calculate the expiration date (72 hours after creation)
  const expiresAt = new Date(createdAt.getTime() + 72 * 60 * 60 * 1000); // 72 hours in ms
  
  // Return true if the current time is past the expiration date
  return new Date() > expiresAt;
});


export default mongoose.models.User || mongoose.model('User', FileSchema);