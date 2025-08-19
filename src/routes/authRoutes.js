import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    // save gilgamesh@gmail.com | aklsdjfasdf.asdf..qwe..q.we...qwe.qw.easd

    const hashedPassword = bcrypt.hashSync(password, 8);

    // salvar o user e senha no db
    try {
        //agora que o banco de dados é thirdparty e nao local, tem que colocar await pq a comunicacao do db e o codigo e assincrono
        const user = await prisma.user.create({
            data:{
                username: username,
                password: hashedPassword
            }
        })

        const defaultTodo = `Hello :) Add your first todo!`;
        const todo = await prisma.todo.create({
            data:{
                task: defaultTodo,
                userId: user.id
            }
        })

        // criando o token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } catch (err) {
        console.log("ta dando erro aqui");
        res.sendStatus(503);
    }
})

router.post('/login', async (req, res) => {
    // nós pegamos o email deles, e procuramos a senha associada com esse email no banco de dados
// mas quando a recebemos de volta, vemos que ela está criptografada, o que significa que não podemos compará-la com a que o usuário acabou de usar tentando fazer login
// então o que podemos fazer é, novamente, criptografar de forma unidirecional a senha que o usuário acabou de inserir


    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username 
            }
        })

        if (!user) { return res.status(404).send({ message: "User not found" }) }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) { return res.status(401).send({ message: "Invalid password" }) }
        console.log(user);

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token });
    } catch (err) {
        console.log(err.message);
        res.sendStatus(503);
    }

})

//so pode ter 1 export default por arquivo e vc pode renomear ele no arquivo que importa
export default router
