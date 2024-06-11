import React from 'react';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

const App = () => {
    return (
        <div>
            <h1>Transactions Dashboard</h1>
            <TransactionsTable />
            <Statistics />
            <BarChart />
            <PieChart />
        </div>
    );
};

export default App;
