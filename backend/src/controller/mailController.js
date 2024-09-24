const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 587,
  secure: false,
  auth: {
    user: "contact@curellifoods.com",
    pass: "Curellifoods@2023",
  },
});

async function sendOTP(email, otp, transporter) {
  const mailOptions = {
    from: "contact@curellifoods.com",
    to: email,
    subject: "Verification from Curelli",
    text: `Your OTP is: ${otp}`,
  };

  try {
    await new Promise((resolve, reject) => {
      transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Server is ready to take our messages");
          resolve(success);
        }
      });
    });

    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log(info);
          resolve(info);
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send OTP");
  }
}

exports.sendMail = async (req, res) => {
  try {
    const otp = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    await sendOTP(req.body.mail, otp, transporter);
    res.json({ message: "OTP sent successfully", otp });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
