const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');
const {authorizeProduct} = require('../middleware/checkOwnership');

router.post('/', auth, async (req, res, next) => {
    try {
        const { name, price } = req.body;
        const product = await prisma.product.create({
            data: { name, price, userId: req.user.userId }
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res, next) => {
    try {
        const products = await prisma.product.findMany();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:productId', async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await prisma.product.findUnique({
            where: { id: parseInt(productId) }
        });
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:productId', auth,authorizeProduct, async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { name, price } = req.body;
        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(productId) },
            data: { name, price }
        });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:productId', auth, authorizeProduct, async (req, res, next) => {
    try {
        const { productId } = req.params;
        await prisma.product.delete({
            where: { id: parseInt(productId) }
        });
        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
