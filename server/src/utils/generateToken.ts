import jwt from "jsonwebtoken";

export const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET || "secret";
  return jwt.sign({ id }, secret, {
    expiresIn: "7d",
  } as jwt.SignOptions);
};
