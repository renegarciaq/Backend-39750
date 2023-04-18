import fs from 'fs';

class CartManager {
    constructor() {
        this.carts = [];
        this.path = './src/managerDAOS/carts.json';
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
        catch (err) {
            console.log(err);
        }

    }

    getCarts = async () => {
        try {
            const getFileCarts = await fs.promises.readFile(this.path, 'utf-8')
            if (getFileCarts.length === 0) return [];
            return JSON.parse(getFileCarts)
        } catch (err) {
            console.log(err);
            return { status: "error", error: err }
        }
    };

    getCartById = async (id) => {
        try {
            const getFileCarts = await fs.promises.readFile(this.path, 'utf-8')
            const parseCarts = JSON.parse(getFileCarts);
      
            if (!parseCarts[id - 1]) return { error: 'Error! El carrito No existe' }

            return parseCarts[id - 1]
        }
        catch (err) {
            console.log(err);
        }
    }

    updateCart = async (pid, data) => {
        try {
            const getFileCarts = await fs.promises.readFile(this.path, 'utf-8')
            const parseCarts = JSON.parse(getFileCarts);
    
            if (isNaN(Number(pid))) return { status: "error", message: 'No es un id válido' };

            const findId = parseCarts.findIndex(product => product.id == pid)
            if (findId === -1) return { status: "error", message: 'No se encontró el id' };

            const returnedTarget = Object.assign(parseCarts[pid - 1], data);

            parseCarts[pid - 1] = returnedTarget;

            this.carts = parseCarts
            const toJSON = JSON.stringify(this.carts, null, 2);
            await fs.promises.writeFile(this.path, toJSON)
            return returnedTarget
        }
        catch (err) {
            console.log(err);
        }

    }
}


export default CartManager
