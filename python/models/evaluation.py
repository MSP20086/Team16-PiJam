from flask import Blueprint, request, jsonify
from google import genai
from pydantic import BaseModel
from typing import List
import json
import os

evaluation_bp = Blueprint("evaluation", __name__)

class Evaluation(BaseModel):
    criterion: str
    score: int
    justification: str

class EvaluationResponse(BaseModel):
    evaluation: List[Evaluation]
    final_score: float

def evaluate_solution(problem_statement: str, solution: str, rubric: List[dict], api_key: str):
    client = genai.Client(api_key=api_key)
    
    prompt = f"""
    You are an advanced solution evaluator. Your task is to evaluate how effectively a solution addresses a specific problem statement.
    
    Evaluate HOW WELL the proposed solution solves the problem described in the problem statement.
    
    Problem Statement:
    {problem_statement}
    
    Proposed Solution:
    {solution}
    
    Evaluation Rubric:
    """
    for criterion in rubric:
        prompt += f"- {criterion['parameter']} ({criterion['weight']}) → {criterion['description']}\n"
    
    prompt += """
        You are an advanced text evaluator. Given a problem statement, a solution, and a rubric, you will:
        1. Provide a concise summary of the solution.
        2. Evaluate the solution based on each rubric criterion, providing both scores (0-100) and justifications.
    """

    response_schema = EvaluationResponse.schema()
    
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=prompt,
        config={
            'response_mime_type': 'application/json',
            'response_schema': response_schema,
        },
    )
    
    try:
        response_dict = json.loads(response.text)
        return EvaluationResponse(**response_dict).dict()
    except json.JSONDecodeError as e:
        return {"error": "Failed to parse response", "details": str(e)}
    except Exception as e:
        return {"error": "An unexpected error occurred", "details": str(e)}

@evaluation_bp.route("/evaluate", methods=["POST"])
def evaluate():
    try:
        data = request.json
        problem_statement = data["problem_statement"]
        solution = data["solution"]
        rubric = data["rubric"]
        api_key = os.getenv("GEMINI_API_KEY")
        
        evaluation_result = evaluate_solution(problem_statement, solution, rubric, api_key)
        return jsonify(evaluation_result)
    except Exception as e:
        return jsonify({"error": "Invalid request", "details": str(e)})