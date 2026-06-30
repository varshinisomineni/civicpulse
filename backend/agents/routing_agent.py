"""
Routing Agent
Automatically determines which government department should handle a reported issue,
based on the issue type detected by the Vision Agent.
"""

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

DEPARTMENT_CONTACT_INFO = {
    "Road Maintenance": {"avg_response_time": "3-5 days", "priority_handling": True},
    "Sanitation Department": {"avg_response_time": "1-2 days", "priority_handling": True},
    "Water Supply Department": {"avg_response_time": "1 day", "priority_handling": True},
    "Drainage Authority": {"avg_response_time": "2-4 days", "priority_handling": True},
    "Electrical Department": {"avg_response_time": "1-3 days", "priority_handling": True},
    "Parks & Recreation": {"avg_response_time": "3-7 days", "priority_handling": False},
    "Municipal Corporation": {"avg_response_time": "5-7 days", "priority_handling": False},
}


def route_issue(issue_type: str, severity: str = "low") -> dict:
    """
    Determine the responsible department for a given issue type.
    Critical/high severity issues are flagged for priority handling.
    """
    department = DEPARTMENT_MAP.get(issue_type, "Municipal Corporation")
    info = DEPARTMENT_CONTACT_INFO.get(department, {})

    is_urgent = severity in ("critical", "high")

    return {
        "department": department,
        "avg_response_time": info.get("avg_response_time", "5-7 days"),
        "priority_handling_available": info.get("priority_handling", False),
        "flagged_urgent": is_urgent,
        "routing_note": (
            f"Routed to {department} with URGENT flag due to {severity} severity."
            if is_urgent
            else f"Routed to {department} for standard processing."
        ),
    }


def get_department_workload(db, department: str) -> int:
    """
    Count how many open issues a department currently has assigned.
    Useful for load-balancing insights on the admin dashboard.
    """
    try:
        docs = db.collection("issues").where("recommended_department", "==", department).where(
            "status", "in", ["reported", "verified", "assigned", "in_progress"]
        ).stream()
        return len(list(docs))
    except Exception:
        return 0