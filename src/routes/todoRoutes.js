import express from 'express'
import db from '../db.js'
import prisma from '../prismaClient.js';

const router = express.Router();

//pega todos os todos para usuarios logados
router.get('/', async (request, response) =>{
    const todos = await prisma.todo.findMany({
        where:{
            userId: request.userId
        }
    })  
    response.json(todos);
})

router.post('/', async(request,response)=>{
    const {task} = request.body;
    const todo = await prisma.todo.create({
        data:{
            task: defaultTodo,
            userId: request.userId
        }
    })
    response.status(201).json(todo);
})

router.put('/:id', async (request,response)=>{
    const {completed} = request.body;
    const {id} = request.params;

    const updatedTodo = await prisma.todo.update({
        where:{
            id: parseInt(id),
            userId: request.userId
        },
        data:{
            completed: !!completed
        }
    })
 
    response.status(200).json(updatedTodo);
})

router.delete('/:id', async (request,response)=>{
    const { id } = request.params;
    const userId = request.userId;

    await prisma.todo.delete({
        where:{
            id: parseInt(id),
            userId: userId
        }
    })
    
    response.status(200).json({ message: 'Todo deleted successfully' });
})

export default router
