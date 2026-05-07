// import { z } from "zod";
//
// export const UserSchema = z
//   .object({
//     id_number: z.string().min(1, "ID number is required"),
//     username: z.string().min(3, "Username must be at least 3 characters"),
//     password: z.string().min(8, "Password must be at least 8 characters"),
//     confirm_password: z.string(),
//     first_name: z.string().min(1, "First name is required"),
//     last_name: z.string().min(1, "Last name is required"),
//     email: z.string().email("Invalid email address"),
//     role: z.enum(["admin", "instructor"]),
//     profile_img: z
//       .any()
//       .optional()
//       .refine(
//         (files) => !files?.length || files[0]?.size <= 5000000,
//         "Max file size is 5MB",
//       )
//       .refine(
//         (files) =>
//           !files?.length ||
//           ["image/jpeg", "image/png", "image/webp"].includes(files?.[0]?.type),
//         "Only .jpg, .png and .webp formats are supported",
//       ),
//   })
//   .refine((data) => data.password === data.confirm_password, {
//     message: "Passwords do not match",
//     path: ["confirm_password"],
//   });
//
// export type User = z.infer<typeof UserSchema>;
//
// export const UserFields: Record<
//   keyof User,
//   "text" | "select" | "file" | "password"
// > = {
//   id_number: "text",
//   username: "text",
//   password: "password",
//   confirm_password: "password",
//   first_name: "text",
//   last_name: "text",
//   email: "text",
//   role: "select",
//   profile_img: "file",
// };

// lib/validations/users.ts
export const UserFields = [
  {
    name: "id_number",
    label: "ID Number",
    type: "text",
    placeholder: "adm-main-001",
  },
  {
    name: "username",
    label: "Username",
    type: "text",
    placeholder: "What should we call you?",
  },
  {
    name: "password_hash",
    label: "Password",
    type: "password",
    placeholder: "••••••••",
  },
  {
    name: "first_name",
    label: "First Name",
    type: "text",
    placeholder: "John",
  },
  {
    name: "last_name",
    label: "Last Name",
    type: "text",
    placeholder: "Doe",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "john@example.com",
  },
  {
    name: "role",
    label: "User Role",
    type: "select",
    options: [
      { value: "instructor", label: "Instructor" },
      { value: "admin", label: "Admin" },
    ],
  },
];
