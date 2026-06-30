import math
from firebase_config import get_db

def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two coordinates in meters."""
    R = 6371000  # Earth radius in meters
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda/2)**2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))

async def check_duplicates(lat: float, lon: float, issue_type: str, radius_meters: float = 100) -> dict:
    """Check if a similar issue already exists nearby."""
    try:
        db = get_db()
        issues_ref = db.collection("issues")

        # Get all open issues of the same type
        query = issues_ref.where("issue_type", "==", issue_type).where(
            "status", "in", ["reported", "verified", "assigned", "in_progress"]
        ).limit(50)

        docs = query.stream()
        nearby = []

        for doc in docs:
            data = doc.to_dict()
            loc = data.get("location", {})
            if not loc:
                continue
            existing_lat = loc.get("lat", 0)
            existing_lon = loc.get("lng", 0)

            dist = haversine_distance(lat, lon, existing_lat, existing_lon)
            if dist <= radius_meters:
                nearby.append({
                    "id": doc.id,
                    "title": data.get("title", "Similar Issue"),
                    "distance_meters": round(dist),
                    "status": data.get("status"),
                    "votes": data.get("votes", 0),
                    "created_at": str(data.get("created_at", "")),
                    "image_url": data.get("image_url", "")
                })

        if nearby:
            return {
                "has_duplicate": True,
                "nearby_issues": sorted(nearby, key=lambda x: x["distance_meters"]),
                "message": f"Found {len(nearby)} similar issue(s) reported within {int(radius_meters)}m"
            }

        return {"has_duplicate": False, "nearby_issues": []}

    except Exception as e:
        return {"has_duplicate": False, "nearby_issues": [], "error": str(e)}