import mongoose from 'mongoose';
import slugify from "slugify";
import paginate from "mongoose-paginate-v2";

const FloorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
  },
}, {
  timestamps: true,
});

// Tạo slug tự động từ name trước khi lưu
FloorSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(`${this.name} ${this._id}`, { lower: true, locale: 'vi' });
  }
  next();
});

FloorSchema.post(["findOneAndUpdate"], function (doc) {
  if (doc) {
    doc.slug = slugify(`${doc?.name} ${doc?._id}`, { lower: true, locale: 'vi' });
    return doc.save();
  }
});

FloorSchema.plugin(paginate);

export default mongoose.model('Floor', FloorSchema, 'floors');