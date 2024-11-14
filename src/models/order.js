import mongoose from 'mongoose';
import mongooseAutoPopulate from "mongoose-autopopulate";
import paginate from "mongoose-paginate-v2";

const OrderSchema = new mongoose.Schema({
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    autopopulate: true,
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      autopopulate: {
        select: "_id slug name image"
      },
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending'
    }
  }],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
}, {
  timestamps: true,
});

OrderSchema.plugin(mongooseAutoPopulate);

OrderSchema.plugin(paginate);

export default mongoose.model('Order', OrderSchema, 'orders');