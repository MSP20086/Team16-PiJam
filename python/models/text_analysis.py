import pandas as pd
import re
import string
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

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

def analyze_text_data(data):
    df = pd.DataFrame(data)
    df["cleaned_text"] = df["extracted_text"].apply(preprocess_text)
    df["cluster"] = cluster_thought_patterns(df["cleaned_text"])
    topics = extract_common_topics(df["cleaned_text"])
    
    return {
        "common_topics": topics,
        "thought_clusters": df["cluster"].tolist(),
        "classification_breakdown": df["classification"].value_counts().to_dict(),
        "selection_status": df["status"].value_counts().to_dict()
    }
