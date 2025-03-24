import json
import re
import string
import nltk
import pandas as pd
import networkx as nx
import numpy as np
import plotly.graph_objects as go
from plotly.offline import plot
from flask import jsonify
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from transformers import pipeline

nltk.download("punkt")
nltk.download('punkt_tab')
nltk.download('wordnet')
nltk.download('omw-1.4')
nltk.download("stopwords")

def preprocess_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'\d+', '', text)  
    text = text.translate(str.maketrans("", "", string.punctuation)) 
    words = word_tokenize(text)
    words = [word for word in words if word not in stopwords.words('english')]
    return " ".join(words)

def extract_common_topics(texts, top_n=10):
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(texts)
    feature_names = vectorizer.get_feature_names_out()
    return feature_names[:top_n].tolist()

def cluster_thought_patterns(texts, n_clusters=3):
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(texts)
    kmeans = KMeans(n_clusters=n_clusters, random_state=42).fit(tfidf_matrix)
    return kmeans.labels_.tolist()

def generate_graph_html(dummy_submissions):
    summaries = [item["extracted_text"] for item in dummy_submissions]
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    embeddings = embedding_model.encode(summaries)
    similarity_matrix = cosine_similarity(embeddings)
    G = nx.Graph()
    n = len(summaries)
    for i in range(n):
        G.add_node(i, student_id=dummy_submissions[i]["id"], text=summaries[i])
    
    threshold = 0.7
    for i in range(n):
        for j in range(i + 1, n):
            if similarity_matrix[i, j] > threshold:
                G.add_edge(i, j, weight=similarity_matrix[i, j])
    pos = nx.spring_layout(G, seed=42)
    for i in G.nodes():
        G.nodes[i]['x'] = float(pos[i][0])
        G.nodes[i]['y'] = float(pos[i][1])
    clusters = [comp for comp in nx.connected_components(G) if len(comp) > 1]
    node_cluster = {}
    summarizer_pipeline = pipeline("summarization", model="facebook/bart-large-cnn")
    cluster_summaries = {}
    
    for idx, comp in enumerate(clusters):
        combined_text = " ".join([G.nodes[i]['text'] for i in comp])
        size = len(combined_text.split())
        summary_text = summarizer_pipeline(combined_text, max_length=size+5, min_length=10, do_sample=False)[0]["summary_text"]
        for node in comp:
            node_cluster[node] = idx
        cluster_summaries[idx] = summary_text
    for i in G.nodes():
        if i not in node_cluster:
            node_cluster[i] = -1
    node_x = [G.nodes[i]['x'] for i in G.nodes()]
    node_y = [G.nodes[i]['y'] for i in G.nodes()]

    node_hover_text = []
    for i in G.nodes():
        cluster_idx = node_cluster[i]
        hover_text = (
            f"Student: {G.nodes[i]['student_id']}<br>"
            f"Cluster: {cluster_idx+1}<br>Cluster Summary: {cluster_summaries.get(cluster_idx, 'N/A')}"
        ) if cluster_idx != -1 else f"Student: {G.nodes[i]['student_id']}"
        node_hover_text.append(hover_text)

    node_trace = go.Scatter(
        x=node_x,
        y=node_y,
        mode='markers',
        marker=dict(size=15, color='orange'),
        text=node_hover_text,
        hoverinfo='text'
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
        hoverinfo='none'
    )

    layout = go.Layout(
        title="Network Graph with Cluster Summaries",
        showlegend=False,
        hovermode='closest',
        xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
        yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
        height=600,
    )

    fig = go.Figure(data=[edge_trace, node_trace], layout=layout)

    graph_chart_html = plot(fig, output_type="div", include_plotlyjs='cdn')
    return graph_chart_html

def analyze_text_data(data):
    df = pd.DataFrame(data)
    df["cleaned_text"] = df["extracted_text"].apply(preprocess_text)
    df["cluster"] = cluster_thought_patterns(df["cleaned_text"])
    topics = extract_common_topics(df["cleaned_text"])

    graph_html = generate_graph_html(data)

    return {
        "common_topics": topics,
        "thought_clusters": df["cluster"].tolist(),
        "classification_breakdown": df["classification"].value_counts().to_dict(),
        "selection_status": df["status"].value_counts().to_dict(),
        "graph_html": graph_html  
    }
