import mongoose from "mongoose";

const SnackProductSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  category: { type: String, default: "ksnack", enum: ["ksnack"] },
  brand: { type: String, required: true, index: true },
  price: Number,
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, default: 0 },
  naver: { price: Number, rating: Number, sales: Number },
  coupang: { price: Number, rating: Number, sales: Number },
  amazon: { price: Number, rating: Number, sales: Number },
  yesstyle: { price: Number, rating: Number },
  instagramMentions: { type: Number, default: 0 },
  tiktokMentions: { type: Number, default: 0 },
  youtubeReviews: { type: Number, default: 0 },
  redditReviews: { type: Number, default: 0 },
  globalPopularity: { type: Number, min: 0, max: 100, default: 0, index: true },
  image: String,
  description: String,
  tags: { type: [String], default: [] },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
});

SnackProductSchema.index({ globalPopularity: -1 });
SnackProductSchema.index({ status: 1, updatedAt: -1 });
SnackProductSchema.pre("save", function(next) { this.updatedAt = Date.now(); next(); });

const SnackProduct = mongoose.model("SnackProduct", SnackProductSchema);
export default SnackProduct;
