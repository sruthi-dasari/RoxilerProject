const axios = require('axios');
const Transaction = require('../models/Transaction');

const THIRD_PARTY_API_URL = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

// Initialize the database
exports.initialize = async (req, res) => {
    try {
        const response = await axios.get(THIRD_PARTY_API_URL);
        const transactions = response.data;

        // Clear existing data
        await Transaction.destroy({ where: {}, truncate: true });

        // Insert new data
        await Transaction.bulkCreate(transactions);

        res.status(200).send('Database initialized successfully.');
    } catch (error) {
        res.status(500).send('Error initializing database');
    }
};

// List all transactions with search and pagination
exports.listTransactions = async (req, res) => {
    try {
        const { page = 1, search = '', month } = req.query;
        const limit = 10;
        const offset = (page - 1) * limit;

        const whereClause = {
            [Sequelize.Op.or]: [
                { title: { [Sequelize.Op.like]: `%${search}%` } },
                { description: { [Sequelize.Op.like]: `%${search}%` } },
            ]
        };

        if (month) {
            const startDate = new Date(`2023-${month}-01`);
            const endDate = new Date(startDate);
            endDate.setMonth(startDate.getMonth() + 1);

            whereClause.dateOfSale = {
                [Sequelize.Op.between]: [startDate, endDate]
            };
        }

        const transactions = await Transaction.findAndCountAll({
            where: whereClause,
            limit,
            offset
        });

        res.status(200).json({
            total: transactions.count,
            pages: Math.ceil(transactions.count / limit),
            data: transactions.rows
        });
    } catch (error) {
        res.status(500).send('Error fetching transactions');
    }
};


// Get monthly statistics
exports.getStatistics = async (req, res) => {
    try {
        const { month } = req.query;

        const startDate = new Date(`2023-${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);

        const totalTransactions = await Transaction.count({
            where: {
                dateOfSale: {
                    [Sequelize.Op.between]: [startDate, endDate]
                }
            }
        });

        const totalRevenue = await Transaction.sum('price', {
            where: {
                dateOfSale: {
                    [Sequelize.Op.between]: [startDate, endDate]
                }
            }
        });

        res.status(200).json({
            totalTransactions,
            totalRevenue
        });
    } catch (error) {
        res.status(500).send('Error fetching statistics');
    }
};


// Get bar chart data
exports.getBarChartData = async (req, res) => {
    try {
        const barChartData = await Transaction.findAll({
            attributes: [
                'category',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
            ],
            group: ['category']
        });

        res.status(200).json(barChartData);
    } catch (error) {
        res.status(500).send('Error fetching bar chart data');
    }
};


// Get pie chart data
exports.getPieChartData = async (req, res) => {
    try {
        const pieChartData = await Transaction.findAll({
            attributes: [
                'sold',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
            ],
            group: ['sold']
        });

        res.status(200).json(pieChartData);
    } catch (error) {
        res.status(500).send('Error fetching pie chart data');
    }
};


// Get combined data
exports.getCombinedData = async (req, res) => {
    try {
        const totalTransactions = await Transaction.count();
        const totalRevenue = await Transaction.sum('price');

        const barChartData = await Transaction.findAll({
            attributes: [
                'category',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
            ],
            group: ['category']
        });

        const pieChartData = await Transaction.findAll({
            attributes: [
                'sold',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
            ],
            group: ['sold']
        });

        res.status(200).json({
            totalTransactions,
            totalRevenue,
            barChartData,
            pieChartData
        });
    } catch (error) {
        res.status(500).send('Error fetching combined data');
    }
};

