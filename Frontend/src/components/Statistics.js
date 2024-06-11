import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const Statistics = () => {
    const [statistics, setStatistics] = useState({ totalTransactions: 0, totalRevenue: 0 });

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            const response = await axiosInstance.get('/statistics', {
                params: { month: 'March' } // You can make this dynamic if needed
            });
            setStatistics(response.data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    return (
        <div>
            <h2>Statistics</h2>
            <p>Total Transactions: {statistics.totalTransactions}</p>
            <p>Total Revenue: ${statistics.totalRevenue.toFixed(2)}</p>
        </div>
    );
};

export default Statistics;
