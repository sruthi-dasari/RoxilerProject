import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

const App = () => {
    const [combinedData, setCombinedData] = useState(null);

    useEffect(() => {
        fetchCombinedData();
    }, []);

    const fetchCombinedData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/combine');
            setCombinedData(response.data);
        } catch (error) {
            console.error('Error fetching combined data:', error);
        }
    };

    return (
        <div>
            <h1>Transactions Dashboard</h1>
            {combinedData && (
                <>
                    <TransactionsTable transactions={combinedData.transactions} />
                    <Statistics statistics={combinedData.statistics} />
                    <BarChart barChartData={combinedData.barChartData} />
                    <PieChart pieChartData={combinedData.pieChartData} />
                </>
            )}
        </div>
    );
};

export default App;
