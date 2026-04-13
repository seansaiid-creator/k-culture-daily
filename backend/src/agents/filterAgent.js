import mongoose from "mongoose";
import dotenv from "dotenv";
import Artist from "../models/Artist.js";
import BeautyProduct from "../models/BeautyProduct.js";
import SnackProduct from "../models/SnackProduct.js";

dotenv.config();

class FilterAgent {
  constructor() {
    this.results = { artists: { approved: 0, rejected: 0 }, beauty: { approved: 0, rejected: 0 }, snacks: { approved: 0, rejected: 0 } };
  }

  async start() {
    try {
      console.log("🔍 필터링 에이전트 시작...");
      await this.connectDB();
      await this.filterArtists();
      await this.filterBeauty();
      await this.filterSnacks();
      await this.report();
      console.log("✅ 필터링 에이전트 완료!");
      process.exit(0);
    } catch (error) {
      console.error("❌ 필터링 에이전트 오류:", error);
      process.exit(1);
    }
  }

  async filterArtists() {
    console.log("\n🎤 K-POP 필터링 시작...");
    const pending = await Artist.find({ status: "pending" });
    for (const artist of pending) {
      try {
        const score = this.calculateArtistScore(artist);
        artist.score = score;
        if (score >= 75) {
          artist.status = "approved";
          this.results.artists.approved++;
        } else {
          artist.status = "rejected";
          this.results.artists.rejected++;
        }
        await artist.save();
      } catch (error) {
        console.error(`  ⚠️ 필터링 오류:`, error.message);
      }
    }
  }

  async filterBeauty() {
    console.log("\n💄 K-Beauty 필터링 시작...");
    const pending = await BeautyProduct.find({ status: "pending" });
    for (const product of pending) {
      try {
        const popularity = this.calculateBeautyPopularity(product);
        product.globalPopularity = popularity;
        if (product.rating >= 4.0 && product.reviewCount >= 100 && popularity >= 60) {
          product.status = "approved";
          this.results.beauty.approved++;
        } else {
          product.status = "rejected";
          this.results.beauty.rejected++;
        }
        await product.save();
      } catch (error) {
        console.error(`  ⚠️ 필터링 오류:`, error.message);
      }
    }
  }

  async filterSnacks() {
    console.log("\n🍿 K-Snack 필터링 시작...");
    const pending = await SnackProduct.find({ status: "pending" });
    for (const snack of pending) {
      try {
        const popularity = this.calculateSnackPopularity(snack);
        snack.globalPopularity = popularity;
        if (snack.rating >= 3.8 && snack.reviewCount >= 50 && popularity >= 50) {
          snack.status = "approved";
          this.results.snacks.approved++;
        } else {
          snack.status = "rejected";
          this.results.snacks.rejected++;
        }
        await snack.save();
      } catch (error) {
        console.error(`  ⚠️ 필터링 오류:`, error.message);
      }
    }
  }

  calculateArtistScore(artist) {
    let score = 0;
    if (artist.ratio > 3) score += Math.min(30, artist.ratio * 10);
    if (artist.youtubeCommentRatio > 50) score += Math.min(20, artist.youtubeCommentRatio / 5);
    if (artist.twitterMentions > 0) score += Math.min(15, Math.log(artist.twitterMentions + 1) * 5);
    if (artist.instagramHashtags > 0) score += Math.min(15, Math.log(artist.instagramHashtags + 1) * 3);
    if (artist.redditPosts > 0) score += Math.min(10, artist.redditPosts);
    if (artist.youtubeViews > 0) score += Math.min(10, Math.log(artist.youtubeViews) / 5);
    return Math.round(Math.min(100, Math.max(0, score)));
  }

  calculateBeautyPopularity(product) {
    let score = 0;
    score += (product.rating / 5) * 30;
    score += Math.min(30, (product.reviewCount / 100) * 30);
    const socialScore = (product.instagramMentions || 0) + (product.tiktokMentions || 0) * 2;
    score += Math.min(40, socialScore / 10);
    return Math.round(Math.min(100, Math.max(0, score)));
  }

  calculateSnackPopularity(snack) {
    let score = 0;
    score += (snack.rating / 5) * 30;
    score += Math.min(30, (snack.reviewCount / 50) * 30);
    const socialScore = (snack.instagramMentions || 0) + (snack.tiktokMentions || 0) * 1.5 + (snack.youtubeReviews || 0) * 2;
    score += Math.min(40, socialScore / 10);
    return Math.round(Math.min(100, Math.max(0, score)));
  }

  async connectDB() {
    try {
      const mongoURI = process.env.MONGODB_URI;
      await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log("✅ MongoDB 연결 성공");
    } catch (error) {
      throw new Error("MongoDB 연결 실패: " + error.message);
    }
  }

  async report() {
    console.log("\n" + "=".repeat(50));
    console.log("📊 필터링 에이전트 리포트");
    console.log("=".repeat(50));
    console.log(`🎤 K-POP: ${this.results.artists.approved} 승인, ${this.results.artists.rejected} 거절`);
    console.log(`💄 K-Beauty: ${this.results.beauty.approved} 승인, ${this.results.beauty.rejected} 거절`);
    console.log(`🍿 K-Snack: ${this.results.snacks.approved} 승인, ${this.results.snacks.rejected} 거절`);
    console.log("=".repeat(50));
  }
}

const agent = new FilterAgent();
agent.start();
export default FilterAgent;
