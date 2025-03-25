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
import { 
  AlertTriangle, 
  TrendingUp, 
  BarChart as BarChartIcon, 
  FileText, 
  Globe 
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const TeacherInsightsDashboard = () => {
  const [insightsData, setInsightsData] = useState(null);
  const [graphHtml, setGraphHtml] = useState('');
  const [loadGraph, setLoadGraph] = useState(false); // Lazy load graph
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const graphContainerRef = useRef(null);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const response = await axios.get(`http://localhost:5000/api/teacher/${id}/insights`);
        console.log('Fetched insights:', response.data);
        setInsightsData(response.data.data);
        setGraphHtml(response.data.data.graph_html || '');
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching insights:', error);
        setError('Failed to load insights. Please try again later.');
        setIsLoading(false);
      }
    }
    fetchInsights();
  }, [id]);

  // useEffect(() => {
  //   if (loadGraph && graphHtml && graphContainerRef.current) {
  //     try {
  //       const container = graphContainerRef.current;
  //       container.innerHTML = graphHtml;

  //       // Safely execute scripts
  //       const scripts = container.getElementsByTagName('script');
  //       Array.from(scripts).forEach((oldScript) => {
  //         const newScript = document.createElement('script');
  //         newScript.text = oldScript.innerHTML;
  //         Object.values(oldScript.attributes).forEach((attr) =>
  //           newScript.setAttribute(attr.name, attr.value)
  //         );
  //         oldScript.parentNode.replaceChild(newScript, oldScript);
  //       });
  //     } catch (error) {
  //       console.error('Error rendering graph:', error);
  //       setError('Failed to render graph. Please check the data source.');
  //     }
  //   }

  //   return () => {
  //     if (graphContainerRef.current) {
  //       graphContainerRef.current.innerHTML = ''; // Cleanup
  //     }
  //   };
  // }, [graphHtml, loadGraph]);

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
        cluster: `Cluster ${index+1}`,
        count,
      })).filter(item => item.count > 0)
    : [];

  const handleTabChange = (value) => {
    if (value === 'graph') {
      setLoadGraph(true); // Load graph only when tab is active
    }
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

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
            <Card className="bg-white/80 backdrop-blur-lg shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-6 h-6 text-blue-500" />
                  Graph Visualization
                </CardTitle>
                <CardDescription>
                  Interactive visualization generated by data analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* {loadGraph && graphHtml ? (
                  <div 
                    // ref={graphContainerRef} 
                    dangerouslySetInnerHTML={{ __html: graphHtml }}
                    className="w-full min-h-[500px] bg-white rounded-lg shadow-inner p-4"
                  />
                ) : (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">Loading advanced graph visualization...</p>
                  </div>
                )} */}
                <div 
                    // ref={graphContainerRef} 
                    dangerouslySetInnerHTML={{ __html: graphHtml }}
                    className="w-full min-h-[500px] bg-white rounded-lg shadow-inner p-4"
                  />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherInsightsDashboard;
