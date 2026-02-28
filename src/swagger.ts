import swaggerJSDoc from "swagger-jsdoc";
import { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "YUGI API",
      version: "1.0.0",
      description: "API documentation for Products service",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // quét comment swagger trong routes
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;