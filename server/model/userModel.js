import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema(
  {
    name: { required: ["Name is required", true], type: String },
    lastname: { type: String },
    email: {
      required: ["Name is required", true],
      type: String,
      unique: true,
      validator: validator.isEmail,
    },
    password: {
      required: ["password length is greator than 6", true],
      type: String,
      minlength: [6],
      select: true,
    },
    location: { type: String, default: "India" },
    role: {
      type: String,
      enum: ["seeker", "employer", "admin"],
      default: "seeker",
    },
    bio: { type: String, default: "" },
    skills: { type: [String], default: [] },
    resumeLink: { type: String, default: "" },
    companyName: { type: String, default: "" },
    companyDescription: { type: String, default: "" },
    savedJobs: [{ type: mongoose.Types.ObjectId, ref: "Job" }],
    // Extended fields for candidate matching, portfolios, skill assessments and video intro
    experience: {
      type: [
        {
          role: String,
          company: String,
          duration: String,
          description: String,
        }
      ],
      default: []
    },
    projects: {
      type: [
        {
          title: String,
          description: String,
          technologies: [String],
          link: String,
        }
      ],
      default: []
    },
    education: {
      type: [
        {
          school: String,
          degree: String,
          fieldOfStudy: String,
          year: String,
        }
      ],
      default: []
    },
    certifications: {
      type: [
        {
          name: String,
          issuingOrganization: String,
          issueDate: String,
        }
      ],
      default: []
    },
    desiredSalary: { type: Number, default: 0 },
    verifiedSkills: {
      type: [
        {
          skillName: String,
          score: Number,
          verifiedAt: { type: Date, default: Date.now }
        }
      ],
      default: []
    },
    portfolioVerification: {
      githubVerified: { type: Boolean, default: false },
      websiteVerified: { type: Boolean, default: false },
      githubUsername: { type: String, default: "" },
      portfolioUrl: { type: String, default: "" },
      verifiedAt: Date
    },
    recruiterVerification: {
      isVerified: { type: Boolean, default: false },
      companyEmail: { type: String, default: "" },
      companyWebsite: { type: String, default: "" },
      companyLinkedIn: { type: String, default: "" },
      companyName: { type: String, default: "" },
      website: { type: String, default: "" },
      registrationNumber: { type: String, default: "" },
      verifiedAt: Date
    },
    referralPoints: { type: Number, default: 0 },
    referralCode: { type: String, unique: true, sparse: true },
    resumeText: { type: String, default: "" },
    videoIntroUrl: { type: String, default: "" },
    videoIntroSummary: { type: String, default: "" },
    developerCard: {
      leetcodeUsername: { type: String, default: "" },
      leetcodeStats: { type: mongoose.Schema.Types.Mixed, default: {} },
      hackathons: { type: [String], default: [] },
      blogs: { type: [String], default: [] },
      aiSummary: { type: String, default: "" }
    },
    loginOtp: { type: String, default: "" },
    loginOtpExpires: { type: Date }
  },
  { timestamps: true }
);
 // for encrypting the password which comes from client side
userSchema.pre("save", async function () {
    if (this.role === "seeker" && !this.referralCode) {
      const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
      this.referralCode = `${this.name.substring(0, 3).toUpperCase()}-${randomStr}`;
    }
    if (this.isModified && !this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
  

  userSchema.methods.comparePassword = async function(userPassword){
    const isMatch = await bcrypt.compare(userPassword,this.password)
    return isMatch;
  }


  userSchema.methods.createJWT =  function(){
    return  jwt.sign({userId :this._id, role: this.role} , process.env.JWT_SECERET,{
        expiresIn:"1d"
    })

  }

  export default mongoose.model("User",userSchema)