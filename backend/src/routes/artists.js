import express from "express";
import Artist from "../models/Artist.js";

const router = express.Router();

// 모든 승인된 아이돌 조회
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const artists = await Artist.find({ status: "approved" })
      .sort({ score: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Artist.countDocuments({ status: "approved" });

    res.json({
      success: true,
      data: artists,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 특정 아이돌 상세 조회
router.get("/:id", async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ success: false, error: "아이돌을 찾을 수 없습니다" });
    res.json({ success: true, data: artist });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 아이돌 생성 (내부용)
router.post("/", async (req, res) => {
  try {
    const artist = new Artist(req.body);
    await artist.save();
    res.status(201).json({ success: true, data: artist });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
