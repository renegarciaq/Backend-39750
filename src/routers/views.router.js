import { Router } from "express";

const usersRouter = Router();

usersRouter.get('/vista', (req, res) => {

    let testUser = {
        name: 'Luis'
    }

    res.render('index', testUser)
})


usersRouter.get('/', async (req, res) => {

    const datos = await getUsers()
    const index = Math.floor(Math.random() * (datos.length))
    console.log(datos);
    const user = {
        name: datos[index].name,
        isAdmin: datos[index].role === 'admin'
    }
    console.log(user);
    res.render('users', {
        user,
        datos,
        style: 'index.css'
    })
})

usersRouter.get('/register', (req, res) => {

    res.render('form', {
        style: 'index.css'
    })
})

usersRouter.post('/register', (req, res) => {
    const  user  = req.body
    console.log(user);
    res.send({user, status: 'success'})
})

export default usersRouter