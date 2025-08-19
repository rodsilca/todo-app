import express from 'express'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import authMiddleware from './middleware/authMiddleware.js';

const app = express();
const PORT = process.env.PORT || 3332;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')))

app.get('/', (request,response) =>{
    response.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.use('/auth', authRoutes);
app.use('/todos', authMiddleware, todoRoutes);

app.listen(PORT, ()=>{
    console.log("Server has started on port: "+ PORT);
})