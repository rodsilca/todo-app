import express from 'express'
import db from '../db.js'

const router = express.Router();

//pega todos os todos para usuarios logados
router.get('/', (request, response) =>{
    const getTodos = db.prepare('SELECT * FROM todos WHERE user_id = ?');
    const todos = getTodos.all(request.userId);
    response.json(todos);
})

router.post('/', (request,response)=>{
    const {task} = request.body;
    const insertTodo = db.prepare('INSERT INTO todos (user_id, task) VALUES (?, ?)');

    const result = insertTodo.run(request.userId, task);
    response.status(201).json({ id: result.lastInsertRowid, task, completed: 0 });
})

router.put('/:id',(request,response)=>{
    const {completed} = request.body;
    const {id} = request.params;

    const updateTodo = db.prepare('UPDATE todos SET completed = ? WHERE id = ?');
    updateTodo.run(completed, id);
 
    response.status(200).json({ message: 'Todo updated successfully' });
})

router.delete('/:id',(request,response)=>{
    const { id } = request.params;
    const userId = request.userId;

    const deleteTodo = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?');
    deleteTodo.run(id, userId);
    response.status(200).json({ message: 'Todo deleted successfully' });
})

export default router
