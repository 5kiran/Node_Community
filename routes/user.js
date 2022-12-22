const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')

const { Op } = require("sequelize");
const { User } = require("../models");
const authMiddleware  = require("../middleware/auth-middleware")

const app = express();
const router = express.Router();

app.use(cookieParser());

// 회원가입 API
router.post("/register", async (req,res) => {
  try {
    const { email, nickname, password, confirmPassword } = req.body;
    const emailRegex = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+$/;
    if (!emailRegex.test(email)) {
      return res.status(412).json({errorMessage:"email 형식이 올바르지 않습니다."})
    }
    
    const pwRegex = /(?=.*[0-9])(?=.*[a-z])(?=.*\W)(?=\S+$).{8,20}/;
    if (!pwRegex.test(password)) {
      return res.status(412).json({errorMessage:"password 형식이 올바르지 않습니다."})
    }
  
    if (password.match(email) !== null ) {
      return res.status(412).json({errorMessage:"Password에 Email이 포함되어 있습니다"})
    }

    if (password !== confirmPassword) {
      return res.status(412).send({ errorMessage: "password를 재확인 해주세요." })
    }

    const existsUsers = await User.findAll({
      where: {
        [Op.or]: [{ email }, { nickname }]
      }
    })

    if (existsUsers.length) {
      return res.status(412).json({ errorMessage: "이메일이나 닉네임이 중복 되었습니다." });
    }
    await User.create({ email, nickname, password })
    res.status(201).json({'message': '회원 가입에 성공하였습니다.'})
  }
  catch{
    res.status(400).json({errorMessage:"데이터 형식이 올바르지 않습니다."})
  }
})


// 로그인 API
router.post("/auth", async (req,res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email, password } });

    if (!user) {
      return res.status(400).json({ errorMessage: "이메을 또는 패스워드를 확인해주세요" })
    }

    const token = jwt.sign(
      { id: user.id }, // jwt payload 데이터
      "gilhwan-secretKey", // 비밀키
      { expiresIn: "100m" } // 토큰 만료 시간
    )
    res.cookie("token", token)
    res.json({"token":token})
  }
  catch(err) {
    res.status(400).json({errorMessage:"로그인에 실패하였습니다."})
  }
})

module.exports = router;