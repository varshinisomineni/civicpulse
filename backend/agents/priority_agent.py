import google.generativeai as genai
import os
import json
import re
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

SEVERITY_WEIGHTS = {
    "critical": 40,
    "high": 30,
    "medium": 20,
    "low": 10
}

DEPARTMENT_MAP = {
    "pothole": "Road Maintenance",
    "road_damage": "Road Maintenance",
    "damaged_footpath": "Road Maintenance",
    "garbage": "Sanitation Department",
    "illegal_dumping": "Sanitation Department",
    "water_leakage": "Water Supply Department",
    "flooding": "Drainage Authority",
    "drain_blockage": "Drainage Authority",
    "broken_streetlight": "Electrical Department",
    "fallen_tree": "Parks & Recreation",
    "none": "Municipal Corporation"
}

def calculate_priority(analysis: dict, community_votes: int = 0) -> dict:
    severity = analysis.get("severity", "low")
    base_score = SEVERITY_WEIGHTS.get(severity, 10)

    # Boost for community votes
    vote_boost = min(community_votes * 2, 20)

    # AI priority score (already 0-100)
    ai_score = analysis.get("priority_score", 50)

    # Weighted final score
    final_score = int((base_score / 40) * 40 + (ai_score / 100) * 40 + vote_boost)
    final_score = min(final_score, 100)

    # Determine label
    if final_score >= 75:
        priority_label = "critical"
    elif final_score >= 50:
        priority_label = "high"
    elif final_score >= 25:
        priority_label = "medium"
    else:
        priority_label = "low"

    issue_type = analysis.get("issue_type", "none")
    department = DEPARTMENT_MAP.get(issue_type, "Municipal Corporation")

    return {
        "priority_score": final_score,
        "priority_label": priority_label,
        "recommended_department": department,
        "severity": severity
    }

async def get_community_insights(issues: list) -> str:
    if not issues:
        return "No issues reported yet in this area."

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        issue_summary = json.dumps([{
            "type": i.get("issue_type"),
            "severity": i.get("severity"),
            "date": str(i.get("created_at", ""))
        } for i in issues[:20]])

        prompt = f"""Based on these civic issues reported recently: {issue_summary}

Generate 2-3 short, actionable community insights (each under 20 words).
Return ONLY a JSON array of strings, no markdown:
["insight 1", "insight 2", "insight 3"]"""

        response = model.generate_content(prompt)
        raw = re.sub(r"```json|```", "", response.text.strip()).strip()
        insights = json.loads(raw)
        return insights
    except Exception as e:
        return ["AI insights temporarily unavailable."]