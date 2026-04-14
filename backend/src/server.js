import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import artistRoutes from "./routes/artists.js";
import beautyRoutes from "./routes/beauty.js";
import snackRoutes from "./routes/snacks.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB 연결
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb+srv://seansaiid_db_user:Z6eIQO4kB9fmBfEq@cluster0.n7pz4yj.mongodb.net/?appName=Cluster0";
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("✅ MongoDB 연결 성공");
  } catch (error) {
    console.error("❌ MongoDB 연결 실패:", error.message);
    process.exit(1);
  }
};

// 헬스 체크
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "K-Culture Daily 백엔드 정상 작동",
    timestamp: new Date().toISOString()
  });
});

// API 라우트
app.use("/api/artists", artistRoutes);
app.use("/api/beauty", beautyRoutes);
app.use("/api/snacks", snackRoutes);

// 통합 검색
app.get("/api/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.json({ success: true, data: [] });

    const Artist = mongoose.model("Artist");
    const BeautyProduct = mongoose.model("BeautyProduct");
    const SnackProduct = mongoose.model("SnackProduct");

    const regex = new RegExp(query, "i");

    const [artists, beauty, snacks] = await Promise.all([
      Artist.find({ name: regex, status: "approved" }).limit(5),
      BeautyProduct.find({ name: regex, status: "approved" }).limit(5),
      SnackProduct.find({ name: regex, status: "approved" }).limit(5)
    ]);

    res.json({
      success: true,
      data: {
        artists,
        beauty,
        snacks
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error("🔴 에러:", err);
  res.status(500).json({ 
    success: false,
    error: "서버 오류",
    message: err.message 
  });
});

// 서버 시작
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 백엔드 서버 시작: http://localhost:${PORT}`);
    console.log(`📊 헬스 체크: http://localhost:${PORT}/health`);
    console.log(`🎤 K-POP API: http://localhost:${PORT}/api/artists`);
    console.log(`💄 K-Beauty API: http://localhost:${PORT}/api/beauty`);
    console.log(`🍿 K-Snack API: http://localhost:${PORT}/api/snacks`);
    console.log(`🔍 검색 API: http://localhost:${PORT}/api/search?q=keyword`);
  });
};

startServer();

export default app;
