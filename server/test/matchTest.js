import mongoose from "mongoose";
import dotenv from "dotenv";
import userModel from "../model/userModel.js";
import jobModel from "../model/jobModel.js";
import applicationModel from "../model/applicationModel.js";
import { applyJobController } from "../controller/applicationController.js";

dotenv.config();

const runTest = async () => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected successfully.");

    // 1. Create a clean test seeker user
    const testEmail = `test_candidate_${Date.now()}@example.com`;
    const candidate = await userModel.create({
      name: "Alex",
      lastname: "Developer",
      email: testEmail,
      password: "password123",
      role: "seeker",
      bio: "Experienced React Frontend Developer with 3 years of building modern responsive dashboards.",
      skills: ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS"],
      location: "Bangalore",
      desiredSalary: 12, // 12 LPA
      experience: [
        {
          role: "Frontend Engineer",
          company: "WebTech Solutions",
          duration: "2023 - Present",
          description: "Built beautiful visual interfaces, customized charts, and managed state using React and Redux."
        }
      ],
      projects: [
        {
          title: "Sleek SaaS Dashboard",
          description: "High-end React app with glassmorphic cards and interactive tables.",
          technologies: ["React", "Tailwind CSS"],
          link: "https://github.com/alex/dashboard"
        }
      ]
    });
    console.log(`Created test candidate: ${candidate.name} (${candidate.email})`);

    // 2. Create a clean test employer user to own the job
    const employerEmail = `test_employer_${Date.now()}@example.com`;
    const employer = await userModel.create({
      name: "Hiring",
      lastname: "Manager",
      email: employerEmail,
      password: "password123",
      role: "employer",
      companyName: "DevHQ Inc"
    });
    console.log(`Created test employer: ${employer.name} (${employer.email})`);

    // 3. Create a test job posting that fits the seeker well
    const job = await jobModel.create({
      company: "DevHQ Inc",
      position: "React Frontend Developer",
      workType: "full-time",
      salary: {
        min: 800000,
        max: 1500000,
        currency: "INR",
        disclosed: true
      },
      workLocation: "Bangalore",
      applyLink: "https://devhq.com/careers/apply-react",
      createdBy: employer._id
    });
    console.log(`Created test job: ${job.position} at ${job.company}`);

    // 4. Test quick apply controller mock execution
    console.log("Simulating Quick Apply API Call...");
    
    // We will construct the mock req and res objects
    const req = {
      body: { jobId: job._id.toString() },
      user: { userId: candidate._id.toString(), role: "seeker" }
    };
    
    let resStatus = 200;
    let resData = null;
    const res = {
      status: (code) => {
        resStatus = code;
        return res;
      },
      json: (data) => {
        resData = data;
        return res;
      }
    };

    await applyJobController(req, res);

    console.log(`Response Status: ${resStatus}`);
    console.log("Response Data:", JSON.stringify(resData, null, 2));

    if (resStatus === 201 && resData.success) {
      console.log("SUCCESS: Match Score computed and application submitted!");
      console.log(`AI Match Score: ${resData.application.matchScore}%`);
      console.log(`AI Match Explanation: ${resData.application.matchExplanation}`);
    } else {
      console.error("FAILURE: Quick apply returned non-success response.");
    }

    // Clean up database
    console.log("Cleaning up test records...");
    await userModel.deleteOne({ _id: candidate._id });
    await userModel.deleteOne({ _id: employer._id });
    await jobModel.deleteOne({ _id: job._id });
    if (resData && resData.application) {
      await applicationModel.deleteOne({ _id: resData.application._id });
    }
    console.log("Cleanup completed.");

  } catch (error) {
    console.error("Test execution failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database disconnected.");
  }
};

runTest();
