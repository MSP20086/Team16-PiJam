from google import genai
from pydantic import BaseModel
from typing import List
import json

class Evaluation(BaseModel):
    criterion: str
    score: int
    justification: str

class EvaluationResponse(BaseModel):
    summary: str
    evaluation: List[Evaluation]
    final_score: float

def evaluate_solution(problem_statement: str, solution: str, rubric: List[dict], api_key: str) -> EvaluationResponse:
    """
    Evaluates a solution based on a given problem statement and rubric using the Gemini API.

    Args:
        problem_statement: The problem statement.
        solution: The solution to be evaluated.
        rubric: A list of dictionaries, where each dictionary represents a criterion with 'name', 'weight', and 'description'.
        api_key: Your Gemini API key.

    Returns:
        An EvaluationResponse object containing the summary, evaluation, and final score.
    """
    client = genai.Client(api_key=api_key)

    prompt = f"""
    You are an advanced text evaluator. Given a problem statement, a solution, and a rubric, you will:
    1. Provide a concise summary of the solution.
    2. Evaluate the solution based on each rubric criterion, providing both scores (0-10) and justifications.

    Problem Statement:
    {problem_statement}

    Solution:
    {solution}

    Rubric:
    """
    for criterion in rubric:
        prompt += f"- {criterion['name']} ({criterion['weight']}) → {criterion['description']}\n"

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
        return EvaluationResponse(**response_dict)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON response: {e}")
        print(f"Raw response text: {response.text}")
        return None  # Or raise an exception, depending on how you want to handle errors
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None