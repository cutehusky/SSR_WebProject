import { Request, Response, NextFunction } from 'express';
import fetch from 'isomorphic-fetch';

export const recaptcha = async (req: Request, res: Response, next: NextFunction) => {
  const response_key = req.body["g-recaptcha-response"];
  const secret_key = process.env.RECAPTCHA_SECRET_KEY || "your-secret-key";

  if (!response_key) {
    return next(new Error("Captcha response is missing"));
  }

  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;
  try {
    const response = await fetch(url, { method: "POST" });
    const google_response = await response.json();

    if (google_response.success) {
      next();
    } else {
      next(new Error("Captcha verification failed: " + JSON.stringify(google_response)));
    }
  } catch (error) {
    next(new Error("Error verifying captcha:" + error));
  }
};