const express = require("express");

const usersRouter = require("./routes/user")
const postsRouter = require("./routes/post")
const commentsRouter = require("./routes/comment")
const likesRouter = require("./routes/like");

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger/swagger-output.json");


const app = express();
const router = express.Router();


app.use(express.json());
app.use("/api", express.urlencoded({extended: false}), [router,usersRouter,postsRouter,commentsRouter,likesRouter]);

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerFile));



app.listen(8080, () => {
  console.log("서버가 요청을 받을 준비가 됬어요");
});