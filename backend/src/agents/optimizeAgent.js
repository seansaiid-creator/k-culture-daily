import mongoose from "mongoose";
import dotenv from "dotenv";
import Artist from "../models/Artist.js";
import BeautyProduct from "../models/BeautyProduct.js";
import SnackProduct from "../models/SnackProduct.js";

dotenv.config();

class OptimizeAgent {
  async start() {
    try {
      console.log("⚡ 최적화 에이전트 시작...");
      await this.connectDB();
      
      await this.optimizeArtists();
      await this.optimizeBeauty();
      await this.optimizeSnacks();
      
      console.log("✅ 최적화 에이전트 완료!");
      process.exit(0);
    } catch (error) {
      console.error("❌ 최적화 에이전트 오류:", error);
      process.exit(1);
    }
  }

  async optimizeArtists() {
    console.log("\n🎤 K-POP 최적화 시작...");
    const artists = await Artist.find({ status: "approved" });
    
    for (const artist of artists) {
      artist.tags = this.generateTags("kpop", artist);
      await artist.save();
    }
    
    console.log(`  ✅ ${artists.length}개 아이돌 태그 생성 완료`);
  }

  async optimizeBeauty() {
    console.log("\n💄 K-Beauty 최적화 시작...");
    const products = await BeautyProduct.find({ status: "approved" });
    
    for (const product of products) {
      product.tags = this.generateTags("kbeauty", product);
      await product.save();
    }
    
    console.log(`  ✅ ${products.length}개 제품 태그 생성 완료`);
  }

  async optimizeSnacks() {
    console.log("\n🍿 K-Snack 최적화 시작...");
    const snacks = await SnackProduct.find({ status: "approved" });
    
    for (const snack of snacks) {
      snack.tags = this.generateTags("ksnack", snack);
      await snack.save();
    }
    
    console.log(`  ✅ ${snacks.length}개 상품 태그 생성 완료`);
  }

  generateTags(category, item) {
    const tags = [];
    
    if (category === "kpop") {
      tags.push("kpop", "hidden-gems", "korean-artist");
      if (item.score > 90) tags.push("trending");
    } else if (category === "kbeauty") {
      tags.push("kbeauty", "skincare", item.brand.toLowerCase());
      if (item.rating > 4.5) tags.push("bestseller");
    } else if (category === "ksnack") {
      tags.push("ksnack", "korean-food", item.brand.toLowerCase());
      if (item.rating > 4.2) tags.push("popular");
    }
    
    return [...new Set(tags)];
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

const agent = new OptimizeAgent();
agent.start();
export default OptimizeAgent;
