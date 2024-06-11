import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import axiosInstance from '../utils/axiosInstance';

const PieChart = () => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        fetchPieChartData();
    }, []);

    const fetchPieChartData = async () => {
        try {
            const response = await axiosInstance.get('/piechart');
            const labels = response.data.map(item => (item.sold ? 'Sold' : 'Unsold'));
            const counts = response.data.map(item => item.count);

            setChartData({
                labels,
                datasets: [
                    {
                        data: counts,
                        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                    }
                ]
            });
        } catch (error) {
            console.error('Error fetching pie chart data:', error);
        }
    };

    return (
        <div>
            <h2>Pie Chart</h2>
            <Pie data={chartData} />
        </div>
    );
};

export default PieChart;
