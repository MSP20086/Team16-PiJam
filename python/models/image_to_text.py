import json
import os
import easyocr
import numpy as np
from PIL import Image
from flask import jsonify
from models.summarization import summarize_text
from models.evaluation import evaluate_solution

reader = easyocr.Reader(lang_list=['en'], gpu=True)

def process_image(file, problem_statement, rubric):
    try:
        image = Image.open(file).convert("RGB")
    except Exception as e:
        return jsonify({"error": "Invalid image file"}), 400
    image_np = np.array(image)

    transcription_results = reader.readtext(image_np, detail=0)
    transcription = " ".join(transcription_results) 
    summary = summarize_text(transcription)
    api_key = os.getenv("GEMINI_API_KEY")
    evaluation_result = evaluate_solution(
        problem_statement=problem_statement, 
        solution=summary,  
        rubric=rubric,  
        api_key=api_key
    )
    
    return {
        "transcription": transcription.strip(),
        "summary": summary.strip(),
        "evaluation": evaluation_result
    }
