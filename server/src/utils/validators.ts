import { z } from "zod";

// --- Auth ---
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  role: z.enum(["admin", "volunteer", "donor", "user"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// --- Donation ---
export const createDonationSchema = z.object({
  amount: z.number().min(1, "Amount must be at least ₹1"),
  category: z.enum(["education", "food", "healthcare"], {
    errorMap: () => ({ message: "Category must be education, food, or healthcare" }),
  }),
  donorName: z.string().optional(),
  donorEmail: z.string().email().optional().or(z.literal("")),
});

// --- Volunteer ---
export const registerVolunteerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  skills: z.string().optional(),
});

export const createTaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(2, "Location is required"),
  status: z.enum(["active", "completed"]).optional(),
});

// --- Food Donation ---
export const createFoodDonationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  mealType: z.enum(["breakfast", "lunch", "dinner", "festival"], {
    errorMap: () => ({ message: "Meal type must be breakfast, lunch, dinner, or festival" }),
  }),
  mealsCount: z.number().min(1, "Meals count must be at least 1"),
  emoji: z.string().optional(),
  scheduledDate: z.string().optional(),
  location: z.string().optional(),
});

// --- Talent ---
export const createTalentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  skill: z.string().min(2, "Skill must be at least 2 characters"),
  rating: z.number().min(0).max(5).optional(),
});

// --- Event ---
export const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(2, "Location is required"),
  attendeesCount: z.number().min(0).optional(),
  emoji: z.string().optional(),
});

// --- Child ---
export const addChildSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(0, "Age must be positive").max(18, "Age must be under 18"),
  educationProgress: z.number().min(0).max(100).optional(),
  healthProgress: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

export const updateChildSchema = z.object({
  name: z.string().min(2).optional(),
  age: z.number().min(0).max(18).optional(),
  educationProgress: z.number().min(0).max(100).optional(),
  healthProgress: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});
