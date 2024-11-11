import mongoose from 'mongoose';
import mongooseAutoPopulate from "mongoose-autopopulate";
import slugify from "slugify";
import paginate from "mongoose-paginate-v2";

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    default: ""
  },
  slug: {
    type: String,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
}, {
  timestamps: true,
});

CategorySchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(`${this.name} ${this._id}`, { lower: true, locale: 'vi' });
  }
  next();
});

CategorySchema.post(["findOneAndUpdate"], function (doc) {
  if (doc) {
    doc.slug = slugify(`${doc?.name} ${doc?._id}`, { lower: true, locale: 'vi' });
    return doc.save();
  }
});

CategorySchema.plugin(mongooseAutoPopulate);

CategorySchema.plugin(paginate);

export default mongoose.model('Category', CategorySchema, 'categories');