const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  CompanyController: {
    create: async (req, res) => {
      try {
        const payload = {
          name: req.body.name,
          address: req.body.address,
          phone: req.body.phone,
          email: req.body.email ?? '',
          taxCode: req.body.taxCode
        }

        const existingCompany = await prisma.company.findFirst()

        if (existingCompany) {
          await prisma.company.update({
            where: {
              id: existingCompany.id
            },
            data: payload
          })
          return res.status(200).json({
            message: 'Company updated successfully',
          });
        }

        await prisma.company.create({
          data: payload
        })
        res.status(201).json({
          message: 'Company created successfully',
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({
          message: 'Error creating company',
          error: err.message,
        });
      }
    },
    
    getAll: async (req, res) => {
      try {
        // Fetch all
        const company = await prisma.company.findFirst()
        res.status(200).json(company)
      } catch (err) {
        res.status(500).json({
          message: 'Error fetching companies',
          error: err.message,
        })
      }
    }
  }
}