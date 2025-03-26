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
from collections import Counter

nltk.download("punkt")
nltk.download("wordnet")
nltk.download("omw-1.4")
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

def extract_common_words_with_proportion(texts, top_n=10):
    all_words = []
    
    for text in texts:
        processed_text = preprocess_text(text)
        all_words.extend(processed_text.split())
    
    word_counts = Counter(all_words)
    total_words = sum(word_counts.values())
    common_words = word_counts.most_common(top_n)
    word_proportions = {word: count / total_words for word, count in common_words}
    
    return word_proportions

def cluster_thought_patterns(texts, n_clusters=3):
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(texts)
    kmeans = KMeans(n_clusters=n_clusters, random_state=42).fit(tfidf_matrix)
    return kmeans.labels_.tolist()

def generate_graph_html(df):
    summaries = df["extracted_text"].tolist()
    student_names = df["student_name"].tolist()
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    embeddings = embedding_model.encode(summaries)
    similarity_matrix = cosine_similarity(embeddings)

    G = nx.Graph()
    n = len(summaries)
    for i in range(n):
        G.add_node(i, name=student_names[i], text=summaries[i])

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
        summary_text = summarizer_pipeline(combined_text, max_length=15, min_length=5, do_sample=False)[0]["summary_text"]
        for node in comp:
            node_cluster[node] = idx
        cluster_summaries[idx] = summary_text

    individual_summaries = {}
    for i in G.nodes():
        if i not in node_cluster:
            node_cluster[i] = -1
            text = G.nodes[i]['text']
            individual_summary = summarizer_pipeline(text, max_length=15, min_length=5, do_sample=False)[0]["summary_text"]
            individual_summaries[i] = individual_summary

    node_x = [G.nodes[i]['x'] for i in G.nodes()]
    node_y = [G.nodes[i]['y'] for i in G.nodes()]

    node_hover_text = []
    for i in G.nodes():
        cluster_idx = node_cluster[i]
        if cluster_idx != -1:
            hover_text = (
                f"Student: {G.nodes[i]['name']}<br>"
                f"Cluster: {cluster_idx + 1}<br>"
                f"Summary: {cluster_summaries.get(cluster_idx, 'N/A')}"
            )
        else:
            hover_text = (
                f"Student: {G.nodes[i]['name']}<br>"
                f"Summary: {individual_summaries.get(i, 'N/A')}"
            )
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
        title="Network Graph with Short Summaries",
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
    df_temp = pd.DataFrame(data)
    df = pd.json_normalize(df_temp['submissions'])
    df["challenge_id"] = df_temp["challenge_id"]
    df["cleaned_text"] = df["extracted_text"].apply(preprocess_text)
    df["cluster"] = cluster_thought_patterns(df["cleaned_text"])
    word_proportions = extract_common_words_with_proportion(df["cleaned_text"])
    graph_html = generate_graph_html(df)

    return {
        "word_proportions": word_proportions,
        "thought_clusters": df["cluster"].tolist(),
        "classification_breakdown": df["classification"].value_counts().to_dict(),
        "selection_status": df["status"].value_counts().to_dict(),
        "graph_html": graph_html  
    }

