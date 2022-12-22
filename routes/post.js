const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')

const { Op } = require("sequelize");
const { Post } = require("../models");
const { User } = require("../models");
const { Comment } = require("../models");
const authMiddleware  = require("../middleware/auth-middleware")

const app = express();
const router = express.Router();
app.use(cookieParser());

// 게시글 작성
router.post("/posts", authMiddleware, async (req,res) =>{
  try {
    writer_id = res.locals.user
    const { title, content } = req.body;
    if (!title) {
      return res.status(412).json({errorMessage:"제목 형식이 올바르지 않습니다."})
    }
    if (!content) {
      return res.status(412).json({errorMessage:"내용 형식이 올바르지 않습니다."})
    }

    await Post.create({ title: title, content: content, writer_id })
    res.json({ "Message": "게시글 작성 완료" })
  }
  catch {
    res.status(400).json({errorMessage : "게시글 작성에 실패하였습니다."})
  }
  
})

// 게시글 전체 조회
router.get("/posts", async (req,res) => {
  
  try {
    const posts = await Post.findAll({});
    res.json({posts});
  }
  catch {
    res.status(400).json({errorMessage:"게시글 조회에 실패하였습니다."})
  }
})

// 게시글 상세 조회
router.get("/posts/:post_id", async (req,res) => {
  try {
    const { post_id: id } = req.params;
    const post = await Post.findOne({
      where: { id },
      include: [
        { model : User,
          attributes: ['nickname']
        },
        { model : Comment,
          attributes : ['comment', 'createdAt'],
          include : [
            {
              model : User,
              attributes : ['nickname']
            }
          ]
        }
      ]
    });
    if (!post){
      return res.status(400).json({errorMessage:"게시글 조회에 실패하였습니다."})
    }

    res.json({ post })
  }
  catch (err) {
    console.log(err)
    res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." })
  }
})

// 게시글 수정
router.put("/posts/:post_id", authMiddleware,async (req,res) => {
  try{
    const user_id = res.locals.user;
    const {post_id: id} = req.params;
    const {title, content} = req.body;

    if (title === undefined) {
      return res.status(412).json({errorMessage:"제목 형식이 올바르지 않습니다."})
    }
    if (content === undefined) {
      return res.status(412).json({errorMessage:"내용 형식이 올바르지 않습니다."})
    }
  
    const result = await Post.findOne({where: {id,writer_id:user_id}})
    
    if (!result) {
      return res.status(412).json({errorMessage:"게시글 작성자가 아닙니다"})
    }

    result.title = title;
    result.content = content;
    await result.save();
    res.json({"Message":"게시글 수정 완료"})
  }
  catch(err){
    res.status(400).json({errorMessage:"게시글 수정에 실패하였습니다."})
  }
})

//게시글 삭제
router.delete("/posts/:post_id", authMiddleware, async (req,res) => {
  try {
    const user_id = res.locals.user;
    const {post_id: id} = req.params;

    const findPost = await Post.findByPk(id)
    if (!findPost) {
      return res.status(404).json({errorMessage:"게시글이 존재하지 않습니다"})
    }
    const result = await Post.findOne({where: {id,writer_id:user_id}})
    if (!result) {
      return res.status(401).json({errorMessage:"게시글 작성자가 아닙니다"})
    }
    
    await findPost.destroy();
    res.json({"Message":"게시글 삭제 완료"})
  }
  catch {
    res.status(400).json({errorMessage:"게시글 삭제에 실패하였습니다."})
  }
})


module.exports = router;
