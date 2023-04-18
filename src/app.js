
import express from 'express';
import productRouter from '../src/routers/products.router.js';
import routerCart from './routers/carts.router.js';
import handlebars from 'express-handlebars'
import __dirname from './utils/dirname.js';
import ProductManager from './managerDAOS/ProductManager.js';
//__________________________________________________________________________________

const pm = new ProductManager();

import {Server} from 'socket.io';
const app = express()

const httpServer = app.listen(8080, () => {

    console.log('Estoy escuchando el puerto 8080');
});

const socketServer = new Server(httpServer)

app.use('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts', {})
})

socketServer.on('connection', async socket => {
    console.log('Client connection');
    const data =  await pm.getProducts()

    socket.emit('products', {data, style: 'index.css'})

    socket.on('product', async data => {
        
        try{
            const {
            title,
            description,
            price,
            status,
            category,
            thumbnail,
            code,
            stock
        } = data
        console.log(data, 'evaluando stock');

        const valueReturned = await pm.addProduct(title, description, price, status,category, thumbnail, code, stock)
        console.log(valueReturned)
        }
        catch (err){
            console.log(err);
        }
        
})
})


app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars') 


app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use('/static',express.static('./src/public'));



app.use('/api/carts', routerCart)

app.use('/api/products', productRouter)
app.use('/', productRouter)


