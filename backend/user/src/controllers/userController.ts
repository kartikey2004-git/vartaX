import asyncHandler from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";
import { publishToQueue } from "../config/rabbitmq.js";
import { redisClient } from "../index.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import { User } from "../model/UserModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const loginUser = asyncHandler(async (req, res) => {
  // get email from request body
  const { email } = req.body;

  // set OTP ratelimit key for the email
  const rateLimitKey = `otp:ratelimit:${email}`;

  // set rateLimit by passing ratelimitkey to redis get method that a user can only sent a request after every 1 minute

  const rateLimit = await redisClient.get(rateLimitKey);

  // if rateLimit exists, send 429 status code with message
  if (rateLimit) {
    throw new ApiError(
      429,
      "Too many requests. Please wait before requesting new otp"
    );
  }

  // generate a 6 digit otp
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // set otp key for the email
  const otpKey = `otp:${email}`;

  // store the otp in redis with an expiry time of 5 minutes and set rateLimit key with an expiry time of 1 minute

  await redisClient.set(otpKey, otp, {
    EX: 300,
  });

  // set rateLimit key with an expiry time of 1 minute

  await redisClient.set(rateLimitKey, "true", {
    EX: 60,
  });

  // message to be sent to the queue
  const message = {
    to: email,
    subject: "Your otp code",
    body: `Your OTP is ${otp}. It is valid for 5 minutes`,
  };

  // publish the message to the queue
  await publishToQueue("send-otp", message);

  return res.status(200).json(new ApiResponse(200, "OTP sent to your mail"));
});

export const verifyUser = asyncHandler(async (req, res) => {
  // get email and entered otp from request body
  const { email, otp: enteredOtp } = req.body;

  // if we don't have email or entered otp, send 400 status code with message
  if (!email || !enteredOtp) {
    throw new ApiError(400, "Email and OTP Required");
  }

  // get otp key for the email
  const otpKey = `otp:${email}`;

  // get the otp from redisClient by get method by providing otpkey

  const storedOtp = await redisClient.get(otpKey);

  // if we don't have stored otp or stored otp is not equal to entered otp, send 400 status code with message

  if (!storedOtp || storedOtp !== enteredOtp) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // delete the otp from redis
  await redisClient.del(otpKey);

  // check if user already exists
  let user = await User.findOne({ email });

  // if user doesn't exist, create a new user
  if (!user) {
    const name = email.slice(0, 8);
    user = await User.create({ name, email });
  }

  // generate a token
  const token = generateToken(user);

  // send response with user and token
  res.json({
    message: "User Verified",
    user,
    token,
  });
});

export const myProfile = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    // get user from req.user which is injected by isAuth middleware
    const user = req.user;
    res.json(user);
  }
);

export const updateName = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404).json({
        message: "Please Login",
      });
      return;
    }

    user.name = req.body.name;
    await user.save();

    const token = generateToken(user);

    res.json({
      message: "User Updated Successfully",
      user,
      token,
    });
  }
);

export const getAllUsers = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const users = await User.find();
    res.json(users);
  }
);

export const getUser = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});
