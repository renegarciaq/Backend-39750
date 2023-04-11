import express from 'express';
import productRouter from './routers/products.router.js';

import routerCart from './routers/carts.router.js'; 

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static('./src/public'));

app.use('/api/carts', routerCart);

app.use('/api/productos', productRouter);

app.listen(8080, () => {
  console.log('Corriendo en el puerto 8080')
})