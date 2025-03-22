import json
import os
import torch
import librosa
import numpy as np
import io
from flask import Blueprint, request, jsonify
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline
from models.summarization import summarize_text
from models.evaluation import evaluate_solution

audio_bp = Blueprint("audio_transcription", __name__)

device = "cuda:0" if torch.cuda.is_available() else "cpu"
torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32
print(f"Using device: {device}")

model_id = "openai/whisper-tiny.en"
processor = AutoProcessor.from_pretrained(model_id)
model = AutoModelForSpeechSeq2Seq.from_pretrained(
    model_id, torch_dtype=torch_dtype, low_cpu_mem_usage=True, use_safetensors=True
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

@audio_bp.route("/speech", methods=["POST"])
def predict_audio():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    if "problem_statement" not in request.form:
        return jsonify({"error": "No problem statement provided"}), 400

    if "rubric" not in request.form:
        return jsonify({"error": "No evaluation rubric provided"}), 400

    try:
        rubric = json.loads(request.form["rubric"])  
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid rubric format. Must be valid JSON."}), 400

    audio_file = request.files["audio"]
    try:
        audio_bytes = audio_file.read()
        audio, sr = librosa.load(io.BytesIO(audio_bytes), sr=16000, mono=True, duration=300)
    except Exception as e:
        return jsonify({"error": f"Audio processing failed: {str(e)}"}), 400

    chunk_size = 30 * sr
    chunks = []
    for i in range(0, len(audio), chunk_size):
        chunk = audio[i:i+chunk_size]
        if len(chunk) < chunk_size:
            chunk = np.pad(chunk, (0, chunk_size - len(chunk)), mode='constant')
        chunks.append(chunk)

    if not chunks:
        return jsonify({"error": "Empty audio file"}), 400


    with torch.no_grad():
        try:
            results = asr_pipe(chunks, batch_size=8 if torch.cuda.is_available() else 2, return_timestamps=False)
        except RuntimeError as e:
            if 'CUDA out of memory' in str(e):
                return jsonify({"error": "GPU memory exhausted, try shorter audio"}), 413
            raise e

    transcription = " ".join([result["text"] for result in results])
    summary = summarize_text(transcription)
    problem_statement = request.form["problem_statement"]

    api_key = os.getenv("GEMINI_API_KEY")
    evaluation_result = evaluate_solution(
        problem_statement=problem_statement,
        solution=summary,
        rubric=rubric,
        api_key=api_key
    )

    return jsonify({
        "transcription": transcription.strip(),
        "summary": summary.strip(),
        "evaluation": evaluation_result
    })
