"use client";

import { useState } from "react";
import { createReply } from "@/services/discussion";

interface ReplyFormProps {
  discussionId: string;
}

export default function ReplyForm({ discussionId }: ReplyFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("Please enter a reply");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("content", content.trim());
      formData.append("discussionId", discussionId);

      await createReply(formData);
      setContent("");
    } catch (error) {
      console.error("Error posting reply:", error);
      alert("Failed to post reply. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-3 mt-2">
      <div className="flex-1">
        <textarea
          placeholder="Write a reply..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
          className="w-full bg-transparent border border-[#3f3f61] rounded-md p-2 text-sm text-white placeholder:text-[#9fb7bd] resize-none h-20 focus:outline-none focus:border-[#FCF551] transition-colors"
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="bg-[#FCF551] text-black px-4 py-1 rounded-md font-semibold hover:bg-[#FCF551]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Posting..." : "Reply"}
          </button>
        </div>
      </div>
    </form>
  );
}
