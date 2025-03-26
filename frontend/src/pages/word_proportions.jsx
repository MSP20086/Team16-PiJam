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

const WordProportionsChart = ({ wordProportionsData }) => {
  const chartData = wordProportionsData 
    ? Object.entries(wordProportionsData).map(([word, proportion]) => ({
        word, 
        proportion
      })).sort((a, b) => b.proportion - a.proportion) 
    : [];

  if (!wordProportionsData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No word proportions data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart 
        data={chartData} 
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="word" 
          angle={-45} 
          textAnchor="end" 
          interval={0} 
          height={100} 
        />
        <YAxis 
          label={{ 
            value: 'Word Proportion', 
            angle: -90, 
            position: 'insideLeft' 
          }} 
        />
        <Tooltip 
          formatter={(value) => [
            (value * 100).toFixed(2) + '%', 
            'Proportion'
          ]} 
        />
        <Legend />
        <Bar 
          dataKey="proportion" 
          fill="#8884d8" 
          name="Word Proportion" 
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WordProportionsChart;