import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
      trim: true,
      minlength: [1, 'Name must be at least 1 character'],
      maxlength: [200, 'Name cannot exceed 200 characters']
    },
    publish_year: {
      type: Number,
      required: [true, 'Publish year is required'],
      min: [1888, 'Movies did not exist before 1888'],
      max: [new Date().getFullYear() + 5, 'Publish year cannot be too far in the future']
    },
    duration: {
      type: Number,
      default: 1.0,
      min: [1, 'Duration must be at least 1 minute']
    },
    genre: {
      type: [String],
      required: [true, 'At least one genre is required'],
      validate: {
        validator: (arr: string) => arr.length > 0,
        message: 'A movie must have at least one genre'
      }
    },
    director: {
      type: String,
      required: [true, 'Director is required'],
      trim: true
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be negative'],
      max: [10, 'Rating cannot exceed 10'],
      default: 0
    },
    votes: {
      type: Number,
      min: [0, 'Votes cannot be negative'],
      default: 0
    },
    language: {
      type: String,
      trim: true,
      default: 'English'
    },
    country: {
      type: String,
      trim: true
    },
    budget: {
      type: Number,
      min: [0, 'Budget cannot be negative'],
      default: 0
    },
    box_office: {
      type: Number,
      min: [0, 'Box office cannot be negative'],
      default: 0
    },
    awards_won: {
      type: Number,
      min: [0, 'Awards cannot be negative'],
      default: 0
    },
    is_available: {
      type: Boolean,
      default: true
    },
    streaming_platforms: {
      type: [String],
      default: []
    },
    release_date: {
      type: Date
    },
    cast: {
      type: [String],
      default: []
    }
  },
  // these two variables are added for the virtual fields
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
);

// vituals are functions that are added to the schema
// they can be used to add extra functionality to the schema
// but it's not a real field in the database

schema.virtual('duration_in_hours').get(function () {
  return this.duration / 60;
});

// this will make a collection in mongodb (prular and lower case) so it will be movies
export const Movie = mongoose.model('Movie', schema);