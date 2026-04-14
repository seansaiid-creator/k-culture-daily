import express from "express";
import SnackProduct from "../models/SnackProduct.js";

const router = express.Router();

// 모든 승인된 스낵 상품 조회
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const snacks = await SnackProduct.find({ status: "approved" })
      .sort({ globalPopularity: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SnackProduct.countDocuments({ status: "approved" });

    res.json({
      success: true,
      data: snacks,
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

// 특정 상품 상세 조회
router.get("/:id", async (req, res) => {
  try {
    const snack = await SnackProduct.findById(req.params.id);
    if (!snack) return res.status(404).json({ success: false, error: "상품을 찾을 수 없습니다" });
    res.json({ success: true, data: snack });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 상품 생성 (내부용)
router.post("/", async (req, res) => {
  try {
    const snack = new SnackProduct(req.body);
    await snack.save();
    res.status(201).json({ success: true, data: snack });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
