import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    // if we we don't want to allow two movies with the same name then we can use unique
    unique: true
  },
  publish_year: Number,
  duration: {
    type: Number,
    default: 1.0
  }
})

// this will make a collection in mongodb (prular and lower case) so it will be movies
export const Movie = mongoose.model('Movie', schema);