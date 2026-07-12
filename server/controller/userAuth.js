import userModel from "../model/userModel.js";
import applicationModel from "../model/applicationModel.js";
import { sendEmail } from "../utils/sendEmail.js";
console.log("working importing");


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
                        'User-Agent': 'JobCatch-App'
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

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found. Please register first.", success: false });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.loginOtp = otp;
    user.loginOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    try {
      await sendEmail({
        to: email,
        subject: 'Your Login OTP - Job Portal',
        html: `<p>Your login OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`
      });
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      return res.status(500).send({ message: `Failed to send OTP: ${emailError.message}`, success: false });
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

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found", success: false });
    }

    if (!user.loginOtp || user.loginOtp !== otp || Date.now() > user.loginOtpExpires) {
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
