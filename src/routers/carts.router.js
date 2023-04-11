import { Router } from "express";
import CartManager from "../managerDAOS/cartsManager.js";


const routerCart = Router();
const carts = new CartManager


routerCart.get('/:cid', async (req, res) => {
    const { cid } = req.params
    try {
        const valueReturned = await carts.getCartById(cid)
        if (valueReturned.error) return res.status(200).send({ status: 'Sin carritos', valueReturned })

        res.status(200).send({ status: 'Carrito', valueReturned })
    }
    catch (error) {
        res.status(400).send({ status: 'error router', error })
    }

});

routerCart.post('/', async (req, res) => {
    try {
        const cart = req.body
        console.log(cart)
        const campoVacio = Object.values(cart).find(value => value === '')
        console.log(campoVacio);
        if (campoVacio) {
            return res.status(400).send({ status: "error", message: "Falta completar algún campo" })
        }

        if (cart.status === 'error') return res.status(400).send({ valueReturned })
        await carts.addCart(cart)
        res.status(200).send({ cart })
    }
    catch (error) {
        console.log(error);
    }

});

routerCart.post('/:cid/product/:pid', async (req, res) => {
    try {   
        let { producto } = req.body
        const { cid, pid } = req.params

        producto['idProduct'] = Number(pid)

        const carrito = await carts.getCartById(cid)
        if (carrito.error) return res.status(400).send({ carrito })

        let productoEncontrado = carrito.productos.findIndex(productos => productos.idProduct == pid)

        if (productoEncontrado !== -1) {
            carrito.productos[productoEncontrado].cantidad = Number(carrito.productos[productoEncontrado].cantidad) + Number(producto.cantidad)
            console.log(carrito.productos);
            await carts.updateCart(cid, carrito)
            return res.status(200).send({ statusbar: 'success', message: 'producto agregado'});
        }
        console.log(producto);
        carrito.productos.push(producto)
        console.log(carrito.productos);
        await carts.updateCart(cid, carrito)
        res.status(200).send({status: 'success', message: 'producto agregado', carrito: carrito.productos})
    } catch (error) {
        return res.status(400).send({ status: "error", message: 'error de parametros' })
    }

})

export default routerCart