import { Router } from "express";
import ProductManager from "../managerDAOS/ProductManager.js";
import uploader from "../utils/multer.utils.js";

const router = Router();
const productManager = new ProductManager();

// GET

router.get('/', async (req, res) => {
    const { limit } = req.query;
    try {
        const products = await productManager.getProducts();
        if (products.error) return res.status(200).send({ status: 'Sin productos', products });
        const limitProducts = products.slice(0, limit);
        res.status(200).send({ status: 'Productos', limitProducts });
    } catch (error) {
        res.status(400).send({ status: 'Error', error });
    }
})

router.get('/:pid', async (req, res) => {
    try {
        console.log(req.params.pid)

        const product = await productManager.getProductById(req.params.pid);
        res.status(200).send({ status: 'Producto', product });
    }
    catch (error) {
        res.status(400).send({ status: 'Error', error });
    }
})

// POST

router.post('/', async (req, res) => {
    try {
        const productSend = req.body

        const campoVacio = Object.values(productSend).find((value) => value === '');
        console.log(campoVacio)
        if (campoVacio) {
            return res.status(400).send({ status: 'Error', error: 'Todos los campos son obligatorios' });
        }

        const {
            title,
            description,
            price,
            status,
            thumbnail,
            code,
            stock
        } = productSend

        const products = await ProductManager.addProduct(title, description, price, status, thumbnail, code, stock);
        console.log(products)

        if (products.status === 'Error')
            return res.status(400).send({ products });
        res.status(200).send({ productSend });
    }
    catch (error) {
        console.log(error)
    }
})



router.post('/formulario', uploader.single('thumbnail'), async (req, res) => {
    try {
        let productSend = req.body;

        try {
            productSend.thumbnail = req.file.path;
        }
        catch {
            productSend.thumbnail = 'empty';
        }

        (Object.hasOwn(productSend, 'status')) ? productSend['status'] = 'true' : productSend['status'] = 'false';

        let {
            title,
            description,
            price,
            status,
            category,
            thumbnail,
            code,
            stock
        } = productSend

        const campoVacio = Object.values(productSend).find((value) => value === '');
        if (campoVacio) {
            return res.status(400).send({ status: 'Error', error: 'Todos los campos son obligatorios' });
        }
        const products = await productManager.addProduct(title, description, price, status, category, thumbnail, code, stock);
        console.log(products)
        res.send(res.redirect("http://localhost:8080/static"))
    }
    catch (error) {
        console.log(error)
    }
})

// PUT

router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const productUpdate = req.body;

        const updateProduct = await productManager.updateProduct(pid, productUpdate);
        if (!updateProduct.error)
            return res.status(400).send({ updateProduct })
        res.send({ updateProduct });
    }
    catch (error) {
        console.log(error)
    }
})

// DELETE

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const deleteProduct = await productManager.deleteProduct(pid);
        if (!deleteProduct.error)
            return res.status(400).send({ deleteProduct })
        res.send({ deleteProduct });
    }
    catch (error) {
        console.log(error)
    }
})

export default router;