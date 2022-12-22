// middlewares/auth-middleware.js

const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = (req, res, next) => {
  const { cookie } = req.headers;
  const [authType, authToken] = (cookie || "").split("=");
  //authType : Bearer
  //authToken : 실제 jwt 값
  // bearer kfjaskfjkasjfkas.fksajfkasjfkasjkfa.fsakjfkasjfk
  // token=gldskgl;kdsl;gksl;d.gldskkgldskgl;ksdl;.gklsdgklsjdgksd

  if (!authToken || authType !== "token") {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
    return;
  }

  try {
    // 복호화 검증
    const {id} = jwt.verify(authToken, "gilhwan-secretKey");
    User.findByPk(id).then((user) => {
      res.locals.user = user.id;
      next();
    });
  } catch (err) {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }
};