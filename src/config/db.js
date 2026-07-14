import mongoose from 'mongoose'
import config from './config.js'

const db_connection = async () => {
    await mongoose.connect(config.MONGO_URI);
    console.log('Database connected');
}

export default db_connection;