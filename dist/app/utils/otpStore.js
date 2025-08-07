"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.saveOTP = exports.otpStore = void 0;
exports.otpStore = {};
const saveOTP = (email, otp) => {
    exports.otpStore[email] = {
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 mins
    };
    console.log(`3. OTP stored for ${email}:`, exports.otpStore[email]); // 🔍 Debugging
};
exports.saveOTP = saveOTP;
const verifyOTP = (email, otp) => {
    console.log("\n\nreq with: ", email, otp);
    console.log("otpStore ", exports.otpStore);
    const data = exports.otpStore[email];
    console.log("data :", data);
    if (!data)
        return false;
    const isValid = data.otp === otp && Date.now() < data.expiresAt;
    console.log("data is valid: ", data.otp === otp);
    console.log("date now: ", Date.now());
    console.log("date stored: ", data.expiresAt);
    console.log("isValid: ", isValid);
    if (isValid)
        delete exports.otpStore[email];
    return isValid;
};
exports.verifyOTP = verifyOTP;
