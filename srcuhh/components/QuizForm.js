import React, { useState } from "react";
import axios from "axios";
import { quizConfig } from "../quizConfig";

function QuizForm() {
  const [answers, setAnswers] = useState({});

  const handleChange = (id, value, type) => {
    setAnswers((prev) => {
      if (type === "checkbox") {
        const current = new Set(prev[id] || []);
        current.has(value) ? current.delete(value) : current.add(value);
        return { ...prev, [id]: Array.from(current) };
      }
      return { ...prev, [id]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/design-preferences", {
        userId: "mock-user-id",
        quizAnswers: answers
      });
      alert("Submission successful!");
    } catch (err) {
      console.error(err);
      alert("Submission failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {quizConfig.map((q) => (
        <div key={q.id} style={{ marginBottom: "1rem" }}>
          <label><strong>{q.label}</strong></label><br />
          {q.type === "text" || q.type === "email" ? (
            <input type={q.type} onChange={(e) => handleChange(q.id, e.target.value, q.type)} />
          ) : q.type === "textarea" ? (
            <textarea onChange={(e) => handleChange(q.id, e.target.value, q.type)} />
          ) : q.type === "dropdown" ? (
            <select onChange={(e) => handleChange(q.id, e.target.value, q.type)}>
              <option value="">-- select --</option>
              {q.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : q.type === "radio" ? (
            q.options.map((opt) => (
              <label key={opt}>
                <input
                  type="radio"
                  name={q.id}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={() => handleChange(q.id, opt, q.type)}
                /> {opt}
              </label>
            ))
          ) : q.type === "checkbox" ? (
            q.options.map((opt) => (
              <label key={opt} style={{ display: "block" }}>
                <input
                  type="checkbox"
                  value={opt}
                  checked={(answers[q.id] || []).includes(opt)}
                  onChange={() => handleChange(q.id, opt, q.type)}
                /> {opt}
              </label>
            ))
          ) : null}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}

export default QuizForm;
