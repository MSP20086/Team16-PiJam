import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const ScoreDistributionChart = ({ scoreDistributionData }) => {
  const chartData = scoreDistributionData 
    ? Object.entries(scoreDistributionData).map(([range, count]) => ({
        range, 
        count
      }))
    : [];

  if (!scoreDistributionData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No score distribution data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart 
        data={chartData} 
        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="range" 
          angle={-30} 
          textAnchor="middle" 
          interval={0} 
          height={80} 
          dy={10} 
        />
        <YAxis 
          label={{ 
            value: 'Number of Submissions', 
            angle: -90, 
            position: 'insideLeft' 
          }} 
        />
        <Tooltip 
          formatter={(value) => [
            value, 
            'Submissions'
          ]} 
        />
        <Legend />
        <Bar 
          dataKey="count" 
          fill="#8884d8" 
          name="Submissions" 
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ScoreDistributionChart;
