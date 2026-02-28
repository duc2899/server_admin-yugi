import express from "express";
import { connectDB } from "./config/db";
import { setupSecurity } from "./config/security";
import { ENV } from "./config/env";
import errorHandler from "./middlewares/errorHandeler";
import initRouter from "./routes/index";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";



const app = express();


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// setup middleware security
setupSecurity(app);

// connect mongo
connectDB();

// setup routes
app.use("/api/v1", initRouter);

// setup error handler
app.use(errorHandler);

app.listen(ENV.PORT, () => {
    console.log(`🚀 Server running on port ${ENV.PORT}`);
});
