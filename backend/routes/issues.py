from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from firebase_config import get_db
from agents.vision_agent import analyze_image
from agents.priority_agent import calculate_priority, get_community_insights
from agents.duplicate_agent import check_duplicates
from agents.routing_agent import route_issue
from datetime import datetime
import uuid

router = APIRouter()

@router.post("/analyze")
async def analyze_issue_image(file: UploadFile = File(...)):
    """Analyze an uploaded image for civic issues using Gemini Vision."""
    contents = await file.read()
    result = await analyze_image(contents)
    return result

@router.post("/check-duplicate")
async def check_duplicate_issue(
    lat: float = Form(...),
    lng: float = Form(...),
    issue_type: str = Form(...)
):
    result = await check_duplicates(lat, lng, issue_type)
    return result

@router.post("/submit")
async def submit_issue(
    title: str = Form(...),
    description: str = Form(...),
    issue_type: str = Form(...),
    severity: str = Form(...),
    lat: float = Form(...),
    lng: float = Form(...),
    address: str = Form(""),
    user_id: str = Form("anonymous"),
    user_name: str = Form("Citizen"),
    image_url: str = Form(""),
    ai_analysis: str = Form("{}"),
):
    import json
    try:
        db = get_db()
        analysis_dict = json.loads(ai_analysis) if ai_analysis else {}
        priority = calculate_priority(analysis_dict)
        routing = route_issue(issue_type, severity)

        issue_id = str(uuid.uuid4())
        now = datetime.utcnow()

        issue_data = {
            "id": issue_id,
            "title": title,
            "description": description,
            "issue_type": issue_type,
            "severity": severity,
            "status": "reported",
            "location": {"lat": lat, "lng": lng, "address": address},
            "user_id": user_id,
            "user_name": user_name,
            "image_url": image_url,
            "ai_analysis": analysis_dict,
            "priority_score": priority["priority_score"],
            "priority_label": priority["priority_label"],
            "recommended_department": routing["department"],
            "routing_note": routing["routing_note"],
            "avg_response_time": routing["avg_response_time"],
            "flagged_urgent": routing["flagged_urgent"],
            "votes": 0,
            "comments": [],
            "timeline": [
                {"status": "reported", "timestamp": now.isoformat(), "note": "Issue reported by citizen"}
            ],
            "created_at": now.isoformat(),
            "updated_at": now.isoformat(),
        }

        db.collection("issues").document(issue_id).set(issue_data)
        return {"success": True, "issue_id": issue_id, "data": issue_data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_issues(status: str = None, issue_type: str = None, limit: int = 50):
    try:
        db = get_db()
        query = db.collection("issues")
        if status:
            query = query.where("status", "==", status)
        if issue_type:
            query = query.where("issue_type", "==", issue_type)

        docs = query.limit(limit).stream()
        issues = []
        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id
            issues.append(data)

        # Sort by priority score descending
        issues.sort(key=lambda x: x.get("priority_score", 0), reverse=True)
        return {"success": True, "issues": issues, "total": len(issues)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{issue_id}")
async def get_issue(issue_id: str):
    try:
        db = get_db()
        doc = db.collection("issues").document(issue_id).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Issue not found")
        data = doc.to_dict()
        data["id"] = doc.id
        return {"success": True, "issue": data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{issue_id}/vote")
async def vote_issue(issue_id: str, user_id: str = Form("anonymous")):
    try:
        db = get_db()
        ref = db.collection("issues").document(issue_id)
        doc = ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Issue not found")

        data = doc.to_dict()
        current_votes = data.get("votes", 0)
        ref.update({"votes": current_votes + 1, "updated_at": datetime.utcnow().isoformat()})
        return {"success": True, "votes": current_votes + 1}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{issue_id}/comment")
async def add_comment(issue_id: str, comment: str = Form(...), user_name: str = Form("Citizen")):
    try:
        db = get_db()
        ref = db.collection("issues").document(issue_id)
        doc = ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Issue not found")

        data = doc.to_dict()
        comments = data.get("comments", [])
        new_comment = {
            "id": str(uuid.uuid4()),
            "text": comment,
            "user_name": user_name,
            "timestamp": datetime.utcnow().isoformat()
        }
        comments.append(new_comment)
        ref.update({"comments": comments, "updated_at": datetime.utcnow().isoformat()})
        return {"success": True, "comment": new_comment}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{issue_id}/status")
async def update_status(issue_id: str, status: str = Form(...), note: str = Form("")):
    try:
        db = get_db()
        ref = db.collection("issues").document(issue_id)
        doc = ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Issue not found")

        data = doc.to_dict()
        timeline = data.get("timeline", [])
        timeline.append({
            "status": status,
            "timestamp": datetime.utcnow().isoformat(),
            "note": note or f"Status updated to {status}"
        })

        ref.update({
            "status": status,
            "timeline": timeline,
            "updated_at": datetime.utcnow().isoformat()
        })
        return {"success": True, "status": status}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/insights/community")
async def community_insights():
    try:
        db = get_db()
        docs = db.collection("issues").limit(30).stream()
        issues = [doc.to_dict() for doc in docs]
        insights = await get_community_insights(issues)
        return {"success": True, "insights": insights}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))