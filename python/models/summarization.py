import torch
from transformers import pipeline

device = 0 if torch.cuda.is_available() else -1
summarizer = pipeline(
    "summarization",
    model="sshleifer/distilbart-cnn-12-6", 
    device=device  
)

def summarize_text(text):
    if not text.strip():
        return "No meaningful content to summarize."

    # Generate summary
    summary = summarizer(
        text,
        max_length=100,  
        min_length=50,   
        truncation=True,
        do_sample=False  
    )[0]["summary_text"]

    return summary
