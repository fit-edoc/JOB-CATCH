import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Reviewed", "Interview", "Offer", "Rejected", "Hired"],
      default: "Applied",
    },
    matchScore: {
      type: Number,
      default: 0,
    },
    matchExplanation: {
      type: String,
      default: "",
    },
    resumeAnalysis: {
      atsScore: { type: Number, default: 0 },
      strengths: { type: [String], default: [] },
      weaknesses: { type: [String], default: [] },
      missingSkills: { type: [String], default: [] },
      summary: { type: String, default: "" },
      interviewReadiness: { type: String, default: "Medium" },
      improvementSuggestions: { type: [String], default: [] },
    },
    aiInterview: {
      status: { type: String, enum: ["pending", "completed"], default: "pending" },
      questions: { type: [String], default: [] },
      answers: { type: [String], default: [] },
      evaluation: {
        communication: { type: Number, default: 0 },
        confidence: { type: Number, default: 0 },
        technical: { type: Number, default: 0 },
        summary: { type: String, default: "" },
      },
    },
    videoIntro: {
      videoUrl: { type: String, default: "" },
      summary: { type: String, default: "" },
    },
    redFlags: { type: [String], default: [] },
    referral: {
      referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
      rewardClaimed: { type: Boolean, default: false },
    },
    notes: [
      {
        content: { type: String, required: true },
        author: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    timeline: [
      {
        stage: { type: String, required: true },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Prevent duplicate applications by same candidate for same job
applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
