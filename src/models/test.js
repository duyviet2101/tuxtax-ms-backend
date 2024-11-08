import mongoose from 'mongoose';
import mongooseAutoPopulate from "mongoose-autopopulate";

const TestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
}, {
  timestamps: true,
});

TestSchema.plugin(mongooseAutoPopulate);

export default mongoose.model('Test', TestSchema, 'test');