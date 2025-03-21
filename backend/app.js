import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import studentRoutes from "./routes/student.routes.js";
import teacherRouter from "./routes/teacher.routes.js"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())




app.use("/api/teacher", teacherRouter)
app.use("/api/student", studentRoutes);

// //routes declaration
// add API endpoints here
// For e.g.
// app.use("/api/v1/healthcheck", healthcheckRouter)
// // http://localhost:8000/api/v1/users/register

export { app }