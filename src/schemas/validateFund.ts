import * as yup from "yup";

const schema = yup.object({
  alias: yup
    .string()
    .required("Fund alias is required")
    .max(7, "Fund alias must be at most 7 characters"),
  name: yup.string().required("Name is required"),
  description: yup.string().optional(),
  type: yup
    .string()
    .oneOf(["Ação", "FII", "BDR"], "Type must be one of Ação, FII or BDR")
    .required(),
  sector: yup.string().optional(),
});

export default schema;
