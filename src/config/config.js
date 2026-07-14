import dotenv from 'dotenv'

dotenv.config()

if(!process.env.MONGO_URI) {
    console.log('MONGO_URI is not define in .env');
}
if(!process.env.JWT_SECRET) {
    console.log('JWT_SECRET is not define in .env');
    
}
const config = {
    MONGO_URI : process.env.MONGO_URI,
    JWT_SECRET : process.env.JWT_SECRET
}

export default config