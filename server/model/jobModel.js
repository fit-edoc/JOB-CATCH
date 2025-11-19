import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },

    position: {
      type: String,
      required: [true, "Job Position is required"],
      maxlength: 100,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "rejected", "interview"],
      default: "pending",
    },

    workType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract"],
      default: "full-time",
    },

    
    salary: {
      type: {
        min: { type: Number, min: 0 },
        max: { type: Number, min: 0 },
        currency: { type: String, default: "INR" },
        disclosed: { type: Boolean, default: true }, 
      },
      default: {
        min: 0,
        max: 0,
        currency: "INR",
        disclosed: false,
      },
    },

    workLocation: {
      type: String,
      default: "Delhi",
      required: [true, "Work location is required"],
      trim: true,
    },

    applyLink: {
      type: String,
      required: [true, "Provide apply link"],
      validate: {
        validator: function (v) {
          return /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(v);
        },
        message: "Please enter a valid URL",
      },
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
