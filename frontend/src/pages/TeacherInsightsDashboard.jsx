import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  PieChart, Pie, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell
} from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const TeacherInsightsDashboard = () => {
  const [insightsData, setInsightsData] = useState(null);
  const [graphHtml, setGraphHtml] = useState('');
  const [loadGraph, setLoadGraph] = useState(false); // Lazy load graph
  const { id } = useParams();
  const graphContainerRef = useRef(null);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const response = await axios.get(`http://localhost:5000/api/teacher/${id}/insights`);
        console.log('Fetched insights:', response.data);
        setInsightsData(response.data.data);
        setGraphHtml(response.data.data.graph_html);
      } catch (error) {
        console.error('Error fetching insights:', error);
      }
    }
    fetchInsights();
  }, [id]);

  useEffect(() => {
    if (loadGraph && graphHtml && graphContainerRef.current) {
      const container = graphContainerRef.current;
      container.innerHTML = graphHtml;

      const scripts = container.getElementsByTagName('script');
      Array.from(scripts).forEach((oldScript) => {
        const newScript = document.createElement('script');
        newScript.text = oldScript.text;
        Object.values(oldScript.attributes).forEach((attr) =>
          newScript.setAttribute(attr.name, attr.value)
        );
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    }

    return () => {
      if (graphContainerRef.current) {
        graphContainerRef.current.innerHTML = ''; // Cleanup
      }
    };
  }, [graphHtml, loadGraph]);

  const submissionStatusData = insightsData
    ? Object.entries(insightsData.selection_status).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value,
      }))
    : [];

  const submissionClassificationData = insightsData
    ? Object.entries({
        high: 0,
        medium: 0,
        low: 0,
        ...insightsData.classification_breakdown,
      }).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value,
      }))
    : [];

  const thoughtClustersData = insightsData
    ? insightsData.thought_clusters.map((count, index) => ({
        cluster: `Cluster ${index}`,
        count,
      })).filter(item => item.count > 0)
    : [];

  const handleTabChange = (value) => {
    if (value === 'graph') {
      setLoadGraph(true); // Load graph only when tab is active
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Teacher Insights Dashboard</h1>
          <p className="text-gray-600">
            Analysis of student submissions and performance metrics
          </p>
        </div>

        <Tabs defaultValue="overview" onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content Analysis</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="clustering">Student Clustering</TabsTrigger>
            <TabsTrigger value="graph">Graph Visualization</TabsTrigger>
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
                    {submissionStatusData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={submissionStatusData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {submissionStatusData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <p>Loading submission status...</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Score Distribution</CardTitle>
                  <CardDescription>Distribution of scores across all submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <p>Data not available</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Common Topics</CardTitle>
                <CardDescription>List of most common topics in student submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4">
                  {insightsData && insightsData.common_topics ? (
                    <ul className="list-disc pl-5">
                      {insightsData.common_topics.map((topic, index) => (
                        <li key={index} className="text-gray-700">{topic}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Loading common topics...</p>
                  )}
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
                  {submissionClassificationData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={submissionClassificationData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {submissionClassificationData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p>Loading classification data...</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clustering" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thought Clusters Distribution</CardTitle>
                <CardDescription>Distribution of thought clusters across student submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {thoughtClustersData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={thoughtClustersData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="cluster" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p>Loading clustering data...</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="graph" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Graph Visualization</CardTitle>
                <CardDescription>Interactive graph generated by Plotly</CardDescription>
              </CardHeader>
              <CardContent>
                {loadGraph && graphHtml ? (
                  <div ref={graphContainerRef} />
                ) : (
                  <p>Loading graph...</p>
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