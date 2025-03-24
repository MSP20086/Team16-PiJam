# -*- coding: utf-8 -*-
"""cluster_html.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1c4aXUKytIYLSnMeiJoi9sWxo3pNjAp79
"""

import matplotlib.pyplot as plt
import networkx as nx
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from transformers import pipeline
import numpy as np
import json
import plotly.graph_objects as go
from plotly.offline import plot

# ------------------------------
# Step 1: Define Dummy Data with Student IDs and Summaries
# ------------------------------
dummy_submissions = [
    # Cluster 1: AI in Healthcare (10 entries)
    {"student_id": "S001", "summary": "AI is revolutionizing healthcare by improving diagnostics."},
    {"student_id": "S002", "summary": "Artificial Intelligence personalizes patient treatments."},
    {"student_id": "S003", "summary": "AI algorithms help in early disease detection."},
    {"student_id": "S004", "summary": "Healthcare leverages machine learning for treatment optimization."},
    {"student_id": "S005", "summary": "Deep learning improves medical imaging clarity."},
    {"student_id": "S006", "summary": "AI-powered diagnostics speed up patient care."},
    {"student_id": "S007", "summary": "Data-driven AI transforms patient treatment strategies."},
    {"student_id": "S008", "summary": "Machine learning models predict patient outcomes."},
    {"student_id": "S009", "summary": "Predictive analytics using AI changes preventive medicine."},
    {"student_id": "S010", "summary": "Innovative AI solutions personalize healthcare services."},

    # Cluster 2: Blockchain & Security (10 entries)
    {"student_id": "S011", "summary": "Blockchain ensures secure credential verification."},
    {"student_id": "S012", "summary": "Student records are managed with blockchain."},
    {"student_id": "S013", "summary": "Blockchain enhances transparency in digital transactions."},
    {"student_id": "S014", "summary": "Decentralized blockchain systems improve data privacy."},
    {"student_id": "S015", "summary": "Blockchain mitigates fraud in financial systems."},
    {"student_id": "S016", "summary": "Tamper-proof blockchain solutions secure digital assets."},
    {"student_id": "S017", "summary": "Digital identity management benefits from blockchain."},
    {"student_id": "S018", "summary": "Blockchain is adopted for secure supply chain management."},
    {"student_id": "S019", "summary": "Transparent transactions are a key blockchain feature."},
    {"student_id": "S020", "summary": "Blockchain-based voting systems enhance election security."},

    # Cluster 3: Chatbots & NLP in Education (10 entries)
    {"student_id": "S021", "summary": "Chatbots transform student support via automation."},
    {"student_id": "S022", "summary": "Educational chatbots provide learning support."},
    {"student_id": "S023", "summary": "NLP-powered chatbots offer personalized assistance."},
    {"student_id": "S024", "summary": "Automated chat systems improve response times."},
    {"student_id": "S025", "summary": "Chatbots provide real-time feedback in education."},
    {"student_id": "S026", "summary": "Virtual assistants enhance online learning experiences."},
    {"student_id": "S027", "summary": "AI chatbots are used for tutoring support."},
    {"student_id": "S028", "summary": "Chatbots reduce teacher workload."},
    {"student_id": "S029", "summary": "Interactive chatbots streamline communication."},
    {"student_id": "S030", "summary": "Chatbots in education automate common queries."},

    # Cluster 4: Robotics & Automation (10 entries)
    {"student_id": "S031", "summary": "Robots transform manufacturing via automation."},
    {"student_id": "S032", "summary": "Industrial robots boost factory efficiency."},
    {"student_id": "S033", "summary": "Automation in robotics reduces human error."},
    {"student_id": "S034", "summary": "Collaborative robots work alongside humans."},
    {"student_id": "S035", "summary": "Robotics reshape supply chain management."},
    {"student_id": "S036", "summary": "Service robots improve customer service."},
    {"student_id": "S037", "summary": "AI-driven robots are used for warehouse automation."},
    {"student_id": "S038", "summary": "Innovative robotics lead to smarter factories."},
    {"student_id": "S039", "summary": "Robotics in agriculture optimize harvesting."},
    {"student_id": "S040", "summary": "Autonomous robots revolutionize logistics."},

    # Cluster 5: Smart Home & IoT (10 entries)
    {"student_id": "S041", "summary": "Smart home devices optimize energy use."},
    {"student_id": "S042", "summary": "IoT devices make homes safer."},
    {"student_id": "S043", "summary": "Home automation systems enhance convenience."},
    {"student_id": "S044", "summary": "AI-powered thermostats adjust settings intelligently."},
    {"student_id": "S045", "summary": "Voice assistants control smart home gadgets."},
    {"student_id": "S046", "summary": "Smart security systems detect anomalies using AI."},
    {"student_id": "S047", "summary": "Connected home devices improve energy management."},
    {"student_id": "S048", "summary": "IoT in homes enables remote monitoring."},
    {"student_id": "S049", "summary": "Smart lighting systems adapt for efficiency."},
    {"student_id": "S050", "summary": "AI-integrated smart home systems streamline routines."}
]

print(f"Using {len(dummy_submissions)} dummy submissions.")

# Extract summaries list for embedding computation
summaries = [item["summary"] for item in dummy_submissions]

# ------------------------------
# Step 2: Compute Embeddings
# ------------------------------
model = SentenceTransformer('all-MiniLM-L6-v2')

summaries = [item["summary"] for item in dummy_submissions]

# --- Step 1: Compute Embeddings and Similarity Matrix ---
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = embedding_model.encode(summaries)
similarity_matrix = cosine_similarity(embeddings)

# --- Step 2: Build Graph G ---
G = nx.Graph()
n = len(summaries)
for i in range(n):
    G.add_node(i, student_id=dummy_submissions[i]["student_id"], text=summaries[i])
threshold = 0.7
for i in range(n):
    for j in range(i + 1, n):
        if similarity_matrix[i, j] > threshold:
            G.add_edge(i, j, weight=similarity_matrix[i, j])

# --- Step 3: Compute Layout ---
pos = nx.spring_layout(G, seed=42)
for i in G.nodes():
    G.nodes[i]['x'] = float(pos[i][0])
    G.nodes[i]['y'] = float(pos[i][1])

# --- Step 4: Compute Clusters and Generate Cluster Summaries ---
clusters = [comp for comp in nx.connected_components(G) if len(comp) > 1]
node_cluster = {}
summarizer_pipeline = pipeline("summarization", model="facebook/bart-large-cnn")
cluster_summaries = {}
for idx, comp in enumerate(clusters):
    combined_text = " ".join([G.nodes[i]['text'] for i in comp])
    size=len(combined_text.split())
    summary_text = summarizer_pipeline(combined_text, max_length=size+5, min_length=10, do_sample=False)[0]["summary_text"]
    for node in comp:
        node_cluster[node] = idx
    cluster_summaries[idx] = summary_text

# Assign -1 for isolated nodes
for i in G.nodes():
    if i not in node_cluster:
        node_cluster[i] = -1

# --- Step 5: Prepare Plotly Traces with Updated Hover Text ---
node_x = [G.nodes[i]['x'] for i in G.nodes()]
node_y = [G.nodes[i]['y'] for i in G.nodes()]

node_hover_text = []
for i in G.nodes():
    cluster_idx = node_cluster[i]
    if cluster_idx != -1:
        # Include both student id, submission text, and cluster summary
        hover_text = (
            f"Student: {G.nodes[i]['student_id']}<br>"
            f"Cluster:{cluster_idx+1}<br>Cluster Summary: {cluster_summaries[cluster_idx]}"
        )
    else:
        hover_text = f"Student:{G.nodes[i]['student_id']}"
    node_hover_text.append(hover_text)

node_trace = go.Scatter(
    x=node_x,
    y=node_y,
    mode='markers',
    marker=dict(
        size=15,
        color='orange',  # Using a single color (orange) for all nodes
    ),
    text=node_hover_text,
    hoverinfo='text',
    type='scatter',
)

edge_x = []
edge_y = []
for u, v in G.edges():
    edge_x.extend([G.nodes[u]['x'], G.nodes[v]['x'], None])
    edge_y.extend([G.nodes[u]['y'], G.nodes[v]['y'], None])
edge_trace = go.Scatter(
    x=edge_x,
    y=edge_y,
    mode='lines',
    line=dict(width=2, color='#888'),
    hoverinfo='none',
    type='scatter'
)

layout = go.Layout(
    title="Network Graph with Cluster Summaries (Nodes in Orange)",
    showlegend=False,
    hovermode='closest',
    xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
    yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
    height=600,
)

fig = go.Figure(data=[edge_trace, node_trace], layout=layout)

# --- Step 6: Generate HTML Snippet ---
graph_chart_html = plot(fig, output_type="div", include_plotlyjs='cdn')

# Output the HTML snippet (to be sent to the frontend)
print(graph_chart_html)