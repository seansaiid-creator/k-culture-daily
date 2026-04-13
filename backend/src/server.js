import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

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
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://seansaiid_db_user:Z6eIQO4kB9fmBfEq@cluster0.n7pz4yj.mongodb.net/?appName=Cluster0';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB 연결 성공');
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error.message);
    process.exit(1);
  }
};

// 헬스 체크
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'K-Culture Daily 백엔드 정상 작동',
    timestamp: new Date().toISOString()
  });
});

// API 라우트 (아직 구현 안 함)
app.get('/api/artists', (req, res) => {
  res.json({ 
    message: 'K-POP Hidden Gems (준비 중)',
    data: []
  });
});

app.get('/api/beauty', (req, res) => {
  res.json({ 
    message: 'K-Beauty 최신 제품 (준비 중)',
    data: []
  });
});

app.get('/api/snacks', (req, res) => {
  res.json({ 
    message: 'K-Snack 인기 상품 (준비 중)',
    data: []
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('🔴 에러:', err);
  res.status(500).json({ 
    error: '서버 오류',
    message: err.message 
  });
});

// 서버 시작
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 백엔드 서버 시작: http://localhost:${PORT}`);
    console.log(`📊 헬스 체크: http://localhost:${PORT}/health`);
    console.log(`🎤 K-POP: http://localhost:${PORT}/api/artists`);
    console.log(`💄 K-Beauty: http://localhost:${PORT}/api/beauty`);
    console.log(`🍿 K-Snack: http://localhost:${PORT}/api/snacks`);
  });
};

startServer();

export default app;
