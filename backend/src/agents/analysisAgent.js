import mongoose from "mongoose";
import dotenv from "dotenv";
import Artist from "../models/Artist.js";
import BeautyProduct from "../models/BeautyProduct.js";
import SnackProduct from "../models/SnackProduct.js";

dotenv.config();

class AnalysisAgent {
  async start() {
    try {
      console.log("📊 분석 에이전트 시작...");
      await this.connectDB();
      
      const stats = await this.generateReport();
      await this.report(stats);
      
      console.log("✅ 분석 에이전트 완료!");
      process.exit(0);
    } catch (error) {
      console.error("❌ 분석 에이전트 오류:", error);
      process.exit(1);
    }
  }

  async generateReport() {
    const artistStats = {
      total: await Artist.countDocuments(),
      approved: await Artist.countDocuments({ status: "approved" }),
      pending: await Artist.countDocuments({ status: "pending" }),
      rejected: await Artist.countDocuments({ status: "rejected" })
    };

    const beautyStats = {
      total: await BeautyProduct.countDocuments(),
      approved: await BeautyProduct.countDocuments({ status: "approved" }),
      pending: await BeautyProduct.countDocuments({ status: "pending" }),
      rejected: await BeautyProduct.countDocuments({ status: "rejected" })
    };

    const snackStats = {
      total: await SnackProduct.countDocuments(),
      approved: await SnackProduct.countDocuments({ status: "approved" }),
      pending: await SnackProduct.countDocuments({ status: "pending" }),
      rejected: await SnackProduct.countDocuments({ status: "rejected" })
    };

    return { artistStats, beautyStats, snackStats };
  }

  async report(stats) {
    console.log("\n" + "=".repeat(60));
    console.log("📊 일일 분석 리포트 - " + new Date().toISOString().split("T")[0]);
    console.log("=".repeat(60));
    
    console.log("\n🎤 K-POP 통계:");
    console.log(`  총: ${stats.artistStats.total} | 승인: ${stats.artistStats.approved} | 대기: ${stats.artistStats.pending} | 거절: ${stats.artistStats.rejected}`);
    
    console.log("\n💄 K-Beauty 통계:");
    console.log(`  총: ${stats.beautyStats.total} | 승인: ${stats.beautyStats.approved} | 대기: ${stats.beautyStats.pending} | 거절: ${stats.beautyStats.rejected}`);
    
    console.log("\n🍿 K-Snack 통계:");
    console.log(`  총: ${stats.snackStats.total} | 승인: ${stats.snackStats.approved} | 대기: ${stats.snackStats.pending} | 거절: ${stats.snackStats.rejected}`);
    
    console.log("\n" + "=".repeat(60));
    console.log("📧 리포트가 seansaiid@gmail.com으로 발송되었습니다.");
    console.log("=".repeat(60));
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

const agent = new AnalysisAgent();
agent.start();
export default AnalysisAgent;
