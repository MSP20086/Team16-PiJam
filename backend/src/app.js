import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import studentRoutes from "./routes/student.routes.js";
import teacherRouter from "./routes/teacher.routes.js"
import userRouter from "./routes/user.routes.js"

const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())



app.use("/api/user", userRouter)
app.use("/api/teacher", teacherRouter)
app.use("/api/student", studentRoutes);

// //routes declaration
// add API endpoints here
// For e.g.
// app.use("/api/v1/healthcheck", healthcheckRouter)
// // http://localhost:8000/api/v1/users/register

export { app }