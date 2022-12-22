const express = require("express");

const cookieParser = require('cookie-parser')

const { Op } = require("sequelize");
const { Post } = require("../models");
const { User } = require("../models");
const { Comment } = require("../models");
const authMiddleware  = require("../middleware/auth-middleware")

const app = express();
const router = express.Router();
app.use(cookieParser());

// 댓글 작성 API
router.post("/comments/:post_id", authMiddleware, async (req,res) => {
  try {
    const {post_id} = req.params;
    const {comment} = req.body;
    const writer_id = res.locals.user;
  
    if (!comment) {
      return res.status(412).json({errorMessage:"내용 형식이 올바르지 않습니다."})
    }
    await Comment.create({comment,post_id,writer_id});
    res.json({"message":"댓글을 작성하였습니다."})
  }
  catch {
    res.status(400).json({errorMessage:"댓글 작성에 실패하였습니다."})
  }
})

module.exports = router;