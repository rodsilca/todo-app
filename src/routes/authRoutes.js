import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router();

router.post('/register', (req, res) => {
    const { username, password } = req.body;
    // save gilgamesh@gmail.com | aklsdjfasdf.asdf..qwe..q.we...qwe.qw.easd

    const hashedPassword = bcrypt.hashSync(password, 8);

    // salvar o user e senha no db
    try {
        const insertUser = db.prepare(`INSERT INTO users (username, password) VALUES (?, ?)`);
        const result = insertUser.run(username, hashedPassword);

        const defaultTodo = `Hello :) Add your first todo!`;
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`);
        insertTodo.run(result.lastInsertRowid, defaultTodo);

        // criando o token
        const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } catch (err) {
        console.log("ta dando erro aqui");
        res.sendStatus(503);
    }
})

router.post('/login', (req, res) => {
    // nós pegamos o email deles, e procuramos a senha associada com esse email no banco de dados
// mas quando a recebemos de volta, vemos que ela está criptografada, o que significa que não podemos compará-la com a que o usuário acabou de usar tentando fazer login
// então o que podemos fazer é, novamente, criptografar de forma unidirecional a senha que o usuário acabou de inserir


    const { username, password } = req.body;

    try {
        const getUser = db.prepare('SELECT * FROM users WHERE username = ?');
        const user = getUser.get(username);

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


export default router
