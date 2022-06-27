import React from 'react';
import {Bar} from 'react-chartjs-2';

export default function Chart({chartData}) {
    
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Download Statistics',
      },
    },
  }
  return (
    <Bar 
        data={chartData} 
        options={chartOptions}
    />
  )
}
