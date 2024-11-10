import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String, // URL của ảnh sản phẩm
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    status: {
      type: String,
      enum: ["available", "not available"],
      default: "available",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Tạo slug tự động từ name trước khi lưu
productSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = `${slugify(this.name, { lower: true })}_${this._id}`;
  }
  next();
});

productSchema.plugin(paginate);
export default mongoose.model("Product", productSchema, "products");
