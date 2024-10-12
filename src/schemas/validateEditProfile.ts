import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().required("Email is required").email("Must be a valid email"),
  avatar: yup.string().optional(),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/(\d)/, "Password must contain a number")
    .optional(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .test("confirm-password", "Confirm password is required", (value, context) => {
      const { password } = context.parent;
      return password === "" || value === password;
    })
    .optional(),
});

export default schema;
