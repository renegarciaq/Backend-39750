import { Router } from "express";
import ProductManager from "../managerDAOS/ProductManager.js";
import uploader from "../utils/multer.utils.js";

const router = Router();
const pm = new ProductManager();


// GET
router.get('/home', async (req, res) => {

    try {
        const valueReturned = await pm.getProducts()
        if (valueReturned.error) return res.status(200).send({ status: 'Sin productos', valueReturned })

        console.log(valueReturned);
   
        res.render('home',  {valueReturned} )
    }
    catch (err) {
        res.status(400).send({ status: 'error router', err })
    }

})

router.get('/', async (req, res) => {
  
    const { limit } = req.query
    try {
        const valueReturned = await pm.getProducts()
        if (valueReturned.error) return res.status(200).send({ status: 'Sin productos', valueReturned })
        const limitProduts = valueReturned.slice(0, limit)
        res.status(200).send({ status: 'Productos', limitProduts })
   
    }
    catch (error) {
        res.status(400).send({ status: 'error router', error })
    }

})

router.get('/:pid', async (req, res) => {
    try {
   
        console.log(req.params.pid);

        const product = await pm.getProductById(req.params.pid)
        res.status(200).send({product})
    }
    catch (err) {
        console.log(err);
    }

})

// POST

router.post('/', async (req, res) => {
    try {
    
        const productSend = req.body


        const campoVacio = Object.values(productSend).find(value => value === '')
        console.log(campoVacio);
        if (campoVacio) {
            return res.status(400).send({ status: "error", message: "Falta completar algún campo" })
        }

        const {
            title,
            description,
            price,
            status,
            category,
            thumbnail,
            code,
            stock
        } = productSend

        console.log(productSend, 'productSend');


        const valueReturned = await pm.addProduct(title, description, price, status, category, thumbnail, code, stock)
        console.log(valueReturned)

        if (valueReturned.status === 'error') return res.status(400).send({ valueReturned })
        res.status(200).send({ productSend })
    }
    catch (err) {
        console.log(err);
    }

});


router.post('/formulario', uploader.single('thumbnail'), async (req, res) => {
    try {
        let productSend = req.body
        console.log(productSend);

        try {
            productSend.thumbnail = req.file.path
        }
        catch {
            productSend.thumbnail = 'empty'
        }

        
        (Object.hasOwn(productSend,'status'))?productSend['status'] = 'true':productSend['status'] = 'false';
            

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


        const campoVacio = Object.values(productSend).find(value => value === '')
        if (campoVacio) {
            return res.status(400).send({ status: "error", message: "Falta completar algún campo" })
        }

        const valueReturned = await pm.addProduct(title, description, price, status,category, thumbnail, code, stock)
        console.log(valueReturned)

        res.send(200)
    }
    catch (err) {
        console.log(err);
    }

})

// PUT

router.put('/:pid', async (req, res) => {
    try {

        const { pid } = req.params
        const productUpdate = req.body

        const updateProduct = await pm.updateProduct(pid, productUpdate)
        if (!updateProduct.error) return res.status(400).send({ updateProduct })
        res.send({ updateProduct })
    }
    catch (err) {
        console.log(err);
    }

});

// DELETE

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const response = await pm.deleteProduct(pid)
        console.log(response)
        if (!response.error) return res.status(400).send({ response })
        res.status(200).send({ response })
    }
    catch (err) {
        console.log(err);
    }

});



export default router