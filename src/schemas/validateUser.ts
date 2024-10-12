import * as yup from "yup";

export const schemaEdit = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().required("Email is required").email("Must be a valid email"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .matches(/(\d)/, "Password must contain a number"),
  admin: yup.string().required('"admin" is required').oneOf(["true", "false"]),
  avatar: yup.string().optional(),
});

export const schemaPost = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().required("Email is required").email("Must be a valid email"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/(\d)/, "Password must contain a number"),
  admin: yup.string().required('"admin" is required').oneOf(["true", "false"]),
  avatar: yup.string().optional(),
});
