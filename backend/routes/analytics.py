from fastapi import APIRouter, HTTPException
from firebase_config import get_db
from collections import defaultdict

router = APIRouter()

@router.get("/summary")
async def get_summary():
    try:
        db = get_db()
        docs = list(db.collection("issues").stream())
        issues = [doc.to_dict() for doc in docs]

        total = len(issues)
        open_count = sum(1 for i in issues if i.get("status") in ["reported", "verified", "assigned"])
        in_progress = sum(1 for i in issues if i.get("status") == "in_progress")
        resolved = sum(1 for i in issues if i.get("status") in ["resolved", "closed"])

        # Category breakdown
        by_category = defaultdict(int)
        by_severity = defaultdict(int)
        by_status = defaultdict(int)

        for issue in issues:
            by_category[issue.get("issue_type", "unknown")] += 1
            by_severity[issue.get("severity", "low")] += 1
            by_status[issue.get("status", "reported")] += 1

        # Community impact score (simple formula)
        impact_score = min(int((resolved / total * 100) if total > 0 else 0) + len(issues), 999)

        return {
            "success": True,
            "summary": {
                "total_reports": total,
                "open_issues": open_count,
                "in_progress": in_progress,
                "resolved_issues": resolved,
                "community_impact_score": impact_score,
                "by_category": dict(by_category),
                "by_severity": dict(by_severity),
                "by_status": dict(by_status)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/leaderboard")
async def get_leaderboard():
    try:
        db = get_db()
        docs = db.collection("issues").stream()
        user_stats = defaultdict(lambda: {"reports": 0, "votes_given": 0, "name": "Citizen"})

        for doc in docs:
            data = doc.to_dict()
            uid = data.get("user_id", "anonymous")
            user_stats[uid]["reports"] += 1
            user_stats[uid]["name"] = data.get("user_name", "Citizen")

        leaderboard = []
        for uid, stats in user_stats.items():
            score = stats["reports"] * 10
            leaderboard.append({
                "user_id": uid,
                "name": stats["name"],
                "reports": stats["reports"],
                "score": score,
                "badge": "🏆" if score >= 50 else "⭐" if score >= 20 else "🌱"
            })

        leaderboard.sort(key=lambda x: x["score"], reverse=True)
        return {"success": True, "leaderboard": leaderboard[:10]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))