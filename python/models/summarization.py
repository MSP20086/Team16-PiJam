import torch
from transformers import pipeline, AutoTokenizer

device = 0 if torch.cuda.is_available() else -1

# Use a larger model with better summarization capabilities
model_name = "facebook/bart-large-cnn"
tokenizer = AutoTokenizer.from_pretrained(model_name)
summarizer = pipeline(
    "summarization",
    model=model_name,
    tokenizer=tokenizer,
    device=device,
    framework="pt" if torch.cuda.is_available() else None
)

def summarize_text(text):
    if not text.strip():
        return "No meaningful content to summarize."

    input_length = len(tokenizer.encode(text))
    max_length = min(int(input_length * 0.3), 500)  # Increase max length limit
    min_length = min(int(input_length * 0.15), 200)  # Adjust min length

    try:
        summary = summarizer(
            text,
            max_length=max_length,
            min_length=min_length,
            do_sample=False,
            num_beams=6,  # Increase beam search depth
            length_penalty=1.5,  # Reduce penalty slightly
            no_repeat_ngram_size=3,  
            repetition_penalty=1.1  # Slightly reduce repetition penalty
        )[0]["summary_text"]

        # Post-process summary
        summary = summary.replace(" .", ".").replace(" ,", ",")
        return summary.strip()

    except Exception as e:
        print(f"Summarization error: {str(e)}")
        return text  # Return full text instead of truncation
