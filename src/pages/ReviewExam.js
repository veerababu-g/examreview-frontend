import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import "../style.css";

export default function ReviewExam() {
  const { courseId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/review/exams/${courseId}`);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load this exam");
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId]);

  return (
    <div className="app-shell">
      <Navbar />
      <div className="page">
        <Link to="/exams" className="back-link">← Back to my exams</Link>

        {loading ? (
          <p>Loading…</p>
        ) : error ? (
          <div className="empty-state">{error}</div>
        ) : (
          <>
            <div className="exam-header">
              <div>
                <h2 style={{ margin: 0 }}>{data.course.title}</h2>
                <div className="meta">Training duration: {data.course.trainingHours} hours</div>
              </div>
              <div className="score-pill">
                {data.score} / {data.totalQuestions}
              </div>
            </div>

            {data.showCorrect && (
              <div className="legend">
                <span><i className="dot dot-correct" /> Correct</span>
                <span><i className="dot dot-wrong" /> Your wrong answer</span>
                <span><i className="dot dot-key" /> Right answer</span>
              </div>
            )}

            {data.questions.map((q, i) => {
              const unanswered = q.selectedOptionIndex === null;
              return (
                <div className="q-card" key={q.id}>
                  <div className="q-index">
                    Question {i + 1}
                    {data.showCorrect && (
                      <span className={`verdict ${q.isCorrect ? "ok" : "bad"}`}>
                        {q.isCorrect ? "Correct" : unanswered ? "Not answered" : "Incorrect"}
                      </span>
                    )}
                  </div>
                  <p className="q-text">{q.questionText}</p>

                  {q.options.map((opt, idx) => {
                    const isYours = q.selectedOptionIndex === idx;
                    const isKey = data.showCorrect && q.correctOptionIndex === idx;
                    let cls = "review-row";
                    if (isYours && data.showCorrect) cls += q.isCorrect ? " r-correct" : " r-wrong";
                    else if (isYours) cls += " r-yours";
                    else if (isKey) cls += " r-key";
                    return (
                      <div key={idx} className={cls}>
                        <span className="letter">{String.fromCharCode(65 + idx)}</span>
                        <span className="option-text">{opt}</span>
                        {isYours && <span className="tag tag-yours">Your answer</span>}
                        {isKey && !isYours && <span className="tag tag-key">Right answer</span>}
                      </div>
                    );
                  })}
                  {unanswered && <div className="meta">You did not answer this question.</div>}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
