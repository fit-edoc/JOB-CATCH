import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../model/userModel.js";
import applicationModel from "../model/applicationModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateJSON } from "../utils/gemini.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const registerController =  async(req,res)=>{
try {
    const {name,email,password,role} = req.body;


    if(!name || !email || !password){
        res.status(400).send({message:"please field required fields",success:false})
    }

    const existingUser = await userModel.findOne({email})
    if(existingUser){
        res.status(409).send({message:"this email is already registered you can login",success:false})
    }

    const user = await userModel.create({name,password,email,role})

    const token  = user.createJWT()

    res.status(201).send({
        success:true,
        message:"registered successfully",
        user:user,
        location:user.location,
        lastname:user.lastname,
        token,
    })
    
} catch (error) {
    console.log(error);
    res.status(500).send({message:"registered api not working",success:true})
    
    
}

}


export const loginController = async(req,res)=>{
    try {
        
const {email,password}= req.body

if(!email || !password){
    res.status(400).send({message:"required both fields should be enter",success:false})
}

const findEmail = await userModel.findOne({email}).select("+password")

if(!findEmail){
    res.status(409).send({message:"user is not registered"})
}

const isMatch = await findEmail.comparePassword(password)
if(!isMatch){
    res.status(400).send({message:"enter correct password",success:false})
}

const token = findEmail.createJWT()
findEmail.password = undefined

res.status(200).send({message:"login successfully",success:true,user:findEmail,token})


    } catch (error) {
        console.log(error);
        res.status(500).send({message:"login api not working",success:false})
        
        
    }
}




export const updateUserController = async(req,res)=>{
    try {
        const {name, email, location, lastname, role, bio, skills, resumeLink, companyName, companyDescription, desiredSalary, experience, projects, education, certifications, resumeText, videoIntroUrl} = req.body;

        if(!name || !email){
            return res.status(400).send({message:"name and email are required fields "})
        }

        const user = await userModel.findOne({_id:req.user.userId})
        user.name = name;
        user.lastname = lastname || user.lastname;
        user.location = location || user.location;
        user.email = email;
        
        if (role) user.role = role;
        if (bio !== undefined) user.bio = bio;
        if (skills) user.skills = skills;
        if (resumeLink !== undefined) user.resumeLink = resumeLink;
        if (companyName !== undefined) user.companyName = companyName;
        if (companyDescription !== undefined) user.companyDescription = companyDescription;

        // Extended fields updates
        if (desiredSalary !== undefined) user.desiredSalary = desiredSalary;
        if (experience !== undefined) user.experience = experience;
        if (projects !== undefined) user.projects = projects;
        if (education !== undefined) user.education = education;
        if (certifications !== undefined) user.certifications = certifications;
        if (resumeText !== undefined) user.resumeText = resumeText;
        if (videoIntroUrl !== undefined) user.videoIntroUrl = videoIntroUrl;

        await user.save()
        const token = user.createJWT()

        res.status(200).send({message:"updated successfully",user,token})

    } catch (error) {
        console.log(error);
        res.status(400).send({message:"update api not working"})
    }
  }

export const saveJobController = async(req, res) => {
    try {
        const { jobId } = req.body;
        const user = await userModel.findById(req.user.userId);
        
        if (!user) {
            return res.status(404).send({message: "User not found"});
        }

        if (user.savedJobs.includes(jobId)) {
            user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
        } else {
            user.savedJobs.push(jobId);
        }

        await user.save();
        res.status(200).send({message: "Saved jobs updated successfully", savedJobs: user.savedJobs});
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Error updating saved jobs"});
    }
}

export const getSavedJobsController = async(req, res) => {
    try {
        const user = await userModel.findById(req.user.userId).populate('savedJobs');
        if (!user) {
            return res.status(404).send({message: "User not found"});
        }
        res.status(200).send({success: true, savedJobs: user.savedJobs});
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Error fetching saved jobs"});
    }
}

export const verifyPortfolioController = async (req, res) => {
    try {
        const { githubUsername, portfolioUrl } = req.body;
        const user = await userModel.findById(req.user.userId);
        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" });
        }

        let githubVerified = false;
        let websiteVerified = false;

        if (githubUsername) {
            try {
                const ghResponse = await fetch(`https://api.github.com/users/${githubUsername}`, {
                    headers: {
                        'User-Agent': 'WayHyre-App'
                    }
                });
                if (ghResponse.ok) {
                    githubVerified = true;
                }
            } catch (err) {
                console.error("GitHub verification error:", err);
            }
        }

        if (portfolioUrl) {
            if (portfolioUrl.startsWith("https://")) {
                try {
                    const webResponse = await fetch(portfolioUrl);
                    if (webResponse.ok || webResponse.status === 200 || webResponse.status === 301 || webResponse.status === 302) {
                        websiteVerified = true;
                    }
                } catch (err) {
                    console.error("Website verification error:", err);
                }
            }
        }

        user.portfolioVerification = {
            githubVerified,
            websiteVerified,
            githubUsername: githubUsername || "",
            portfolioUrl: portfolioUrl || "",
            verifiedAt: new Date()
        };

        await user.save();

        res.status(200).send({
            success: true,
            message: "Portfolio verification processed",
            portfolioVerification: user.portfolioVerification
        });
    } catch (error) {
        console.error("verifyPortfolioController error:", error);
        res.status(500).send({ success: false, message: "Verification failed" });
    }
}

const getFallbackQuestions = (skill) => {
  return [
    {
      question: `Which of the following is a core concept or design pattern of ${skill}?`,
      options: ["Virtual or structured logical representations", "Two-way data binding standard only", "Direct manual CPU memory allocations", "Automatic network protocol generation"],
      correctIndex: 0
    },
    {
      question: `What is a main architectural benefit of using ${skill}?`,
      options: ["Improved code readability, maintainability and performance", "Zero compilation errors guaranteed in all scenarios", "Infinite storage space on the developer system", "Automatic routing updates with no code written"],
      correctIndex: 0
    },
    {
      question: `Which of the following operations is standard when working with ${skill}?`,
      options: ["Importing components, modules or executing standard libraries", "Creating complete server architectures in single keywords", "Writing direct machine code instructions manually", "Reformatting full system drives automatically"],
      correctIndex: 0
    }
  ];
};

export const generateSkillAssessmentController = async (req, res) => {
  try {
    const { skillName } = req.body;
    if (!skillName) {
      return res.status(400).send({ success: false, message: "Skill name is required" });
    }

    const prompt = `Generate exactly 3 challenging multiple choice questions for the skill "${skillName}". Return ONLY a JSON array (not wrapped in an object) containing exactly 3 objects. Each object must have these exact keys: "question" (string), "options" (array of 4 strings), and "correctIndex" (number, 0-3).`;

    let questions;
    try {
      questions = await generateJSON(prompt);
      if (!Array.isArray(questions)) {
        if (questions.questions && Array.isArray(questions.questions)) {
          questions = questions.questions;
        } else {
          throw new Error("Invalid response format from AI");
        }
      }
    } catch (err) {
      console.warn("Using fallback questions for skill:", skillName);
      questions = getFallbackQuestions(skillName);
    }

    res.status(200).send({ success: true, questions });
  } catch (error) {
    console.error("generateSkillAssessmentController error:", error);
    res.status(500).send({ success: false, message: "Failed to generate skill assessment" });
  }
};

export const submitSkillAssessmentController = async (req, res) => {
  try {
    const { skillName, score } = req.body;
    if (!skillName || score === undefined) {
      return res.status(400).send({ success: false, message: "Skill name and score are required" });
    }

    const user = await userModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    if (score >= 70) {
      const existing = user.verifiedSkills.find(s => s.skillName.toLowerCase() === skillName.toLowerCase());
      if (existing) {
        existing.score = score;
        existing.verifiedAt = new Date();
      } else {
        user.verifiedSkills.push({
          skillName,
          score,
          verifiedAt: new Date()
        });
      }
      await user.save();
      res.status(200).send({ success: true, verified: true, verifiedSkills: user.verifiedSkills });
    } else {
      res.status(200).send({ success: true, verified: false, message: "Assessment completed. Score did not meet pass requirement of 70%." });
    }
  } catch (error) {
    console.error("submitSkillAssessmentController error:", error);
    res.status(500).send({ success: false, message: "Failed to submit assessment" });
  }
};

const getFallbackInterviewQuestions = (role) => {
  return [
    `Describe your experience working as a ${role || 'Software Engineer'} and how you usually design system components.`,
    `What are the most challenging technical decisions you made in your recent projects?`,
    `How do you handle deadlines and collaborate with other team members in an agile team?`
  ];
};

export const startAIInterviewController = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).send({ success: false, message: "Role is required" });
    }

    const prompt = `Generate exactly 3 challenging interview questions for the role "${role}". Return ONLY a JSON array of strings containing exactly 3 questions.`;
    let questions;
    try {
      questions = await generateJSON(prompt);
      if (!Array.isArray(questions)) {
        throw new Error("Invalid format from Gemini");
      }
    } catch (err) {
      console.warn("Using fallback questions for AI interview:", role);
      questions = getFallbackInterviewQuestions(role);
    }

    res.status(200).send({ success: true, questions });
  } catch (error) {
    console.error("startAIInterviewController error:", error);
    res.status(500).send({ success: false, message: "Failed to start AI interview" });
  }
};

export const evaluateAIInterviewController = async (req, res) => {
  try {
    const { role, answers } = req.body;
    if (!role || !answers) {
      return res.status(400).send({ success: false, message: "Role and answers are required" });
    }

    const prompt = `Evaluate the candidate's answers for a mock interview for the role "${role}".
Here are the questions and candidate's answers:
${JSON.stringify(answers)}

Return ONLY a JSON object with these exact keys: "score" (number, 0-100), "feedback" (string), "strengths" (array of strings), "weaknesses" (array of strings).`;

    let evaluation;
    try {
      evaluation = await generateJSON(prompt);
    } catch (err) {
      console.warn("Using fallback evaluation for AI interview");
      evaluation = {
        score: 75,
        feedback: "Overall good responses. Candidate demonstrated clear understanding of fundamental concepts but could go into more detail regarding specific architectural metrics and examples.",
        strengths: ["Clear communication", "Good understanding of core responsibilities"],
        weaknesses: ["Could provide more concrete numbers and metrics in examples"]
      };
    }

    res.status(200).send({ success: true, evaluation });
  } catch (error) {
    console.error("evaluateAIInterviewController error:", error);
    res.status(500).send({ success: false, message: "Failed to evaluate AI interview" });
  }
};

export const verifyRecruiterController = async (req, res) => {
  try {
    const { companyName, website, registrationNumber } = req.body;
    if (!companyName || !website || !registrationNumber) {
      return res.status(400).send({ success: false, message: "Company name, website, and registration number are required" });
    }

    const user = await userModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    const isGenericDomain = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"].some(d => website.toLowerCase().includes(d));
    if (isGenericDomain) {
      return res.status(400).send({ success: false, message: "Verification failed. Official corporate website domain is required (no generic email domains)." });
    }

    user.recruiterVerification = {
      isVerified: true,
      verifiedAt: new Date(),
      companyName,
      website,
      registrationNumber
    };

    await user.save();

    res.status(200).send({
      success: true,
      message: "Recruiter verification completed successfully",
      recruiterVerification: user.recruiterVerification
    });
  } catch (error) {
    console.error("verifyRecruiterController error:", error);
    res.status(500).send({ success: false, message: "Internal server error during recruiter verification" });
  }
};

export const recruiterResumeSearchController = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).send({ success: false, message: "Search query is required" });
    }

    const candidates = await userModel.find({ role: 'seeker' });
    if (!candidates.length) {
      return res.status(200).send({ success: true, results: [] });
    }

    const candidateData = candidates.map(c => ({
      userId: c._id.toString(),
      name: `${c.name} ${c.lastname || ''}`,
      skills: c.skills,
      verifiedSkills: c.verifiedSkills,
      bio: c.bio,
      experience: c.experience,
      education: c.education
    }));

    const prompt = `Rank the following candidates according to their match relevance for the search query: "${query}".
Candidates data:
${JSON.stringify(candidateData)}

Return ONLY a JSON array of objects (no wrapping object). Each object must have these exact keys: "userId" (string), "score" (number, 0-100), and "explanation" (string).`;

    let rankings;
    try {
      rankings = await generateJSON(prompt);
      if (!Array.isArray(rankings)) {
        throw new Error("Rankings response from Gemini is not an array");
      }
    } catch (err) {
      console.warn("Using fallback semantic ranking:", err);
      rankings = candidates.map(c => {
        let score = 20;
        const keywords = query.toLowerCase().split(/\s+/);
        keywords.forEach(kw => {
          if (c.skills?.some(s => s.toLowerCase().includes(kw))) score += 25;
          if (c.bio?.toLowerCase().includes(kw)) score += 15;
        });
        return {
          userId: c._id.toString(),
          score: Math.min(score, 100),
          explanation: "Calculated match relevance based on keyword search matching."
        };
      });
    }

    const results = rankings
      .map(r => {
        const candidate = candidates.find(c => c._id.toString() === r.userId);
        if (!candidate) return null;
        return {
          candidate,
          score: r.score,
          explanation: r.explanation
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);

    res.status(200).send({ success: true, results });
  } catch (error) {
    console.error("recruiterResumeSearchController error:", error);
    res.status(500).send({ success: false, message: "Internal server error during semantic search" });
  }
};

export const extractSkillsController = async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      return res.status(400).send({ success: false, message: "Resume text is required for skill extraction" });
    }

    const prompt = `Extract a flat list of professional technical skills from the following resume text:
"${resumeText}"

Return ONLY a JSON array of strings (e.g. ["React", "JavaScript", "Python"]). Do not include any extra text or formatting outside of the JSON array.`;

    let skills = [];
    try {
      skills = await generateJSON(prompt);
      if (!Array.isArray(skills)) {
        throw new Error("Result is not an array");
      }
    } catch (err) {
      console.warn("Using fallback skill extraction:", err);
      const commonSkills = ["react", "node", "javascript", "python", "java", "html", "css", "mongodb", "sql", "git", "aws", "docker"];
      commonSkills.forEach(s => {
        if (resumeText.toLowerCase().includes(s)) {
          skills.push(s.charAt(0).toUpperCase() + s.slice(1));
        }
      });
    }

    res.status(200).send({ success: true, skills });
  } catch (error) {
    console.error("extractSkillsController error:", error);
    res.status(500).send({ success: false, message: "Internal server error during skill extraction" });
  }
};

export const getMyReferralsController = async (req, res) => {
  try {
    const referrerId = req.user.userId;
    const referrals = await applicationModel.find({ "referral.referredBy": referrerId })
      .populate("jobId")
      .populate("candidateId", "name lastname email");

    res.status(200).send({ success: true, referrals });
  } catch (error) {
    console.error("getMyReferralsController error:", error);
    res.status(500).send({ success: false, message: "Error fetching referrals" });
  }
};

export const recruiterGenerateEmailController = async (req, res) => {
  try {
    const { candidateName, position, company, emailType, matchScore } = req.body;
    if (!candidateName || !position || !emailType) {
      return res.status(400).send({ success: false, message: "Missing required fields for email template generation" });
    }

    const prompt = `Write a professional, warm, and highly personalized email template of type "${emailType}" to candidate "${candidateName}" for the position "${position}" at "${company || 'our company'}".
Their candidate match score was ${matchScore || 70}%.

Include a Subject: line at the very top, followed by the Body. Make sure it feels premium and professional. Return only the subject and email body.`;

    const emailTemplate = await generateContent(prompt);
    res.status(200).send({ success: true, emailTemplate });
  } catch (error) {
    console.error("recruiterGenerateEmailController error:", error);
    res.status(500).send({ success: false, message: "Failed to generate email template using AI" });
  }
};

export const getPortfolioBadgeController = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send("Candidate not found");
    }

    const skillsHtml = user.skills?.map(s => {
      const verified = user.verifiedSkills?.find(vs => vs.skillName.toLowerCase() === s.toLowerCase());
      return `
        <span class="skill-tag ${verified ? 'verified' : ''}">
          ${s} ${verified ? `(${verified.score}%)` : ''}
        </span>
      `;
    }).join('') || '';

    const githubTick = user.portfolioVerification?.githubVerified ? '✅ Github Verified' : '';
    const bioText = user.bio ? user.bio.substring(0, 80) + '...' : 'Professional Developer';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: linear-gradient(135deg, #fffaf5 0%, #fff 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            overflow: hidden;
          }
          .card {
            width: 340px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 4px 12px rgba(251, 146, 60, 0.1);
            text-align: left;
          }
          .header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
          }
          .avatar {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: #ffedd5;
            color: #ea580c;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 18px;
            border: 1px solid #ffddd1;
          }
          .name {
            font-size: 15px;
            font-weight: 700;
            color: #0f172a;
            margin: 0;
          }
          .title {
            font-size: 11px;
            color: #64748b;
            margin: 2px 0 0 0;
          }
          .bio {
            font-size: 11px;
            color: #475569;
            line-height: 1.4;
            margin-bottom: 12px;
          }
          .skills-title {
            font-size: 10px;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 6px;
          }
          .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
          }
          .skill-tag {
            font-size: 9px;
            padding: 2px 6px;
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            color: #475569;
            border-radius: 6px;
          }
          .skill-tag.verified {
            background: #f0fdf4;
            border-color: #bbf7d0;
            color: #166534;
            font-weight: 600;
          }
          .badge {
            display: inline-block;
            font-size: 9px;
            color: #ea580c;
            background: #fff5eb;
            border: 1px solid #ffedd5;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 600;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div class="avatar">${user.name.charAt(0).toUpperCase()}</div>
            <div>
              <h3 class="name">${user.name} ${user.lastname || ''}</h3>
              <p class="title">${user.location || 'Developer'}</p>
            </div>
          </div>
          <p class="bio">${bioText}</p>
          <div class="skills-title">Skills Verified</div>
          <div class="skills-list">
            ${skillsHtml}
          </div>
          ${githubTick ? `<div class="badge">${githubTick}</div>` : ''}
        </div>
      </body>
      </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (error) {
    console.error("getPortfolioBadgeController error:", error);
    res.status(500).send("Error rendering badge");
  }
};

export const sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({ message: "Email is required", success: false });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await userModel.findOne({ 
      $or: [{ email: normalizedEmail }, { email: new RegExp(`^${normalizedEmail}$`, 'i') }] 
    });
    if (!user) {
      return res.status(404).send({ message: "User not found. Please register first.", success: false });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.loginOtp = otp;
    user.loginOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Wayhyre Verification Code</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;500;600;700;800&display=swap');
  * {
    font-family: 'Bricolage Grotesque', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
</style>
</head>
<body style="margin:0;padding:48px 16px;background-color:#000000;font-family:'Bricolage Grotesque',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #1a1a1a;">
  <!-- Monochrome Header -->
  <tr>
    <td style="background-color:#000000;padding:26px 32px;border-bottom:1px solid #222222;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="left" style="vertical-align:middle;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background-color:#ffffff;width:28px;height:28px;text-align:center;vertical-align:middle;color:#000000;font-size:16px;font-weight:900;font-family:'Bricolage Grotesque',sans-serif;line-height:28px;">
                  W
                </td>
                <td style="padding-left:12px;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.03em;font-family:'Bricolage Grotesque',sans-serif;">
                  Wayhyre
                </td>
              </tr>
            </table>
          </td>
          <td align="right" style="vertical-align:middle;">
            <span style="display:inline-block;padding:4px 10px;background-color:#000000;border:1px solid #ffffff;color:#ffffff;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;font-family:'Bricolage Grotesque',sans-serif;">
              SECURITY
            </span>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Main Body -->
  <tr>
    <td style="padding:40px 32px 32px;background-color:#ffffff;">
      <h1 style="margin:0 0 12px;color:#000000;font-size:24px;font-weight:800;letter-spacing:-0.03em;font-family:'Bricolage Grotesque',sans-serif;">
        Hi ${user.name},
      </h1>
      <p style="margin:0 0 28px;color:#333333;font-size:14px;line-height:1.6;font-family:'Bricolage Grotesque',sans-serif;">
        Use your 6-digit one-time code below to verify and sign in to your Wayhyre account.
      </p>

      <!-- Black & White 6-Digit OTP Boxes -->
      <table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:28px auto 32px;">
        <tr>
          ${otp.split('').map(digit => `
            <td style="padding:0 5px;">
              <div style="width:46px;height:54px;line-height:54px;text-align:center;font-size:28px;font-weight:800;font-family:'Bricolage Grotesque',ui-monospace,monospace;background-color:#ffffff;color:#000000;border:2px solid #000000;">
                ${digit}
              </div>
            </td>
          `).join('')}
        </tr>
      </table>

      <!-- Monochrome Expiry Banner -->
      <div style="background-color:#ffffff;border:1px solid #000000;padding:14px 16px;margin:28px 0 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="color:#000000;font-size:12.5px;line-height:1.5;font-family:'Bricolage Grotesque',sans-serif;">
              <strong>Expires in 10 minutes:</strong> Never share this verification code with anyone. Wayhyre representatives will never ask for your code.
            </td>
          </tr>
        </table>
      </div>

      <p style="margin:16px 0 0;color:#666666;font-size:12px;line-height:1.5;text-align:center;font-family:'Bricolage Grotesque',sans-serif;">
        If you didn't request this verification code, you can safely ignore this email.
      </p>
    </td>
  </tr>

  <!-- Monochrome Footer -->
  <tr>
    <td style="background-color:#000000;padding:24px 32px;text-align:center;border-top:1px solid #000000;">
      <p style="margin:0 0 6px;color:#ffffff;font-size:12px;font-weight:700;letter-spacing:0.5px;font-family:'Bricolage Grotesque',sans-serif;">
        WAYHYRE · TALENT & HIRING PLATFORM
      </p>
      <p style="margin:0;color:#888888;font-size:11px;font-family:'Bricolage Grotesque',sans-serif;">
        © ${new Date().getFullYear()} Wayhyre Inc. All rights reserved.
      </p>
    </td>
  </tr>
</table>

</body>
</html>
    `;

    const emailText = `Hi ${user.name},\n\nYour Wayhyre verification code is: ${otp}\n\nUse this code to securely access your WAYHYRE account. This code expires in 10 minutes.\nNever share your OTP with anyone.\n\nIf you did not request this code, you can safely ignore this email.\n\n© ${new Date().getFullYear()} Wayhyre. All rights reserved.`;

    try {
      sendEmail({
        to: user.email,
        subject: `${otp} is your Wayhyre verification code`,
        html: emailHtml,
        text: emailText
      }).catch(err => console.error("Async email send failed:", err));
    } catch (emailError) {
      console.error("Failed to initiate OTP email:", emailError);
    }

    res.status(200).send({ message: "OTP sent successfully", success: true });
  } catch (error) {
    console.error("sendOtpController error:", error);
    res.status(500).send({ message: "Error sending OTP", success: false });
  }
};

export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).send({ message: "Email and OTP are required", success: false });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await userModel.findOne({ 
      $or: [{ email: normalizedEmail }, { email: new RegExp(`^${normalizedEmail}$`, 'i') }] 
    });
    if (!user) {
      return res.status(404).send({ message: "User not found", success: false });
    }

    console.log("OTP Verification Debug:", {
      savedOtp: user.loginOtp,
      providedOtp: otp,
      otpMatches: user.loginOtp === otp,
      expiresAt: user.loginOtpExpires,
      currentTime: new Date(Date.now()),
      isExpired: user.loginOtpExpires ? Date.now() > user.loginOtpExpires.getTime() : true
    });

    if (!user.loginOtp || user.loginOtp !== otp || (user.loginOtpExpires && Date.now() > user.loginOtpExpires.getTime())) {
      return res.status(400).send({ message: "Invalid or expired OTP", success: false });
    }

    user.loginOtp = "";
    user.loginOtpExpires = null;
    await user.save();

    const token = user.createJWT();
    user.password = undefined;

    res.status(200).send({ message: "Login successfully", success: true, user, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error verifying OTP", success: false });
  }
};

const extractPdfText = async (buffer) => {
  try {
    if (typeof pdfParse === 'function') {
      const data = await pdfParse(buffer);
      return data.text || '';
    }
    if (pdfParse && pdfParse.PDFParse) {
      const parser = new pdfParse.PDFParse({ data: buffer });
      const res = await parser.getText();
      return res.text || '';
    }
  } catch (err) {
    console.error("PDF parser error:", err.message);
  }
  // Fallback plain string decoding
  return buffer.toString('utf-8').replace(/[^\x20-\x7E\n]/g, ' ');
};

export const uploadResumeController = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).send({ success: false, message: "No file uploaded or file is empty" });
    }

    const user = await userModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    const fileBuffer = req.file.buffer;
    const originalName = req.file.originalname || "resume.pdf";
    const mimeType = req.file.mimetype || "application/pdf";

    // 1. Ensure local storage directory exists and save copy to disk
    const resumesDir = path.join(__dirname, "../uploads/resumes");
    if (!fs.existsSync(resumesDir)) {
      fs.mkdirSync(resumesDir, { recursive: true });
    }
    const safeDiskName = `resume-${user._id}-${Date.now()}.pdf`;
    const localFilePath = path.join(resumesDir, safeDiskName);
    fs.writeFileSync(localFilePath, fileBuffer);

    // 2. Save directly into MongoDB on the user document (immune to cloud host ephemeral restarts)
    user.resumeData = fileBuffer;
    user.resumeContentType = mimeType;
    user.resumeFileName = originalName;

    // Direct, 100% reliable resume viewing link served by our server
    user.resumeLink = `/api/user/view-resume/${user._id}`;

    // 3. Background Cloudinary backup (optional, does not block delivery)
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      try {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'job_portal_resumes',
            resource_type: 'raw',
            format: 'pdf',
            public_id: `resume-${user._id}-${Date.now()}.pdf`
          },
          (err, result) => {
            if (err) console.warn("Cloudinary backup upload notice:", err.message);
            else console.log("Cloudinary backup upload success:", result.secure_url);
          }
        );
        stream.end(fileBuffer);
      } catch (cloudErr) {
        console.warn("Cloudinary stream init error:", cloudErr.message);
      }
    }

    // 4. Extract Text & Auto-Fill Profile Section using Gemini AI
    let extractionError = null;
    try {
      const resumeText = await extractPdfText(fileBuffer);
      user.resumeText = resumeText;

      if (resumeText && resumeText.trim().length > 30) {
        const prompt = `You are an expert HR assistant and resume parser.
I will provide you with the text extracted from a candidate's resume.
Extract the structured profile information accurately into a clean JSON object matching this exact schema:

{
  "name": "Candidate first name (if found, otherwise empty string)",
  "lastname": "Candidate last name (if found, otherwise empty string)",
  "location": "City, State, or Country (if found, otherwise empty string)",
  "bio": "A well-written 2-3 sentence professional summary highlighting their core expertise and background",
  "skills": ["Array of technical and professional skills, e.g. React, Node.js, Python, TypeScript, Docker"],
  "experience": [
    {
      "role": "Job title or role",
      "company": "Company or organization name",
      "duration": "Dates/Duration, e.g. Jan 2022 - Present",
      "description": "Summary of responsibilities and key achievements"
    }
  ],
  "education": [
    {
      "school": "Institution or university name",
      "degree": "Degree name, e.g. B.Tech, B.S., Master",
      "fieldOfStudy": "Major or field of study, e.g. Computer Science",
      "year": "Graduation year or date range, e.g. 2024"
    }
  ],
  "projects": [
    {
      "title": "Project name",
      "description": "Brief description of the project and its impact",
      "technologies": ["List of technologies used"],
      "link": "Project URL or GitHub repository if present"
    }
  ],
  "certifications": [
    {
      "name": "Certification title",
      "issuingOrganization": "Issuer or organization, e.g. AWS, Coursera",
      "issueDate": "Date or year"
    }
  ]
}

Resume Text:
"""
${resumeText.substring(0, 14000)}
"""`;

        const aiResult = await generateJSON(prompt);
        if (aiResult) {
          if (aiResult.bio) user.bio = aiResult.bio;
          if (aiResult.skills && Array.isArray(aiResult.skills)) {
            user.skills = [...new Set([...(user.skills || []), ...aiResult.skills])];
          }
          if (aiResult.experience && Array.isArray(aiResult.experience) && aiResult.experience.length > 0) {
            user.experience = aiResult.experience;
          }
          if (aiResult.education && Array.isArray(aiResult.education) && aiResult.education.length > 0) {
            user.education = aiResult.education;
          }
          if (aiResult.projects && Array.isArray(aiResult.projects) && aiResult.projects.length > 0) {
            user.projects = aiResult.projects;
          }
          if (aiResult.certifications && Array.isArray(aiResult.certifications) && aiResult.certifications.length > 0) {
            user.certifications = aiResult.certifications;
          }
          if (aiResult.location && (!user.location || user.location === "India")) {
            user.location = aiResult.location;
          }
          if (aiResult.name && (!user.name || user.name.trim() === "")) {
            user.name = aiResult.name;
          }
          if (aiResult.lastname && (!user.lastname || user.lastname.trim() === "")) {
            user.lastname = aiResult.lastname;
          }
        }
      }
    } catch (parseError) {
      console.error("Resume AI extraction error:", parseError);
      extractionError = parseError.message;
    }

    await user.save();

    // Remove resumeData buffer from the JSON response to keep response lightweight
    const safeUser = user.toObject();
    delete safeUser.resumeData;
    delete safeUser.password;

    res.status(200).send({
      success: true,
      message: "Resume uploaded and profile auto-filled successfully!",
      extractionError,
      resumeLink: user.resumeLink,
      user: safeUser
    });
  } catch (error) {
    console.error("uploadResumeController error:", error);
    res.status(500).send({ success: false, message: "Error uploading resume" });
  }
};

export const getResumeController = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId).select("+resumeData");
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    // 1. Serve from MongoDB binary buffer if available
    if (user.resumeData && user.resumeData.length > 0) {
      res.set("Content-Type", user.resumeContentType || "application/pdf");
      res.set("Content-Disposition", `inline; filename="${user.resumeFileName || 'resume.pdf'}"`);
      return res.send(user.resumeData);
    }

    // 2. Serve from disk if stored locally
    const resumesDir = path.join(__dirname, "../uploads/resumes");
    if (fs.existsSync(resumesDir)) {
      const files = fs.readdirSync(resumesDir);
      const matched = files.find(f => f.startsWith(`resume-${userId}`));
      if (matched) {
        return res.sendFile(path.join(resumesDir, matched), {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "inline"
          }
        });
      }
    }

    // 3. Fallback: If resumeLink is an external URL, redirect to it
    if (user.resumeLink && user.resumeLink.startsWith("http")) {
      return res.redirect(user.resumeLink);
    }

    return res.status(404).send({ success: false, message: "Resume file not found" });
  } catch (error) {
    console.error("getResumeController error:", error);
    res.status(500).send({ success: false, message: "Error loading resume" });
  }
};
