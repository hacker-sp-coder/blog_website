import { log } from 'node:console';
import app from './src/app.js'
import db_connection from './src/config/db.js';

const PORT = process.env.PORT || 8000;

db_connection()

app.listen(PORT, () =>{
    console.log('server listening at http://localhost:8000');
    
})