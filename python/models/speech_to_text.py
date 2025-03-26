import json
import os
import torch
import librosa
import numpy as np
import io
from flask import jsonify
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline
from models.summarization import summarize_text
from models.evaluation import evaluate_solution

device = "cuda:0" if torch.cuda.is_available() else "cpu"
torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32
print(f"Using device: {device}")

# Upgrade to larger model for better accuracy
model_id = "openai/whisper-base.en"
processor = AutoProcessor.from_pretrained(model_id)
model = AutoModelForSpeechSeq2Seq.from_pretrained(
    model_id,
    torch_dtype=torch_dtype,
    low_cpu_mem_usage=True,
    use_safetensors=True
).to(device)
model.eval()

asr_pipe = pipeline(
    "automatic-speech-recognition",
    model=model,
    tokenizer=processor.tokenizer,
    feature_extractor=processor.feature_extractor,
    device=device,
    torch_dtype=torch_dtype,
)

def process_audio(file, problem_statement, rubric):
    try:
        audio_bytes = file.read()
        audio, sr = librosa.load(io.BytesIO(audio_bytes), 
                                sr=16000, 
                                mono=True,
                                res_type='soxr_hq')
        audio = librosa.util.normalize(audio)
    except Exception as e:
        return jsonify({"error": f"Audio processing failed: {str(e)}"}), 400

    chunk_size = 30 * sr
    chunks = [audio[i:i+chunk_size] for i in range(0, len(audio), chunk_size)]

    if not chunks:
        return jsonify({"error": "Empty audio file"}), 400

    with torch.no_grad():
        try:
            # Remove language/task parameters for English-only model
            results = asr_pipe(
                chunks,
                batch_size=4 if torch.cuda.is_available() else 1,
                return_timestamps=False
            )
        except RuntimeError as e:
            if 'CUDA out of memory' in str(e):
                return jsonify({"error": "GPU memory exhausted, try shorter audio"}), 413
            raise e

    transcription = " ".join([result["text"].strip() for result in results])
    transcription = transcription.replace("...", ".")
    transcription = " ".join(transcription.split())
    
    summary = summarize_text(transcription)
    
    api_key = os.getenv("GEMINI_API_KEY")
    evaluation_result = evaluate_solution(
        problem_statement=problem_statement,
        solution=summary,
        rubric=rubric,
        api_key=api_key
    )

    return {
        "transcription": transcription,
        "summary": summary.strip(),
        "evaluation": evaluation_result
    }