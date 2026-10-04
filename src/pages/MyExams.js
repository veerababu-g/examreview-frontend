import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getProfile } from "../api";
import Navbar from "../components/Navbar";
import "../style.css";

function fmtDate(d) {
  return d ? new Date(d).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "";
}

export default function MyExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const profile = getProfile();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/review/exams");
        setExams(data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("review_token");
          navigate("/login");
          return;
        }
        setError(err.response?.data?.message || "Failed to load your exams");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page">
        <div className="section-head">
          <div>
            <h2>Welcome, {profile.name}</h2>
            <p>These are the exams you have submitted. Open one to see the answers you gave.</p>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <p>Loading…</p>
        ) : exams.length === 0 ? (
          <div className="empty-state">You haven't submitted any exams yet.</div>
        ) : (
          <div className="grid">
            {exams.map((e) => {
              const pct = e.totalQuestions ? Math.round((e.score / e.totalQuestions) * 100) : 0;
              return (
                <div className="card course-card" key={e.courseId}>
                  <span className="hours-tag">{e.trainingHours} training hrs</span>
                  <h3>{e.title}</h3>
                  <p>Submitted {fmtDate(e.submittedAt)}</p>
                  <div className="row">
                    <span className="status-chip done">
                      Score {e.score}/{e.totalQuestions} · {pct}%
                    </span>
                  </div>
                  <button className="btn btn-primary" onClick={() => navigate(`/exams/${e.courseId}`)}>
                    Show my answers
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
