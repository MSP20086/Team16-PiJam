import React, { useState } from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

// Sample data - in a real application, this would come from a backend API
const wordFrequencyData = [
  { word: 'Analysis', count: 120 },
  { word: 'Theory', count: 85 },
  { word: 'Evidence', count: 75 },
  { word: 'Research', count: 65 },
  { word: 'Example', count: 55 },
  { word: 'Argument', count: 45 },
  { word: 'Discussion', count: 40 },
  { word: 'Conclusion', count: 35 },
];

const scoreDistributionData = [
  { range: '0-10', count: 2 },
  { range: '11-20', count: 5 },
  { range: '21-30', count: 8 },
  { range: '31-40', count: 10 },
  { range: '41-50', count: 15 },
  { range: '51-60', count: 25 },
  { range: '61-70', count: 35 },
  { range: '71-80', count: 45 },
  { range: '81-90', count: 30 },
  { range: '91-100', count: 15 },
];

const submissionStatusData = [
  { name: 'Selected', value: 78 },
  { name: 'Not selected', value: 15 },
  { name: 'Pending', value: 7 },
];

const submissionClassificationData = [
  { name: 'Low', value: 30 },
  { name: 'Medium', value: 50 },
  { name: 'High', value: 20 },
];

const clusteringData = [
  { x: 35, y: 80, z: 10, group: 1, label: 'High performance, analytic thinkers' },
  { x: 75, y: 85, z: 15, group: 1, label: 'High performance, analytic thinkers' },
  { x: 65, y: 75, z: 12, group: 1, label: 'High performance, analytic thinkers' },
  { x: 30, y: 30, z: 8, group: 2, label: 'Struggling with fundamentals' },
  { x: 40, y: 45, z: 7, group: 2, label: 'Struggling with fundamentals' },
  { x: 35, y: 35, z: 6, group: 2, label: 'Struggling with fundamentals' },
  { x: 70, y: 40, z: 9, group: 3, label: 'Technically strong, weak on arguments' },
  { x: 65, y: 45, z: 8, group: 3, label: 'Technically strong, weak on arguments' },
  { x: 60, y: 30, z: 7, group: 3, label: 'Technically strong, weak on arguments' },
  { x: 45, y: 75, z: 10, group: 4, label: 'Good arguments, needs technical refinement' },
  { x: 50, y: 65, z: 9, group: 4, label: 'Good arguments, needs technical refinement' },
  { x: 40, y: 70, z: 8, group: 4, label: 'Good arguments, needs technical refinement' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const TeacherInsightsDashboard = () => {
  const [selectedCluster, setSelectedCluster] = useState(null);
  
  const handleClusterClick = (data) => {
    setSelectedCluster(data.group);
  };
  
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Teacher Insights Dashboard</h1>
          <p className="text-gray-600">Analysis of student submissions and performance metrics</p>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content Analysis</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="clustering">Student Clustering</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Submission Status</CardTitle>
                  <CardDescription>Overview of student submission timeliness</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={submissionStatusData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {submissionStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Score Distribution</CardTitle>
                  <CardDescription>Distribution of scores across all submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={scoreDistributionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Common Words/Topics</CardTitle>
                <CardDescription>Frequency analysis of key terms in student submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={wordFrequencyData}
                      margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="word" type="category" />
                      <Tooltip />
                      <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Submission Classification</CardTitle>
                <CardDescription>Quality assessment of student submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={submissionClassificationData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {submissionClassificationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="clustering" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Clustering</CardTitle>
                <CardDescription>
                  Groups of students based on performance patterns (x: technical score, y: argument quality)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                      <CartesianGrid />
                      <XAxis type="number" dataKey="x" name="Technical Score" unit="%" />
                      <YAxis type="number" dataKey="y" name="Argument Quality" unit="%" />
                      <ZAxis type="number" dataKey="z" range={[60, 400]} name="Submissions" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Legend />
                      <Scatter
                        name="Students"
                        data={clusteringData}
                        fill="#8884d8"
                        onClick={handleClusterClick}
                      >
                        {clusteringData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[(entry.group - 1) % COLORS.length]}
                            strokeWidth={selectedCluster === entry.group ? 2 : 0}
                            stroke="#000"
                          />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                {selectedCluster && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-md">
                    <h3 className="font-medium">Selected Group: {clusteringData.find(item => item.group === selectedCluster)?.label}</h3>
                    <p className="text-sm mt-2">
                      {selectedCluster === 1 && "These students demonstrate strong analytical skills and high performance. Consider providing more challenging material."}
                      {selectedCluster === 2 && "These students are struggling with basic concepts. Consider additional support and foundational review."}
                      {selectedCluster === 3 && "These students have good technical knowledge but need help developing stronger arguments and analytical skills."}
                      {selectedCluster === 4 && "These students have good reasoning skills but need to strengthen their technical knowledge."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherInsightsDashboard;