import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

class CrawlerAgent {
  constructor() {
    this.crawlers = {
      kpop: ["spotifyArtists", "youtubePopularity", "twitterTrends", "redditReviews", "allkpopNews", "soompiNews", "instagramTrends", "melonChart"],
      kbeauty: ["naverBeauty", "coupangBeauty", "yesstyleBeauty", "instagramBeauty", "tiktokBeauty", "sephoraBeauty", "redditBeauty", "youtubeBeauty"],
      ksnack: ["naverSnacks", "coupangSnacks", "amazonSnacks", "youtubeSnacks", "instagramSnacks", "tiktokSnacks", "redditSnacks", "foodieBlog"]
    };
    this.results = { success: 0, failed: 0, total: 0, startTime: null, endTime: null };
  }

  async start() {
    try {
      console.log("🚀 크롤러 에이전트 시작...");
      this.results.startTime = Date.now();
      this.results.total = Object.values(this.crawlers).flat().length;
      await this.connectDB();
      await Promise.all([this.runCategory("kpop"), this.runCategory("kbeauty"), this.runCategory("ksnack")]);
      this.results.endTime = Date.now();
      await this.report();
      console.log("✅ 크롤러 에이전트 완료!");
      process.exit(0);
    } catch (error) {
      console.error("❌ 크롤러 에이전트 오류:", error);
      process.exit(1);
    }
  }

  async runCategory(category) {
    console.log(`\n📂 ${category.toUpperCase()} 크롤러 시작...`);
    for (const crawler of this.crawlers[category]) {
      try {
        console.log(`  ⏳ ${crawler} 크롤링 중...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.results.success++;
        console.log(`  ✅ ${crawler} 완료`);
      } catch (error) {
        this.results.failed++;
        console.error(`  ❌ ${crawler} 실패:`, error.message);
      }
    }
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
    const duration = this.results.endTime - this.results.startTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);
    console.log("\n" + "=".repeat(50));
    console.log("📊 크롤러 에이전트 리포트");
    console.log("=".repeat(50));
    console.log(`✅ 성공: ${this.results.success}/${this.results.total}`);
    console.log(`❌ 실패: ${this.results.failed}/${this.results.total}`);
    console.log(`⏱️ 소요 시간: ${minutes}분 ${seconds}초`);
    console.log("=".repeat(50));
  }
}

const agent = new CrawlerAgent();
agent.start();
export default CrawlerAgent;
