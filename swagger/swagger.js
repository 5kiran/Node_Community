const swaggerAutogen = require('swagger-autogen')({ language: 'ko' });

const doc = {
  info: {
    title: "나만의 BE 커뮤니티",
    description: "Node.js Community",
  },
  host: "localhost:8080",
  schemes: ["http"],
  // schemes: ["https" ,"http"],
};

const outputFile = "./swagger-output.json";	// 같은 위치에 swagger-output.json을 만든다.
const endpointsFiles = [
  "../app.js"					// 라우터가 명시된 곳을 지정해준다.
];

swaggerAutogen(outputFile, endpointsFiles, doc);