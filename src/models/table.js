import mongoose from 'mongoose';
import paginate from "mongoose-paginate-v2";

const TableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  floor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Floor',
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

TableSchema.plugin(paginate);

export default mongoose.model('Table', TableSchema, 'tables');