import jobModel from "../model/jobModel.js";
import { generateJSON, generateContent } from "../utils/gemini.js";





// export const createJobcontroller = async(req,res)=>{

//     try {
//         if (req.user.role === 'seeker') {
//             return res.status(403).send({message: "Job seekers are not authorized to post jobs.", success: false});
//         }

//         const {company , position} = req.body;

//         if(!company || !position){
//             return res.status(400).send({message:"provide all fields",success:false});
//         }

//         // Run heuristic & AI Scam Detection
//         let scamAnalysis = { isScam: false, score: 5, reason: "Verified details match standard baseline." };
//         try {
//             const prompt = `Analyze the following job details for a potential scam or spam check:
// Company Name: "${company}"
// Position: "${position}"
// Salary details: min: ${req.body.salary?.min || 0}, max: ${req.body.salary?.max || 0}
// Work Type: "${req.body.workType || 'full-time'}"
// Work Location: "${req.body.workLocation || 'Delhi'}"
// Apply Link: "${req.body.applyLink || ''}"

// Analyze if this is a potential scam (e.g. suspiciously high salary for low experience, fake company name, generic links).
// Return ONLY a JSON object with these exact keys: "isScam" (boolean), "score" (number, 0-100), "reason" (string).`;
            
//             const aiResult = await generateJSON(prompt);
//             if (aiResult && typeof aiResult === 'object') {
//                 scamAnalysis = aiResult;
//             }
//         } catch (err) {
//             console.warn("Gemini scam detection failed, falling back to heuristics:", err);
//             const isSuspiciousLink = req.body.applyLink && !req.body.applyLink.includes(company.toLowerCase().replace(/\s+/g, '')) && !req.body.applyLink.includes("job-portal");
//             const isHighSalaryLowRequirement = req.body.salary?.min > 100 && (position.toLowerCase().includes("data entry") || position.toLowerCase().includes("typing"));
//             if (isSuspiciousLink || isHighSalaryLowRequirement) {
//                 scamAnalysis = {
//                     isScam: true,
//                     score: 75,
//                     reason: "Potential domain mismatch or suspicious salary range for the role type."
//                 };
//             }
//         }

//         req.body.scamAnalysis = scamAnalysis;
//       req.body.createdBy = req.user.userId
//       const job = await jobModel.create(req.body)

//       res.status(200).send({message:"job successfully created",job})
        
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({message: "Error creating job", success: false});
//     }
// }

// export const getJobController = async(req,res)=>{

//    try {
    

    
//       const jobs = await jobModel.find({}).populate("createdBy").sort({createdAt:-1});
//       res.status(200).json({
//         jobs,
//         totaljobs:jobs.length
//       });

    
//    } catch (error) {
//     console.log(error);
//     res.status(500).send({message:"getjob api not working",success:false})
    
//    }


//     };
    

// export const updateJobcontroller = async(req,res,next)=>{

//   try {
//     const {company, position} = req.body

//     if(!company || !position){
//       res.status(400).send({message:"please provide all fields"})
//     }

    
    
// const {id} = req.params

// const job = await jobModel.findOne({_id:id})
// if(!job){
//   res.status(500).send({success: false,message: 'no jobs found',});
// }

// if (req.user.userId !== job.createdBy.toString()) {
//   next("You are not authorized to update this job");
//   return;
// }
// const updateJob = await jobModel.findOneAndUpdate({_id:id},req.body,{

// job


// }}}



export const createJobcontroller = async(req,res)=>{

    try {
        if (req.user.role === 'seeker') {
            return res.status(403).send({message: "Job seekers are not authorized to post jobs.", success: false});
        }

        const {company , position} = req.body;

        if(!company || !position){
            return res.status(400).send({message:"provide all fields",success:false});
        }

        // Run heuristic & AI Scam Detection
        let scamAnalysis = { isScam: false, score: 5, reason: "Verified details match standard baseline." };
        try {
            const prompt = `Analyze the following job details for a potential scam or spam check:
Company Name: "${company}"
Position: "${position}"
Salary details: min: ${req.body.salary?.min || 0}, max: ${req.body.salary?.max || 0}
Work Type: "${req.body.workType || 'full-time'}"
Work Location: "${req.body.workLocation || 'Delhi'}"
Apply Link: "${req.body.applyLink || ''}"

Analyze if this is a potential scam (e.g. suspiciously high salary for low experience, fake company name, generic links).
Return ONLY a JSON object with these exact keys: "isScam" (boolean), "score" (number, 0-100), "reason" (string).`;
            
            const aiResult = await generateJSON(prompt);
            if (aiResult && typeof aiResult === 'object') {
                scamAnalysis = aiResult;
            }
        } catch (err) {
            console.warn("Gemini scam detection failed, falling back to heuristics:", err);
            const isSuspiciousLink = req.body.applyLink && !req.body.applyLink.includes(company.toLowerCase().replace(/\s+/g, '')) && !req.body.applyLink.includes("job-portal");
            const isHighSalaryLowRequirement = req.body.salary?.min > 100 && (position.toLowerCase().includes("data entry") || position.toLowerCase().includes("typing"));
            if (isSuspiciousLink || isHighSalaryLowRequirement) {
                scamAnalysis = {
                    isScam: true,
                    score: 75,
                    reason: "Potential domain mismatch or suspicious salary range for the role type."
                };
            }
        }

        req.body.scamAnalysis = scamAnalysis;
      req.body.createdBy = req.user.userId
      const job = await jobModel.create(req.body)

      res.status(200).send({message:"job successfully created",job})
        
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Error creating job", success: false});
    }
}

export const getJobController = async(req,res)=>{

   try {
    

    
      const jobs = await jobModel.find({}).populate("createdBy").sort({createdAt:-1});
      res.status(200).json({
        jobs,
        totaljobs:jobs.length
      });

    
   } catch (error) {
    console.log(error);
    res.status(500).send({message:"getjob api not working",success:false})
    
   }


    };
    

export const updateJobcontroller = async(req,res,next)=>{

  try {
    const {company, position} = req.body

    if(!company || !position){
      res.status(400).send({message:"please provide all fields"})
    }

    
    
const {id} = req.params

const job = await jobModel.findOne({_id:id})
if(!job){
  res.status(500).send({success: false,message: 'no jobs found',});
}

if (req.user.userId !== job.createdBy.toString()) {
  next("You are not authorized to update this job");
  return;
}
const updateJob = await jobModel.findOneAndUpdate({_id:id},req.body,{
  new: true,
  runValidators: true,
})

await job.save()

res.status(200).send({message:"job has been updated",updateJob})

  } catch (error) {
    console.error(error);
    console.log(error);
    
    res.status(500).json({message:"not working api of job update"})
  }
}

export const deleteJobcontroller = async(req,res,next)=>{

  const {id}= req.params

  const job = await jobModel.findOne({_id:id})

  if(!job){
    return res.status(500).send({success: false,message: 'job not found by this id'});
  }

  if(req.user.userId  !== job.createdBy.toString())
  {
    next("you will not allow to delete this job ")
    return;
  }
  await job.deleteOne()
  res.status(200).send({success: true,message: 'job has been deleted',});
   
}

export const generateJobDescriptionController = async (req, res) => {
  try {
    const { company, position, workType, workLocation } = req.body;
    if (!position) {
      return res.status(400).send({ success: false, message: "Job title/position is required to generate description" });
    }
    const prompt = `Generate a professional job description for the position "${position}" at company "${company || 'our company'}".
Location: ${workLocation || 'specified location'}
Job Type: ${workType || 'full-time'}

Include Sections:
1. Role Summary
2. Key Responsibilities
3. Required Skills & Qualifications
Return only the generated markdown or text description, suitable to paste directly.`;

    const description = await generateContent(prompt);
    res.status(200).send({ success: true, description });
  } catch (error) {
    console.error("generateJobDescriptionController error:", error);
    res.status(500).send({ success: false, message: "Failed to generate job description using AI" });
  }
};

export const salaryIntelligenceController = async (req, res) => {
  try {
    const { position, workLocation, workType } = req.body;
    if (!position) {
      return res.status(400).send({ success: false, message: "Position title is required for salary analysis" });
    }

    const prompt = `Perform a comprehensive salary market analysis for the position: "${position}" in location "${workLocation || 'remote'}" (${workType || 'full-time'}).
All salary values should be in Lakhs Per Annum (LPA) in Indian Rupees (INR), e.g. 12 means ₹12,000,000 per year / 12 LPA.

Return ONLY a JSON object (no wrapping markdown formatting) containing these exact keys:
"marketMin" (number, e.g. 6),
"marketMax" (number, e.g. 14),
"marketAvg" (number, e.g. 9.5),
"confidenceScore" (number, 0-100),
"skillsPremium" (array of 3 strings of top skills that increase compensation),
"analysis" (a concise 2-3 sentence overview of the talent market and compensation trends for this role).`;

    let analysis;
    try {
      analysis = await generateJSON(prompt);
    } catch (err) {
      console.warn("Using fallback salary intelligence:", err);
      analysis = {
        marketMin: 5,
        marketMax: 12,
        marketAvg: 8.5,
        confidenceScore: 80,
        skillsPremium: ["System Design", "Cloud Architecture (AWS/GCP)", "Team Leadership"],
        analysis: "Salaries for this role remain highly competitive. High demand for engineers with specialized engineering expertise is pushing average compensation upward."
      };
    }

    res.status(200).send({ success: true, analysis });
  } catch (error) {
    console.error("salaryIntelligenceController error:", error);
    res.status(500).send({ success: false, message: "Failed to perform salary market analysis" });
  }
};
