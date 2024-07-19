const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');
const {authorizeOrder} = require('../middleware/checkOwnership');

router.post('/', auth, async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const order = await prisma.order.create({
            data: { productId, quantity, userId: req.user.userId }
        });
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res, next) => {
    try {
        const orders = await prisma.order.findMany({
            include: { product: true }
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:orderId', async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const order = await prisma.order.findUnique({
            where: { id: parseInt(orderId) },
            include: { product: true }
        });
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/:orderId', auth, authorizeOrder, async (req, res, next) => {
    try {
        const { orderId } = req.params;
        await prisma.order.delete({
            where: { id: parseInt(orderId) }
        });
        res.status(200).json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
