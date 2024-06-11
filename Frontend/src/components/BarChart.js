import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axiosInstance from '../utils/axiosInstance';

const BarChart = () => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        fetchBarChartData();
    }, []);

    const fetchBarChartData = async () => {
        try {
            const response = await axiosInstance.get('/barchart');
            const categories = response.data.map(item => item.category);
            const counts = response.data.map(item => item.count);

            setChartData({
                labels: categories,
                datasets: [
                    {
                        label: 'Transactions by Category',
                        data: counts,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    }
                ]
            });
        } catch (error) {
            console.error('Error fetching bar chart data:', error);
        }
    };

    return (
        <div>
            <h2>Bar Chart</h2>
            <Bar data={chartData} />
        </div>
    );
};

export default BarChart;
