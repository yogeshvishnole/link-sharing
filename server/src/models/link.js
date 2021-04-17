import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const linkSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 256,
    },
    url: {
      type: String,
      trim: true,
      required: true,
      maxlength: 256,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
    ],
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      default: 'free',
    },
    medium: {
      type: String,
      default: 'video',
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Link = mongoose.model('Link', linkSchema);

export default Link;
