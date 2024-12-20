import mongoose from 'mongoose';
import mongooseAutoPopulate from "mongoose-autopopulate";
import paginate from "mongoose-paginate-v2";
import {Table} from "./index.js";
import moment from "moment";
import slugify from "slugify";

const OrderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
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
    option: {
      type: String,
      default: ''
    },
    note: {
      type: String,
      default: ''
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
      enum: ['pending', 'cooking', 'completed'],
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
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date,
    default: null
  },
  billCode: {
    type: String,
  },
  discounts: [{
    reason: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  }],
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  checkoutMethod: {
    type: String,
    enum: ['cash', 'banking'],
    default: null
  }
}, {
  timestamps: true,
});

OrderSchema.pre("save", async function (next) {
  if (!this.billCode) {
    const table = await Table.findById(this.table);
    this.billCode = `B${moment().format("DDMMYYYY-HHmm")}-${slugify(table.name, {lower: false})}`;
  }
  //cal total
  if (!this.total) this.total = 0;
  const total = this.products.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
  const discount = this.discounts?.reduce((acc, item) => {
    return acc + item.value;
  }, 0) || 0;
  this.total = total - discount;

  //cal status
  if (this?.products?.every(item => item.status === 'completed')) {
    this.status = 'completed';
  } else {
    this.status = 'pending';
  }
  next();
});

OrderSchema.methods.CreateBillCode = async function () {
  const table = await Table.findById(this.table);
  this.billCode = `B${moment().format("DDMMYYYY-HHmmss")}-${slugify(table.name, {lower: false})}`;
  await this.save();
  return this.billCode;
}

OrderSchema.plugin(mongooseAutoPopulate);

OrderSchema.plugin(paginate);

export default mongoose.model('Order', OrderSchema, 'orders');