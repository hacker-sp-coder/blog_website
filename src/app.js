import express from 'express'
import morgan from 'morgan'
import userRoute from './routers/user.route.js'
import cookieParser from "cookie-parser"
import blogRoute from "./routers/blog.route.js"

const app = express()

//tells Node.js application to automatically parse incoming JSON data in the request body.
app.use(express.json())

app.use(morgan('dev'))

app.use(cookieParser())

app.set('view engine', 'ejs');
 
//routers
app.use('/api/auth',userRoute) 
app.use('/api/blog',blogRoute)


export default app;