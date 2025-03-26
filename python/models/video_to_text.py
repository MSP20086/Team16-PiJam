import os
import torch
import librosa
import threading
import numpy as np
from moviepy.editor import VideoFileClip  
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline
from flask import jsonify
from models.summarization import summarize_text
from models.evaluation import evaluate_solution

# Set up GPU if available
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
DEVICE_IDX = 0 if torch.cuda.is_available() else -1

def load_asr_model():
    model_id = "openai/whisper-base.en"
    model = AutoModelForSpeechSeq2Seq.from_pretrained(model_id).to(DEVICE)
    processor = AutoProcessor.from_pretrained(model_id)
    return pipeline(
        "automatic-speech-recognition",
        model=model,
        tokenizer=processor.tokenizer,
        feature_extractor=processor.feature_extractor,
        torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
        device=DEVICE_IDX
    )

asr_pipe = load_asr_model()

class AudioProcessor:
    def __init__(self, video_path):
        self.video_path = video_path
        self.transcript = ""
    
    def extract_audio(self):
        audio_path = "./temp_audio.wav"
        try:
            video = VideoFileClip(self.video_path)
            video.audio.write_audiofile(audio_path, codec="pcm_s16le", logger=None)
            return audio_path
        except Exception as e:
            return str(e)
    
    def asr_task(self):
        audio_file = self.extract_audio()
        if isinstance(audio_file, str) and "Error" not in audio_file:
            try:
                audio, sr = librosa.load(audio_file, sr=16000, mono=True)
            except Exception as e:
                self.transcript = f"Error processing audio: {str(e)}"
                return
            
            samples_per_chunk = 30 * sr
            chunks = [
                np.pad(audio[i * samples_per_chunk:(i + 1) * samples_per_chunk],
                       (0, max(0, samples_per_chunk - len(audio[i * samples_per_chunk:(i + 1) * samples_per_chunk]))),
                       mode='constant')
                for i in range((len(audio) // samples_per_chunk) + (1 if len(audio) % samples_per_chunk else 0))
            ]
            
            try:
                results = asr_pipe([chunk.astype(np.float32) for chunk in chunks])
                self.transcript = " ".join(result["text"] for result in results if "text" in result)
            except Exception as e:
                self.transcript = f"ASR Processing Error: {str(e)}"

            finally:
                os.remove(audio_file)

def process_video(file, problem_statement, rubric):
    os.makedirs("./uploads", exist_ok=True)
    video_path = os.path.join("./uploads", file.filename)
    file.save(video_path)
    
    processor_instance = AudioProcessor(video_path)
    asr_thread = threading.Thread(target=processor_instance.asr_task)
    asr_thread.start()
    asr_thread.join()

    summary = summarize_text(processor_instance.transcript)
    api_key = os.getenv("GEMINI_API_KEY")
    evaluation_result = evaluate_solution(
        problem_statement=problem_statement,
        solution=summary,
        rubric=rubric,
        api_key=api_key
    )
    
    os.remove(video_path)
    
    return {
        "transcription": processor_instance.transcript,
        "summary": summary,
        "evaluation": evaluation_result
    }
