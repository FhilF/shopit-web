const { z } = require("zod");

exports.schema = z
  .object({
    name: z.string().min(2, { message: "Enter your name" }),
    username: z
      .string()
      .min(6, { message: "Minimum of 6 characters" })
      .max(20, { message: "Maximum of 20 characters" })
      .trim()
      .regex(/^[a-z0-9_.]+$/, {
        message:
          "Please use only letters (a-z), numbers, periods, and underscores.",
      }),
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(1, { message: "Enter a password" }),
    cpassword: z.string().min(1, { message: "Enter confirm password" }),
    phoneNumber: z
      .object({
        number: z.number({
          required_error: "Enter your phone number",
          invalid_type_error: "Enter your phone number",
        }),
        countryCode: z.number(),
      })
      .strict(),
  })
  .refine((data) => data.password === data.cpassword, {
    message: "Passwords don't match",
    path: ["cpassword"], // path of error
  });

exports.profileEditSchema = z.object({
  image: z
    .array(z.object({ file: z.instanceof(File) }))
    .max(1, { message: "Must upload 1 image" }),
  name: z.string().min(2, { message: "Enter your Name" }),
});

exports.accountEmailEditSchema = z.object({
  email: z.string().email(),
});

exports.accountPhoneNumberEditSchema = z.object({
  countryCode: z.number(),
  number: z.number(),
});

exports.addressSchema = z.object({
  name: z.string().min(1, { message: "Enter your firstname" }),
  phoneNumber: z.object({
    countryCode: z.number(),
    number: z.number(),
  }),
  region: z.string().min(1, { message: "Enter your region" }),
  province: z.string().min(1, { message: "Enter your province" }),
  city: z.string().min(1, { message: "Enter your city" }),
  barangay: z.string().min(1, { message: "Enter your barangay" }),
  zipCode: z
    .number({
      required_error: "Enter your postal code",
      invalid_type_error: "Enter your postal code",
    })
    .refine((val) => val.toString().length > 1, {
      message: "Invalid postal code",
    }),
  addressLine1: z.string().min(1, { message: "Enter your address" }),
  label: z.string().min(1, { message: "Pick a label" }),
  isDefault: z.boolean({
    required_error: "isDefault is required",
    invalid_type_error: "isDefault must be a boolean",
  }),
});

exports.nonEmailProviderSetup = z.object({
  username: z
    .string()
    .min(6, { message: "Minimum of 6 characters" })
    .max(20, { message: "Maximum of 20 characters" })
    .trim()
    .regex(/^[a-z0-9_.]+$/, {
      message:
        "Please use only letters (a-z), numbers, periods, and underscores.",
    }),
  phoneNumber: z.object({
    countryCode: z.number(),
    number: z.number({
      required_error: "Enter your phone number",
      invalid_type_error: "Enter your phone number",
    }),
  }),
});
