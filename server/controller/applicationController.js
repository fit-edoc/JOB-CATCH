import applicationModel from "../model/applicationModel.js";
import jobModel from "../model/jobModel.js";
import userModel from "../model/userModel.js";
import { generateJSON } from "../utils/gemini.js";

/**
 * Quick Apply to a Job & Generate AI Match Score
 */
export const applyJobController = async (req, res) => {
  try {
    const { jobId } = req.body;
    const candidateId = req.user.userId;

    if (req.user.role !== "seeker") {
      return res.status(403).json({ success: false, message: "Only job seekers can apply for jobs" });
    }

    // Check if job exists
    const job = await jobModel.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Check duplicate application
    const existingApp = await applicationModel.findOne({ jobId, candidateId });
    if (existingApp) {
      return res.status(400).json({ success: false, message: "You have already applied to this job" });
    }

    // Fetch candidate details
    const candidate = await userModel.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate profile not found" });
    }

    // Calculate AI Match Score and Resume Analysis using Gemini
    let matchScore = 50;
    let matchExplanation = "Generated baseline match score based on initial profile details.";
    let resumeAnalysis = {
      atsScore: 50,
      strengths: ["Relevant technical foundation."],
      weaknesses: ["Missing specific details on past projects."],
      missingSkills: [],
      summary: "Candidate has general experience matching the basic requirements.",
      interviewReadiness: "Medium",
      improvementSuggestions: ["Highlight projects that use skills listed in the job description."]
    };

    try {
      const prompt = `
        You are an expert technical recruiter and ATS (Applicant Tracking System) reviewer. 
        Compare the candidate's profile and resume details against the job requirements.
        
        JOB DETAILS:
        Position: ${job.position}
        Company: ${job.company}
        Work Type: ${job.workType}
        Salary Range: Min ₹${job.salary?.min || 0} - Max ₹${job.salary?.max || 0}
        Location: ${job.workLocation}
        
        CANDIDATE PROFILE:
        Name: ${candidate.name} ${candidate.lastname || ""}
        Bio: ${candidate.bio || "No bio details"}
        Skills: ${candidate.skills ? candidate.skills.join(", ") : "None specified"}
        Location: ${candidate.location || "India"}
        Desired Salary: ₹${candidate.desiredSalary || 0}
        Experience: ${JSON.stringify(candidate.experience || [])}
        Projects: ${JSON.stringify(candidate.projects || [])}
        Education: ${JSON.stringify(candidate.education || [])}
        Certifications: ${JSON.stringify(candidate.certifications || [])}
        Raw Resume Text: ${candidate.resumeText || "No raw resume text provided"}
        
        Tasks:
        1. Calculate a Match Percentage (0 to 100) based on how well they fit the role.
        2. Provide a concise 2-3 sentence match explanation.
        3. Extract any candidate resume red flags (e.g. employment gaps, frequent job hopping, title mismatch).
        4. Perform an ATS Resume Analysis:
           - atsScore: number (0-100)
           - strengths: array of 3 strings (candidate's main strengths for this job)
           - weaknesses: array of 2 strings (candidate's weak points for this job)
           - missingSkills: array of strings (required skills/keywords missing from candidate's profile)
           - summary: 2-3 sentences summarizing qualifications for this job
           - interviewReadiness: string ("Low", "Medium", or "High")
           - improvementSuggestions: array of 3 strings (actionable steps to enhance the resume for this job)
        
        Your response must be JSON formatted exactly as:
        {
          "matchScore": number,
          "matchExplanation": "string",
          "redFlags": ["string"],
          "resumeAnalysis": {
            "atsScore": number,
            "strengths": ["string"],
            "weaknesses": ["string"],
            "missingSkills": ["string"],
            "summary": "string",
            "interviewReadiness": "Low" | "Medium" | "High",
            "improvementSuggestions": ["string"]
          }
        }
      `;
 
      const aiResponse = await generateJSON(prompt);
      if (aiResponse) {
        if (typeof aiResponse.matchScore === "number") {
          matchScore = aiResponse.matchScore;
        }
        if (aiResponse.matchExplanation || aiResponse.explanation) {
          matchExplanation = aiResponse.matchExplanation || aiResponse.explanation;
        }
        if (aiResponse.resumeAnalysis) {
          resumeAnalysis = {
            ...resumeAnalysis,
            ...aiResponse.resumeAnalysis
          };
        }
        if (aiResponse.redFlags && Array.isArray(aiResponse.redFlags)) {
          req.body.redFlags = aiResponse.redFlags;
        }
      }
    } catch (aiErr) {
      console.error("AI Match & Resume Analysis Generation failed, using default:", aiErr);
    }
 
    const referral = {};
    if (req.body.referredBy) {
      referral.referredBy = req.body.referredBy;
    }

    // Create application
    const application = await applicationModel.create({
      jobId,
      candidateId,
      matchScore,
      matchExplanation,
      resumeAnalysis,
      redFlags: req.body.redFlags || [],
      referral,
      timeline: [{ stage: "Applied" }]
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error submitting application", error: error.message });
  }
};

/**
 * Get Applications for Seeker
 */
export const getSeekerApplicationsController = async (req, res) => {
  try {
    const candidateId = req.user.userId;
    const applications = await applicationModel.find({ candidateId }).populate("jobId");
    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching applications" });
  }
};

/**
 * Get Applications for a specific Job (Employer)
 */
export const getJobApplicationsController = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Make sure employer owns the job
    const job = await jobModel.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: "Not authorized to view applicants for this job" });
    }

    const applications = await applicationModel.find({ jobId }).populate("candidateId");
    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching job applications" });
  }
};

/**
 * Update Application Status (CRM pipeline update)
 */
export const updateApplicationStatusController = async (req, res) => {
  try {
    const { id } = req.params; // Application ID
    const { status } = req.body; // Applied, Reviewed, Interview, Offer, Rejected, Hired

    const validStages = ["Applied", "Reviewed", "Interview", "Offer", "Rejected", "Hired"];
    if (!validStages.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid application status stage" });
    }

    const application = await applicationModel.findById(id).populate("jobId");
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Verify current user is the employer who created the job
    if (application.jobId.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: "Not authorized to update status" });
    }

    application.status = status;
    application.timeline.push({ stage: status });
    await application.save();

    res.status(200).json({ success: true, message: "Application status updated successfully", application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating status" });
  }
};
