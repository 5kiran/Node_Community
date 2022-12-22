const express = require("express");

const cookieParser = require('cookie-parser')
const { Like, Post } = require("../models");
const authMiddleware  = require("../middleware/auth-middleware")

const app = express();
const router = express.Router();

app.use(cookieParser());

router.put("/posts/:post_id/like", authMiddleware, async (req,res) => {
  try {
    const {post_id} = req.params;
    const user_id = res.locals.user;

    const existsPost = await Post.findOne({
      where : {id:post_id}
    })
    
    if (!existsPost) {
      return res.status(404).json({errorMessage:"게시글이 존재하지 않습니다."})
    }
    const existsLike = await Like.findOne({
      where : {post_id:post_id, user_id: user_id}
    })
    if (!existsLike) {
      await Like.create({post_id:post_id,user_id:user_id})
      return res.json({"message":"좋아요 등록 완료"})
    }
  
    existsLike.destroy();
    res.json({"message":"좋아요 취소 완료"})    
  }
  catch {
    res.status(400).json({"message":"게시글 좋아요에 실패하였습니다."})
  }
  
})

module.exports = router;