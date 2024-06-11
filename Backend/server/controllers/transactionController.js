const axios = require('axios')
const Transaction = require('../models/Transaction')

const THIRD_PARTY_API_URL =  'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

//Initialize the database
exports.initialize = async(req, res) =>{
    try{
        const response = await axios.get(THIRD_PARTY_API_URL)
        const transactions = response.data;

        //clear existing data
        await Transaction.destroy({ where: {}, truncate: true})

        //insert new data
        await Transaction.bulkCreate(transactions)

        res.status(200).send("Database initialized successfully.")
    }catch(error){
        res.status(500).send("Error initializing database")
    }
};

// List all transactions with search and pagination
exports.listTransactions = async (req, res) => {
    try {
        const { month, search, page = 1, perPage = 10 } = req.query;
        const offset = (page - 1) * perPage;
        
        // Build query conditions based on month and search parameters
        const whereCondition = {
            dateOfSale: { [Op.between]: [`${month}-01`, `${month}-31`] }
        };
        if (search) {
            whereCondition[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } },
                { price: { [Op.eq]: parseFloat(search) } }
            ];
        }

        const transactions = await Transaction.findAndCountAll({
            where: whereCondition,
            limit: perPage,
            offset: offset
        });

        res.status(200).json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching transactions");
    }
};


// Get monthly statistics
exports.getStatistics = async (req, res) => {
    try {
        const { month } = req.query;
        
        const totalSaleAmount = await Transaction.sum('price', {
            where: { dateOfSale: { [Op.between]: [`${month}-01`, `${month}-31`] }, sold: true }
        });

        const totalSoldItems = await Transaction.count({
            where: { dateOfSale: { [Op.between]: [`${month}-01`, `${month}-31`] }, sold: true }
        });

        const totalNotSoldItems = await Transaction.count({
            where: { dateOfSale: { [Op.between]: [`${month}-01`, `${month}-31`] }, sold: false }
        });

        res.status(200).json({
            totalSaleAmount: totalSaleAmount || 0,
            totalSoldItems: totalSoldItems || 0,
            totalNotSoldItems: totalNotSoldItems || 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching statistics");
    }
};


// Get bar chart data
exports.getBarChartData = async (req, res) => {
    try {
        const { month } = req.query;
        
        const barChartData = await Transaction.findAll({
            attributes: [
                [Sequelize.literal('CASE WHEN price BETWEEN 0 AND 100 THEN "0 - 100" ' +
                    'WHEN price BETWEEN 101 AND 200 THEN "101 - 200" ' +
                    'WHEN price BETWEEN 201 AND 300 THEN "201 - 300" ' +
                    'WHEN price BETWEEN 301 AND 400 THEN "301 - 400" ' +
                    'WHEN price BETWEEN 401 AND 500 THEN "401 - 500" ' +
                    'WHEN price BETWEEN 501 AND 600 THEN "501 - 600" ' +
                    'WHEN price BETWEEN 601 AND 700 THEN "601 - 700" ' +
                    'WHEN price BETWEEN 701 AND 800 THEN "701 - 800" ' +
                    'WHEN price BETWEEN 801 AND 900 THEN "801 - 900" ' +
                    'ELSE "901-above" END'), 'priceRange'],
                [Sequelize.literal('COUNT(*)'), 'itemCount']
            ],
            where: { dateOfSale: { [Op.between]: [`${month}-01`, `${month}-31`] } },
            group: 'priceRange'
        });

        res.status(200).json(barChartData);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching bar chart data");
    }
};


// Get pie chart data
exports.getPieChartData = async (req, res) => {
    try {
        const { month } = req.query;
        
        const pieChartData = await Transaction.findAll({
            attributes: ['category', [Sequelize.literal('COUNT(*)'), 'itemCount']],
            where: { dateOfSale: { [Op.between]: [`${month}-01`, `${month}-31`] } },
            group: 'category'
        });

        res.status(200).json(pieChartData);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching pie chart data");
    }
};


// Get combined data
exports.getCombinedData = async (req, res) => {
    try {
        const { month } = req.query;

        // Fetch data from individual APIs
        const transactions = await fetchTransactions(month);
        const statistics = await fetchStatistics(month);
        const barChartData = await fetchBarChartData(month);
        const pieChartData = await fetchPieChartData(month);

        // Construct combined response
        const combinedData = {
            transactions: transactions,
            statistics: statistics,
            barChartData: barChartData,
            pieChartData: pieChartData
        };

        // Send combined response
        res.status(200).json(combinedData);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching combined data");
    }
};

// Fetch transactions data
const fetchTransactions = async (month) => {
    try {
        const response = await axios.get('http://localhost:5000/api/transactions', {
            params: { month: month }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return [];
    }
};

// Fetch statistics data
const fetchStatistics = async (month) => {
    try {
        const response = await axios.get('http://localhost:5000/api/statistics', {
            params: { month: month }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching statistics:", error);
        return {};
    }
};


// Fetch bar chart data
const fetchBarChartData = async (month) => {
    try {
        const response = await axios.get('http://localhost:5000/api/barchart', {
            params: { month: month }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching bar chart data:", error);
        return [];
    }
};


// Fetch pie chart data
const fetchPieChartData = async (month) => {
    try {
        const response = await axios.get('http://localhost:5000/api/piechart', {
            params: { month: month }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching pie chart data:", error);
        return [];
    }
};


