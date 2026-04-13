import mongoose from "mongoose";

const ArtistSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, index: true },
  category: { type: String, default: "kpop", enum: ["kpop"] },
  score: { type: Number, min: 0, max: 100, default: 0, index: true },
  spotifyGlobal: { type: Number, default: 0 },
  spotifyKorea: { type: Number, default: 0 },
  ratio: { type: Number, default: 0 },
  youtubeViews: { type: Number, default: 0 },
  youtubeCommentRatio: { type: Number, default: 0 },
  twitterMentions: { type: Number, default: 0 },
  instagramHashtags: { type: Number, default: 0 },
  redditPosts: { type: Number, default: 0 },
  source: { type: [String], default: [] },
  image: String,
  description: String,
  tags: { type: [String], default: [] },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
});

ArtistSchema.index({ score: -1 });
ArtistSchema.index({ status: 1, updatedAt: -1 });
ArtistSchema.pre("save", function(next) { this.updatedAt = Date.now(); next(); });

const Artist = mongoose.model("Artist", ArtistSchema);
export default Artist;
