import mongoose from "mongoose";
// name, price, image
// slug, description, quantity, category,
//  rating (cái này tạm thời để vậy nếu k cần dùng thì bỏ),
//  status (available, not avai), deleted (true, false)

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

// export default mongoose.model("Test", TestSchema, "test");
const Product = mongoose.model("Product", productSchema);
export default Product;
