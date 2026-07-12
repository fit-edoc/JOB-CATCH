import jobModel from "../model/jobModel.js";

export const seedJobs = async () => {
  try {
    // Clean default seeded developer jobs from the database
    const result = await jobModel.deleteMany({ createdBy: "6739ab21983bcf0012e89010" });
    if (result.deletedCount > 0) {
      console.log(`Database cleaned: ${result.deletedCount} default seeded developer jobs deleted.`);
    }
  } catch (error) {
    console.error("Error cleaning default jobs:", error);
  }
};
