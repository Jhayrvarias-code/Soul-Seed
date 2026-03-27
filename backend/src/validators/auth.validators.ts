import Joi, { required } from "joi";

const MINIMUM_AGE = 18;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

export const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(passwordRegex).required().messages({
    "string.pattern.base":
      "Password must be at least 8 characters, include uppercase, lowercase, number, and special character",
    "string.empty": "Password is required",
  }),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "string.empty": "Confirm password is required",
  }),
  birthdate: Joi.date()
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - MINIMUM_AGE)),
    )
    .required()
    .messages({
      "date.max": "You must be at least 18 years old",
      "date.base": "Birthdate must be a valid date",
    }),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
  interests: Joi.array().items(Joi.string()).max(4).optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
