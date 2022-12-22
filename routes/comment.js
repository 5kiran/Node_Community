const express = require("express");

const cookieParser = require('cookie-parser')

const { Op, where } = require("sequelize");
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

// 댓글 목록 조회 API
router.get("/comments/:post_id", async (req,res) => {
  const {post_id} = req.params;

  comments = await Comment.findAll({
    where : { post_id : post_id },
    raw : true,
    attributes : ['post_id','comment','User.nickname'],
    include : [
      { model : User,
        attributes: []
      }
    ]
  })
  res.json({comments})
})

// 댓글 수정 API
router.put("/comments/:id", authMiddleware, async (req,res) => {
  try{
    const user_id = res.locals.user;
    const {id} = req.params;
    const {comment} = req.body;

    if (!comment) {
      return res.status(412).json({errorMessage:"내용 형식이 올바르지 않습니다."})
    }
  
    const result = await Comment.findOne({where: {id,writer_id:user_id}})
    
    if (!result) {
      return res.status(412).json({errorMessage:"댓글 작성자가 아닙니다"})
    }

    result.comment = comment;
    await result.save();
    res.json({"Message":"댓글 수정 완료"})
  }
  catch(err){
    res.status(400).json({errorMessage:"댓글 수정에 실패하였습니다."})
  }
})

// 댓글 삭제 API
router.delete("/comments/:id", authMiddleware, async (req,res) => {
  try {
    const user_id = res.locals.user;
    const {id} = req.params;

    const findComment = await Comment.findByPk(id)
    if (!findComment) {
      return res.status(404).json({errorMessage:"댓글이 존재하지 않습니다"})
    }
    const result = await Comment.findOne({where: {id,writer_id:user_id}})
    if (!result) {
      return res.status(401).json({errorMessage:"댓글 작성자가 아닙니다"})
    }
    
    await result.destroy();
    res.json({"Message":"댓글 삭제 완료"})
  }
  catch {
    res.status(400).json({errorMessage:"댓글 삭제에 실패하였습니다."})
  }
})

module.exports = router;