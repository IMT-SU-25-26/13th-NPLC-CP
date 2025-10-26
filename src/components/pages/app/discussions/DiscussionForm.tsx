"use client";

import { useState } from "react";
import { createDiscussion } from "@/services/discussion";

export default function DiscussionForm() {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!title.trim() || !question.trim()) {
      alert("Please fill in both title and question");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("question", question.trim());

      await createDiscussion(formData);
      setTitle("");
      setQuestion("");
    } catch (error) {
      console.error("Error creating discussion:", error);
      alert("Failed to create discussion. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative z-[50] w-full bg-[#18182a]/80 border-2 border-[#FCF551] rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] mb-4">
        Ask a Question
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-[#0a0a1a]/80 border border-[#FCF551]/50 rounded-md text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] focus:outline-none focus:border-[#FCF551] transition-colors"
            placeholder="Enter your question title..."
            disabled={isSubmitting}
            required
          />
        </div>
        <div>
          <label
            htmlFor="question"
            className="block text-sm font-medium text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] mb-2"
          >
            Question
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 bg-[#0a0a1a]/80 border border-[#FCF551]/50 rounded-md text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] focus:outline-none focus:border-[#FCF551] transition-colors resize-none"
            placeholder="Enter your question details..."
            disabled={isSubmitting}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-[#FCF551] text-[#18182a] font-bold rounded-md cursor-pointer hover:bg-[#FCF551]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Posting..." : "Post Question"}
        </button>
      </form>
    </div>
  );
}
