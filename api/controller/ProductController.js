const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  ProductController: {
    create: async (req, res) => {
      const data = req.body.payload

      try {
        const payload = {
          name: data.name,
          color: data.color,
          price: data.price,
          release: data.release,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerAddress: data.customerAddress,
          remark: data.remark,
          serial: data.serial,
        }

        await prisma.product.create({
          data: payload
        })
        res.status(201).json({
          message: 'Product created successfully',
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({
          message: 'Error creating product',
          error: err.message,
        });
      }
    },

    getAll: async (req, res) => {
      try {
        // Fetch all
        const product = await prisma.product.findMany({
          orderBy: {
            id: 'desc'
          }
        })
        res.status(200).json(product)
      } catch (err) {
        res.status(500).json({
          message: 'Error fetching products',
          error: err.message,
        })
      }
    }
  }
}