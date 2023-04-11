import fs from 'fs';

class CartManager {
    constructor() {
        this.carts = [];
        this.path = './managerDAOS/carts.json';
    }

    addCart = async (newCart) => {
        try {

            const carts = await this.getCarts();
     
            this.carts = carts


        
            if (this.carts.length === 0) {
                newCart.id = 1
            } else {
                newCart.id = this.carts[this.carts.length - 1].id + 1
            }

            if (Object.values(newCart).every(value => value)) {
                this.carts.push(newCart);
                const toJSON = JSON.stringify(this.carts, null, 2);
                await fs.promises.writeFile(this.path, toJSON)
            }

            return [];
        }
        catch (error) {
            console.log(error);
        }

    }

    getCarts = async () => {
        try {
            const getFileCarts = await fs.promises.readFile(this.path, 'utf-8')
            if (getFileCarts.length === 0) return [];
            return JSON.parse(getFileCarts)
        } catch (error) {
            console.log(error);
            return { status: "error", error: error }
        }
    };

    getCartById = async (id) => {
        try {
            const getFileCarts = await fs.promises.readFile(this.path, 'utf-8')
            const parseCarts = JSON.parse(getFileCarts);
            // console.log(parseCarts[id - 1]);
            if (!parseCarts[id - 1]) return { error: 'Error! El carrito No existe' }

            return parseCarts[id - 1]
        }
        catch (error) {
            console.log(error);
        }
    }

    updateCart = async (cid, data) => {
        try {
            const getFileCarts = await fs.promises.readFile(this.path, 'utf-8')
            const parseCarts = JSON.parse(getFileCarts);
         
            if (isNaN(Number(pid))) return { status: "error", message: 'No es un id válido' };

            const findId = parseCarts.findIndex(product => product.id == cid)
            if (findId === -1) return { status: "error", message: 'No se encontró el id' };

            this.carts = parseCarts.map(cart => {
                if (cart.id === cid) {
                    cart = Object.assign(cart, data)
                }
                return cart
            })

            const toJSON = JSON.stringify(this.carts, null, 2);
            await fs.promises.writeFile(this.path, toJSON)
            return returnedTarget
        }
        catch (error) {
            console.log(error);
        }

    }
}


export default CartManager
