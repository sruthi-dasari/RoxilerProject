const {Sequelize, Datatypes} = require('sequelize')
const sequelize = require('./database')

const Transaction = sequelize.define('Transaction', {
    title: {
        type: Datatypes.STRING,
        allowNull: false
    },
    description: {
        type: Datatypes.STRING,
        allowNull: false
    },
    price: {
        type: Datatypes.FLOAT,
        allowNull: false
    },
    dateOfSale: {
        type: Datatypes.DATE,
        allowNull: false
    },
    sold: {
        type: Datatypes.BOOLEAN,
        allowNull: false
    },
    category: {
        type: Datatypes.STRING,
        allowNull: false
    }

})

module.exports=Transaction;