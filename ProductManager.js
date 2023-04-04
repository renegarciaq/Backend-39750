const { promises } = require('fs')

const fsP = promises

const products = []

class ProductManager {
  constructor(path) {
    this.product = products
    this.path = path
  }

  getProducts = async (limit) => {     // OK
    try {
      let data = await fsP.readFile(this.path, 'utf-8')
      const parseData = JSON.parse(data)
      return parseData
    }
    catch (error) {
      return []
    }
  }

  getProductById = async (pid) => {
    const contenido = await fsP.readFile(this.path, 'utf-8')
    let producto = JSON.parse(contenido)
    let productId = producto.find(prod => prod.id === pid);
    if (!producto) return 'Not Found';
    return productId;
  }

  // addProduct = async (newProduct) => {
  //   this.getProducts()
  //   try {
  //     if (
  //       !newProduct.title ||
  //       !newProduct.description ||
  //       !newProduct.price ||
  //       !newProduct.thumbnail ||
  //       !newProduct.code ||
  //       !newProduct.stock
  //     )
  //       return "todos los campos son necesarios";

  //     let codeProduct = this.product.find(prod => prod.code === newProduct.code);
  //     if (codeProduct) return "Un producto con este código ya fue ingresado";
  //     this.product.push({ id: this.product.lenght + 1, ...newProduct })
  //     await fs.promises.writeFile(this.path, JSON.stringify(this.product, 'utf-8', '\t'))
  //     return 'El producto ha sido cargado'
  //   }
  //   catch (error) {
  //     return (error)
  //   }
  // }


  // updateProduct = async (id, upProduct) => {
  //   try {
  //     let producto = this.product.find(prod => prod.id === id)
  //     if (!producto)
  //       return 'Not Found'
  //     producto.title = upProduct.title
  //     producto.description = upProduct.description
  //     producto.price = upProduct.price
  //     producto.thumbnail = upProduct.thumbnail
  //     producto.stock = upProduct.stock
  //     producto.code = upProduct.code
  //     await fs.promises.writeFile(this.path, JSON.stringify(this.product, 'utf-8', '\t'))
  //     return 'El producto ha sido actualizado'
  //   }
  //   catch (error) {
  //     return (error)
  //   }
  // }

  // deleteProduct = async (deleteId) => {
  //   try {
  //     const remove = this.product.filter(prod => prod.id !== deleteId)
  //     if (!remove)
  //       return 'Not Found'
  //     console.log(remove)
  //     await fs.promises.writeFile(this.path, JSON.stringify(remove, 'utf-8', '\t'))
  //     return 'El producto ha sido eliminado'
  //   }
  //   catch (error) {
  //     return (error)
  //   }
  // }
}

module.exports = ProductManager