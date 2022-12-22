const express = require("express");
const {Op} = require("sequelize");
const jwt = require("jsonwebtoken");
const {User} = require("./models");
const authMiddleware  = require("./middleware/auth-middleware")
const usersRouter = require("./routes/user")
const postsRouter = require("./routes/post")
const commentsRouter = require("./routes/comment")
const likesRouter = require("./routes/like")

const app = express();


app.use(express.json());
app.use("/api", express.urlencoded({extended: false}), [usersRouter,postsRouter,commentsRouter,likesRouter])



app.listen(8080, () => {
  console.log("서버가 요청을 받을 준비가 됬어요");
});