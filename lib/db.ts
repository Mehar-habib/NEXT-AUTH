import { PrismaClient } from "@prisma/client";

// Declare a global variable `prisma` to ensure a singleton PrismaClient instance.
// This prevents multiple instances of PrismaClient in development mode, which can cause issues.
declare global {
  var prisma: PrismaClient | undefined; // Declare `prisma` as a global variable of type PrismaClient or undefined.
}

// Create the database client instance.
// Use the existing global `prisma` instance if it exists, or create a new PrismaClient instance.
// In production mode, this will always create a new PrismaClient instance.
export const db = globalThis.prisma || new PrismaClient();

// In development mode, assign the PrismaClient instance to the global `prisma` variable.
// This ensures that only one instance of PrismaClient is used across multiple hot-reloads.
// In production mode, no global assignment is done, ensuring a clean, isolated instance.
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db; // Assign the instance to `globalThis` for reuse in development.
}
