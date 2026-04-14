import express from "express";
import BeautyProduct from "../models/BeautyProduct.js";

const router = express.Router();

// 모든 승인된 뷰티 제품 조회
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const products = await BeautyProduct.find({ status: "approved" })
      .sort({ globalPopularity: -1 })
      .skip(skip)
      .limit(limit);

    const total = await BeautyProduct.countDocuments({ status: "approved" });

    res.json({
      success: true,
      data: products,
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

// 특정 제품 상세 조회
router.get("/:id", async (req, res) => {
  try {
    const product = await BeautyProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: "제품을 찾을 수 없습니다" });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 제품 생성 (내부용)
router.post("/", async (req, res) => {
  try {
    const product = new BeautyProduct(req.body);
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
