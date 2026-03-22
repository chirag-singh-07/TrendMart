#!/usr/bin/env node

/**
 * ╔══════════════════════════════════════════════════════╗
 * ║         TrendMart — Create Admin CLI Tool            ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * Usage:
 *   npx tsx src/scripts/createAdmin.ts
 *   – or –
 *   npm run create-admin
 *
 * The script will interactively ask for:
 *   • Admin name
 *   • Email address
 *   • Password  (hidden while typing)
 *   • Role      (super_admin | admin | moderator)
 */

import * as readline from "readline";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import Admin from "../models/Admin.model.js";

// ── Load env ──────────────────────────────────────────────────────────────────
dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/trendmart-db";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** ANSI colour helpers */
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

const log = {
  info: (msg: string) => console.log(`${c.cyan}ℹ  ${c.reset}${msg}`),
  ok: (msg: string) => console.log(`${c.green}✔  ${c.reset}${msg}`),
  warn: (msg: string) => console.log(`${c.yellow}⚠  ${c.reset}${msg}`),
  err: (msg: string) => console.log(`${c.red}✖  ${c.reset}${msg}`),
  blank: () => console.log(),
  hr: () => console.log(c.dim + "─".repeat(52) + c.reset),
  header: () => {
    console.log();
    console.log(c.bold + c.white + "  TrendMart · Create Admin" + c.reset);
    console.log(c.dim + "  Securely add an admin account to the database" + c.reset);
    console.log();
  },
};

// ── Readline helpers ──────────────────────────────────────────────────────────

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/** Prompt user for a value */
function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(`${c.cyan}  ? ${c.reset}${c.bold}${question}${c.reset}  `, (answer) => {
      resolve(answer.trim());
    });
  });
}

/** Prompt for a password — hides input by swapping stdout write temporarily */
function askPassword(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rlOut = (rl as any).output as NodeJS.WriteStream;

    process.stdout.write(`${c.cyan}  ? ${c.reset}${c.bold}${question}${c.reset}  `);

    // Mute stdout so typed characters don't show
    const originalWrite = rlOut.write.bind(rlOut);
    rlOut.write = () => true;

    rl.once("line", (line: string) => {
      // Restore stdout
      rlOut.write = originalWrite;
      process.stdout.write("\n");
      resolve(line.trim());
    });
  });
}

/** Prompt for a menu selection */
async function askMenu(
  question: string,
  choices: string[]
): Promise<string> {
  console.log(`${c.cyan}  ? ${c.reset}${c.bold}${question}${c.reset}`);
  choices.forEach((ch, i) =>
    console.log(`    ${c.dim}[${i + 1}]${c.reset}  ${ch}`)
  );

  while (true) {
    const input = await ask(`Choose 1–${choices.length}`);
    const idx = parseInt(input, 10) - 1;
    if (idx >= 0 && idx < choices.length) return choices[idx];
    log.warn(`Please enter a number between 1 and ${choices.length}.`);
  }
}

// ── Permissions map ───────────────────────────────────────────────────────────

const ALL_PERMISSIONS = [
  "view_dashboard", "view_analytics",
  "view_users", "manage_users", "delete_users",
  "view_products", "manage_products", "delete_products",
  "view_orders", "manage_orders", "delete_orders",
  "view_categories", "manage_categories", "delete_categories",
  "view_banners", "manage_banners", "delete_banners",
  "view_admins", "manage_admins", "delete_admins",
  "manage_permissions", "view_logs", "view_settings", "manage_settings",
];

function permissionsFor(role: string): string[] {
  if (role === "super_admin") return ALL_PERMISSIONS;

  if (role === "admin") return [
    "view_dashboard", "view_analytics",
    "view_users", "manage_users",
    "view_products", "manage_products",
    "view_orders", "manage_orders",
    "view_categories", "manage_categories",
    "view_banners", "manage_banners",
    "view_logs",
  ];

  // moderator
  return [
    "view_dashboard", "view_analytics",
    "view_orders", "manage_orders",
  ];
}

// ── Validation ────────────────────────────────────────────────────────────────

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  log.header();
  log.hr();

  // ── 1. Collect input ──────────────────────────────────────────────────────

  // Name
  let name = "";
  while (!name || name.length < 2) {
    name = await ask("Full name (min 2 chars):");
    if (!name || name.length < 2) log.warn("Name must be at least 2 characters.");
  }

  log.blank();

  // Email
  let email = "";
  while (!isValidEmail(email)) {
    email = await ask("Email address:");
    if (!isValidEmail(email)) log.warn("Please enter a valid email address.");
  }

  log.blank();

  // Password
  let password = "";
  while (password.length < 6) {
    password = await askPassword("Password (hidden, min 6 chars):");
    if (password.length < 6) log.warn("Password must be at least 6 characters.");
  }

  // Confirm password
  let confirm = "";
  while (confirm !== password) {
    confirm = await askPassword("Confirm password:");
    if (confirm !== password) log.warn("Passwords do not match. Try again.");
  }

  log.blank();

  // Role
  const roleChoices = ["super_admin", "admin", "moderator"];
  const role = await askMenu("Select role:", roleChoices) as
    "super_admin" | "admin" | "moderator";

  log.blank();
  log.hr();

  // ── 2. Summary preview ─────────────────────────────────────────────────────

  console.log(`\n  ${c.bold}Review before creating:${c.reset}`);
  console.log(`    Name   : ${c.green}${name}${c.reset}`);
  console.log(`    Email  : ${c.green}${email}${c.reset}`);
  console.log(`    Role   : ${c.yellow}${role}${c.reset}`);
  console.log(`    Perms  : ${c.dim}${permissionsFor(role).length} permissions${c.reset}\n`);

  const confirm2 = await ask("Create this admin? (y/N):");
  if (confirm2.toLowerCase() !== "y") {
    log.warn("Cancelled. No changes were made.");
    rl.close();
    process.exit(0);
  }

  // ── 3. Connect to DB ──────────────────────────────────────────────────────

  log.blank();
  log.info(`Connecting to MongoDB...`);

  try {
    await mongoose.connect(MONGO_URI);
    log.ok("Connected to MongoDB.");
  } catch (err: any) {
    log.err("Could not connect to MongoDB: " + err.message);
    rl.close();
    process.exit(1);
  }

  // ── 4. Check for duplicate and delete if exists ─────────────────────────────

  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) {
    log.warn(`An admin with email "${email}" already exists.`);
    log.info(`Deleting existing record for "${email}" to recreate...`);
    await Admin.deleteOne({ email: email.toLowerCase() });
    log.ok("Existing admin deleted successfully.");
  }

  // ── 5. Create admin ──────────────────────────────────────────────────────────

  log.info("Creating admin record...");

  try {
    const admin = await Admin.create({
      name,
      email: email.toLowerCase(),
      password, // Mongoose hook will hash this
      role,
      permissions: permissionsFor(role),
      status: "active",
    });

    log.blank();
    log.hr();
    log.ok(`Admin created successfully!\n`);
    console.log(`    ${c.bold}ID     :${c.reset}  ${admin._id}`);
    console.log(`    ${c.bold}Name   :${c.reset}  ${admin.name}`);
    console.log(`    ${c.bold}Email  :${c.reset}  ${admin.email}`);
    console.log(`    ${c.bold}Role   :${c.reset}  ${admin.role}`);
    console.log(`    ${c.bold}Status :${c.reset}  ${admin.status}`);
    log.hr();
    log.blank();
    log.info("You can now log in at the admin panel with these credentials.");
    if (role !== "super_admin") {
      log.warn("Consider upgrading to super_admin if you need full access.");
    }
  } catch (err: any) {
    log.err("Failed to create admin: " + (err.message ?? err));
    await mongoose.disconnect();
    rl.close();
    process.exit(1);
  }

  // ── 6. Clean up ──────────────────────────────────────────────────────────

  await mongoose.disconnect();
  log.ok("Disconnected from MongoDB.");
  rl.close();
  process.exit(0);
}

main().catch((err) => {
  log.err("Unexpected error: " + err.message);
  process.exit(1);
});
