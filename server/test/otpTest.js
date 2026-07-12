import mongoose from "mongoose";
import dotenv from "dotenv";
import userModel from "../model/userModel.js";
import { sendOtpController, verifyOtpController } from "../controller/userAuth.js";

dotenv.config();

const runOtpTest = async () => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected successfully.");

    // Create a clean test user
    const testEmail = `test_otp_user_${Date.now()}@example.com`;
    const candidate = await userModel.create({
      name: "OTP Test User",
      email: testEmail,
      password: "password123",
      role: "seeker",
    });
    console.log(`Created test user: ${candidate.name} (${candidate.email})`);

    // 1. Test sendOtpController
    console.log("Simulating Send OTP API Call...");
    const sendReq = {
      body: { email: testEmail }
    };
    
    let sendStatus = 200;
    let sendData = null;
    const sendRes = {
      status: (code) => {
        sendStatus = code;
        return sendRes;
      },
      send: (data) => {
        sendData = data;
        return sendRes;
      }
    };

    await sendOtpController(sendReq, sendRes);
    console.log(`Send OTP Response Status: ${sendStatus}`);
    console.log("Send OTP Response Data:", JSON.stringify(sendData, null, 2));

    // Retrieve OTP from DB to verify
    const userWithOtp = await userModel.findOne({ email: testEmail });
    const generatedOtp = userWithOtp.loginOtp;
    console.log(`Generated OTP in DB: ${generatedOtp}`);

    if (sendStatus === 200 && sendData.success && generatedOtp) {
      console.log("SUCCESS: OTP generated and stored successfully!");
    } else {
      console.error("FAILURE: OTP generation failed.");
    }

    // 2. Test verifyOtpController with correct OTP
    console.log("Simulating Verify OTP (Correct OTP) API Call...");
    const verifyReqCorrect = {
      body: { email: testEmail, otp: generatedOtp }
    };

    let verifyStatusCorrect = 200;
    let verifyDataCorrect = null;
    const verifyResCorrect = {
      status: (code) => {
        verifyStatusCorrect = code;
        return verifyResCorrect;
      },
      send: (data) => {
        verifyDataCorrect = data;
        return verifyResCorrect;
      }
    };

    await verifyOtpController(verifyReqCorrect, verifyResCorrect);
    console.log(`Verify OTP (Correct) Response Status: ${verifyStatusCorrect}`);
    console.log("Verify OTP (Correct) Response Data:", JSON.stringify(verifyDataCorrect, null, 2));

    if (verifyStatusCorrect === 200 && verifyDataCorrect.success && verifyDataCorrect.token) {
      console.log("SUCCESS: Correct OTP successfully verified and token returned!");
    } else {
      console.error("FAILURE: Correct OTP verification failed.");
    }

    // 3. Test verifyOtpController with incorrect OTP
    console.log("Simulating Verify OTP (Incorrect OTP) API Call...");
    const verifyReqIncorrect = {
      body: { email: testEmail, otp: "999999" }
    };

    let verifyStatusIncorrect = 200;
    let verifyDataIncorrect = null;
    const verifyResIncorrect = {
      status: (code) => {
        verifyStatusIncorrect = code;
        return verifyResIncorrect;
      },
      send: (data) => {
        verifyDataIncorrect = data;
        return verifyResIncorrect;
      }
    };

    await verifyOtpController(verifyReqIncorrect, verifyResIncorrect);
    console.log(`Verify OTP (Incorrect) Response Status: ${verifyStatusIncorrect}`);
    console.log("Verify OTP (Incorrect) Response Data:", JSON.stringify(verifyDataIncorrect, null, 2));

    if (verifyStatusIncorrect === 400 && !verifyDataIncorrect.success) {
      console.log("SUCCESS: Incorrect OTP was rejected properly!");
    } else {
      console.error("FAILURE: Incorrect OTP was not handled properly.");
    }

    // Clean up database
    console.log("Cleaning up test records...");
    await userModel.deleteOne({ _id: candidate._id });
    console.log("Cleanup completed.");

  } catch (error) {
    console.error("Test execution failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database disconnected.");
  }
};

runOtpTest();
