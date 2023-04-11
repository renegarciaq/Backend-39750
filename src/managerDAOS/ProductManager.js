import fs from 'fs';

class ProductManager {
  constructor() {
    this.products = [];
    this.path = './managerDAOS/DB.json';
  }


  __appendProduct = async () => {

    const toJSON = JSON.stringify(this.products, null, 2);
    await fs.promises.writeFile(this.path, toJSON)
  };

  addProduct = async (title, description, price, status, category, thumbnail, code, stock) => {
    const productsFS = await this.getProducts();

    this.products = productsFS

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
      return { status: "error", message: 'El código ya existe' }
    }

    if (this.products.length === 0) {
      product.id = 1
    } else {
      product.id = this.products[this.products.length - 1].id + 1
    }


    if (Object.values(product).every(value => value)) {
      (product.status === 'false') ? product.status = false : product.status = true;
      console.log(product.price, 'precio');
      product.price = Number(product.price)
      product.stock = Number(product.stock)
      product.thumbnail = [product.thumbnail]
      this.products.push(product);
      this.__appendProduct()
      return { status: "succes", message: 'Producto agregado', producto: product };

    }
    return { status: "error", message: 'Todos los campos son obligatorios' };

  }

  getProducts = async () => {
    try {
      const getFileProducts = await fs.promises.readFile(this.path, 'utf-8')
      if (getFileProducts.length === 0) return [];
      return JSON.parse(getFileProducts)
    } catch (error) {
      console.log(error);
      return { status: "error", error: error }
    }

  }

  getProductById = async (id) => {
    try {
      const getFileProducts = await fs.promises.readFile(this.path, 'utf-8')
      const parseProducts = JSON.parse(getFileProducts);
      console.log(parseProducts[id - 1]);
      if (!parseProducts[id - 1]) return 'No se encontró el id'

      return parseProducts[id - 1]
    }
    catch (error) {
      console.log(error);
    }
  }



  updateProduct = async (pid, data) => {
    const getFileProducts = await fs.promises.readFile(this.path, 'utf-8')
    const parseProducts = JSON.parse(getFileProducts);

    if (isNaN(Number(pid))) return { status: "error", message: 'No es un id válido' };

    const findId = parseProducts.findIndex(product => product.id == pid)
    if (findId === -1) return { status: "error", message: 'No se encontró el id' };

    this.products = parseProducts.map(product => {
      if (product.id == pid) {
        product = Object.assign(product, data)
        return product
      }
      return product
    })

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
