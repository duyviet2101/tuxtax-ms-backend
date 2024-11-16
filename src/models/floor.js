import mongoose from 'mongoose';
import paginate from "mongoose-paginate-v2";

const FloorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true, // Đảm bảo tính duy nhất ở mức cơ sở dữ liệu
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
});

function generateSlugFromName(name) {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
}

async function ensureUniqueSlug(model, slug, id) {
  let uniqueSlug = slug;
  let count = 1;

  while (true) {
    const existing = await model.findOne({ slug: uniqueSlug, _id: { $ne: id } });
    if (!existing) break;
    uniqueSlug = `${slug}_${count}`;
    count++;
  }

  return uniqueSlug;
}

FloorSchema.pre("save", async function (next) {
  if (!this.slug) {
    const baseSlug = generateSlugFromName(this.name);
    this.slug = await ensureUniqueSlug(mongoose.models.Floor, baseSlug, this._id);
  }
  next();
});

FloorSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    const baseSlug = generateSlugFromName(doc.name);
    const uniqueSlug = await ensureUniqueSlug(mongoose.models.Floor, baseSlug, doc._id);
    if (doc.slug !== uniqueSlug) {
      doc.slug = uniqueSlug;
      await doc.save();
    }
  }
});

FloorSchema.plugin(paginate);

export default mongoose.model('Floor', FloorSchema, 'floors');