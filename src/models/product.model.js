import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import { BadRequestError } from "../exception/errorResponse.js";

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
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Thay ký tự đặc biệt và khoảng trắng bằng dấu gạch ngang
      .replace(/^-+|-+$/g, ""); // Loại bỏ dấu gạch ngang thừa ở đầu và cuối
  }
  next();
});

// Check sản phẩm đã tồn tại chưa
productSchema.statics.createProduct = async function (data) {
  const existProduct = await this.findOne({
    name: { $regex: new RegExp(`^${data.name}$`, "i") },
  });
  if (existProduct) {
    throw new BadRequestError("product_existed");
  }
  return this.create(data);
};

productSchema.plugin(paginate);
export default mongoose.model("Product", productSchema, "products");
