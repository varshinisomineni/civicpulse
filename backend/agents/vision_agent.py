import google.generativeai as genai
import os
import json
import re
from PIL import Image
import io
from dotenv import load_dotenv
import traceback

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

CIVIC_ISSUE_TYPES = [
    "pothole", "garbage", "water_leakage", "broken_streetlight",
    "road_damage", "drain_blockage", "fallen_tree", "damaged_footpath",
    "illegal_dumping", "flooding"
]

async def analyze_image(image_bytes: bytes) -> dict:
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        image = Image.open(io.BytesIO(image_bytes))

        prompt = """
You are an AI civic infrastructure analyst.

Analyze this image for community infrastructure issues.

Return ONLY valid JSON.

{
  "has_civic_issue": true,
  "issue_type": "pothole",
  "confidence_score": 0.95,
  "severity": "high",
  "priority_score": 85,
  "estimated_impact": "Vehicles and pedestrians are affected.",
  "reasoning": "Visible road damage with a large pothole.",
  "recommended_department": "Road Maintenance",
  "suggested_resolution": "Repair the pothole immediately.",
  "estimated_resolution_time": "2-3 days",
  "tags": ["road", "pothole"],
  "location_risk": "High risk for vehicles"
}

If no civic issue is present:
{
  "has_civic_issue": false,
  "issue_type": "none"
}

Return ONLY JSON.
"""

        response = model.generate_content([prompt, image])

        print("\n========== GEMINI RAW RESPONSE ==========")
        print(response.text)
        print("=========================================\n")

        raw = response.text.strip()

        # Remove markdown if Gemini returns it
        raw = re.sub(r"```json", "", raw)
        raw = re.sub(r"```", "", raw)
        raw = raw.strip()

        print("\n========== CLEANED RESPONSE ==========")
        print(raw)
        print("======================================\n")

        result = json.loads(raw)

        print("\n========== PARSED JSON ==========")
        print(result)
        print("=================================\n")

        return {
            "success": True,
            "analysis": result
        }

    except json.JSONDecodeError as e:
        print("\nJSON PARSE ERROR")
        print(e)
        print(raw)

        return {
            "success": False,
            "error": f"JSON Decode Error: {str(e)}",
            "raw": raw
        }

    except Exception as e:
        print("\nGENERAL ERROR")
        traceback.print_exc()

        return {
            "success": False,
            "error": str(e)
        }