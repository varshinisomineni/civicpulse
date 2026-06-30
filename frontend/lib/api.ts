const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function analyzeImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_URL}/api/issues/analyze`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function checkDuplicate(lat: number, lng: number, issueType: string) {
  const formData = new FormData();
  formData.append("lat", lat.toString());
  formData.append("lng", lng.toString());
  formData.append("issue_type", issueType);
  const res = await fetch(`${API_URL}/api/issues/check-duplicate`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function submitIssue(data: {
  title: string;
  description: string;
  issue_type: string;
  severity: string;
  lat: number;
  lng: number;
  address?: string;
  user_id?: string;
  user_name?: string;
  image_url?: string;
  ai_analysis?: object;
}) {
  const formData = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    formData.append(k, typeof v === "object" ? JSON.stringify(v) : String(v ?? ""));
  });
  const res = await fetch(`${API_URL}/api/issues/submit`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function getIssues(params?: { status?: string; issue_type?: string }) {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  const res = await fetch(`${API_URL}/api/issues?${query}`);
  return res.json();
}

export async function getIssue(id: string) {
  const res = await fetch(`${API_URL}/api/issues/${id}`);
  return res.json();
}

export async function voteIssue(id: string) {
  const formData = new FormData();
  formData.append("user_id", "user");
  const res = await fetch(`${API_URL}/api/issues/${id}/vote`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function addComment(id: string, comment: string, userName: string) {
  const formData = new FormData();
  formData.append("comment", comment);
  formData.append("user_name", userName);
  const res = await fetch(`${API_URL}/api/issues/${id}/comment`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function updateStatus(id: string, status: string, note?: string) {
  const formData = new FormData();
  formData.append("status", status);
  formData.append("note", note || "");
  const res = await fetch(`${API_URL}/api/issues/${id}/status`, {
    method: "PATCH",
    body: formData,
  });
  return res.json();
}

export async function getSummary() {
  const res = await fetch(`${API_URL}/api/analytics/summary`);
  return res.json();
}

export async function getLeaderboard() {
  const res = await fetch(`${API_URL}/api/analytics/leaderboard`);
  return res.json();
}

export async function getCommunityInsights() {
  const res = await fetch(`${API_URL}/api/issues/insights/community`);
  return res.json();
}