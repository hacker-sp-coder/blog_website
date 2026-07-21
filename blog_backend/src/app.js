import express from 'express'
import morgan from 'morgan'
import userRoute from './routers/user.route.js'
import cookieParser from "cookie-parser"
import blogRoute from "./routers/blog.route.js"
import reactionRoute from "./routers/reactions.route.js"
import commentRoute from "./routers/comments.route.js"


const app = express()

//tells Node.js application to automatically parse incoming JSON data in the request body.
app.use(express.json())

app.use(morgan('dev'))

app.use(cookieParser())

app.set('view engine', 'ejs');
 
//routers
app.use('/api/auth',userRoute) 
app.use('/api/blog',blogRoute)
app.use('/api/blog',reactionRoute)
app.use('/api/blog',commentRoute)
//app.use('/api/blog', )


export default app;