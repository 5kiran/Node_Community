const express = require("express");

const cookieParser = require('cookie-parser')
const { Like, Post ,User } = require("../models");
const authMiddleware  = require("../middleware/auth-middleware")

const app = express();
const router = express.Router();

app.use(cookieParser());


// 게시글 좋아요 API
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
      await Post.increment({like : 1},{where :{id:post_id}})
      await Like.create({post_id:post_id,user_id:user_id})
      return res.json({"message":"좋아요 등록 완료"})
    }
    
    await Post.increment({like : -1},{where :{id:post_id}})
    existsLike.destroy();
    res.json({"message":"좋아요 취소 완료"})    
  }
  catch {
    res.status(400).json({"message":"게시글 좋아요에 실패하였습니다."})
  }
})

// 좋아요 게시글 조회
router.get("/likes/posts", authMiddleware, async (req,res) => {
  const user_id = res.locals.user;
  const existsLikePost = await Like.findAll({
    where : {user_id:user_id},
    raw : true,
    attributes : [
      'post_id',
      'user_id',
      'Post.title',
      'Post.content',
      'Post.createdAt',
      'Post.User.nickname',
      'Post.like'
    ],
    include : [
      {
        model: Post,
        attributes: [],
        include : [
          {
            model : User,
            attributes : []
          }
        ]
      }
    ],
    order: [[Post, 'like', 'desc']]
  });




  console.log(existsLikePost)
  res.send(existsLikePost)
})
module.exports = router;