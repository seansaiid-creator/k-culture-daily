import mongoose from "mongoose";
import dotenv from "dotenv";
import Artist from "../models/Artist.js";
import BeautyProduct from "../models/BeautyProduct.js";
import SnackProduct from "../models/SnackProduct.js";

dotenv.config();

class PublishAgent {
  async start() {
    try {
      console.log("📢 게시 에이전트 시작...");
      await this.connectDB();
      
      await this.publishArtists();
      await this.publishBeauty();
      await this.publishSnacks();
      
      console.log("✅ 게시 에이전트 완료!");
      process.exit(0);
    } catch (error) {
      console.error("❌ 게시 에이전트 오류:", error);
      process.exit(1);
    }
  }

  async publishArtists() {
    console.log("\n🎤 K-POP 게시 시작...");
    const approved = await Artist.find({ status: "approved" }).sort({ updatedAt: -1 }).limit(10);
    console.log(`  ✅ ${approved.length}개 아이돌 게시 준비 완료`);
  }

  async publishBeauty() {
    console.log("\n💄 K-Beauty 게시 시작...");
    const approved = await BeautyProduct.find({ status: "approved" }).sort({ updatedAt: -1 }).limit(10);
    console.log(`  ✅ ${approved.length}개 제품 게시 준비 완료`);
  }

  async publishSnacks() {
    console.log("\n🍿 K-Snack 게시 시작...");
    const approved = await SnackProduct.find({ status: "approved" }).sort({ updatedAt: -1 }).limit(10);
    console.log(`  ✅ ${approved.length}개 상품 게시 준비 완료`);
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
}

const agent = new PublishAgent();
agent.start();
export default PublishAgent;
