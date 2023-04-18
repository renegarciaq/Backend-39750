import fs from 'fs';

class ProductManager {

    constructor() {
        this.products = [];
        this.path = './src/DAOSmanager/productos.json';
    }


    __appendProduct = async () => {

        const toJSON = JSON.stringify(this.products, null, 2);
        await fs.promises.writeFile(this.path, toJSON)
    };

    addProduct = async (title, description, price, status,category, thumbnail, code, stock) => {
        const productsFS = await this.getProducts();
    
        this.products = productsFS

        console.log(stock, 'undefinerasdas');
        const product = {
            title,
            description,
            price,
            status,
            category,
            thumbnail,
            code,
            stock
        }
  
        const validarCodigo = this.products.find(productos => productos.code === product.code)
        if (validarCodigo) {
            return { status: "error", message: 'El producto no se pudo agregar porque el codigo es repetido' }
        }

        if (this.products.length === 0) {
            product.id = 1
        } else {
            product.id = this.products[this.products.length - 1].id + 1
        }

        console.log(product, 'MP');
        if (Object.values(product).every(value => value)) {
            (product.status === 'false')? product.status = false : product.status = true;
            console.log(product.price, 'precio');
            product.price = Number(product.price)
            product.stock = Number(product.stock)
            product.thumbnail = [product.thumbnail]
            this.products.push(product);
            this.__appendProduct()
            return { status: "succes", message: 'El producto se registró', producto: product };

        }
        return { status: "error", message: 'Todos los campos son obligatorios' };

    }

    getProducts = async () => {
        try {
            const getFileProducts = await fs.promises.readFile(this.path, 'utf-8')
            if (getFileProducts.length === 0) return [];
            return JSON.parse(getFileProducts)
        } catch (err) {
            console.log(err);
            return { status: "error", error: err }
        }

    }

    getProductById = async (id) => {
        try {
            const getFileProducts = await fs.promises.readFile(this.path, 'utf-8')
            const parseProducst = JSON.parse(getFileProducts);
            console.log(parseProducst[id - 1]);
            if (!parseProducst[id - 1]) return 'Error! No existe'

            return parseProducst[id - 1]
        }
        catch (err) {
            console.log(err);
        }
    }



    updateProduct = async (pid, data) => {
        const getFileProducts = await fs.promises.readFile(this.path, 'utf-8')
        const parseProducts = JSON.parse(getFileProducts);
        // console.log(parseProducts);
        if (isNaN(Number(pid))) return { status: "error", message: 'No es un id válido' };

        const findId = parseProducts.findIndex(product => product.id == pid)
        if (findId === -1) return { status: "error", message: 'No se encontró el id' };

        const returnedTarget = Object.assign(parseProducts[pid - 1], data);

        parseProducts[pid - 1] = returnedTarget;

        this.products = parseProducts
        this.__appendProduct()
        return returnedTarget

    }

    deleteProduct = async (pid) => {
        const getFileProducts = await fs.promises.readFile(this.path, 'utf-8')
        const parseProducts = JSON.parse(getFileProducts);
        if (isNaN(Number(pid))) return { status: "error", message: 'No es un id válido' };

        const findId = parseProducts.findIndex(product => product.id == pid)
        if (findId === -1) return { status: "error", message: 'No se encontró el id' };

        const filtro = parseProducts.filter(product => product.id !== pid)
        this.products = filtro;
        this.__appendProduct();
        return { status: "success", message: `se eliminó el producto con id ${pid}` }
    }
};

export default ProductManager