const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authorizeProduct = async (req, res, next) => {
    const { productId } = req.params;
    const userId = req.user.userId;
    const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } });

    if (product && product.userId === userId) {
        next();
    } else {
        res.status(403).json({ message: 'You are not authorized to modify this product' });
    }
};

const authorizeOrder = async (req, res, next) => {
    const { orderId } = req.params;
    const userId = req.user.userId;
    const order = await prisma.order.findUnique({ where: { id: parseInt(orderId) } });

    if (order && order.userId === userId) {
        next();
    } else {
        res.status(403).json({ message: 'You are not authorized to modify this order' });
    }
};

module.exports = { authorizeProduct, authorizeOrder };
