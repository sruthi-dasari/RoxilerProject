const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./database');

const Transaction = sequelize.define('Transaction', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    dateOfSale: {
        type: DataTypes.DATE,
        allowNull: false
    },
    sold: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Transaction;
