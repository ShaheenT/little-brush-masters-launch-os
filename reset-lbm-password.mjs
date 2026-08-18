import { createClient } from "@supabase/supabase-js";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_ADMIN_SECRET;

if (!url || !secretKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_ADMIN_SECRET");
  process.exit(1);
}

const userId = "d2d6aafc-02b1-4080-8f4e-ce22e4e5ce37";

const rl = readline.createInterface({ input, output });

const password = await rl.question(
  "Enter the NEW Command Centre password: "
);

rl.close();

if (password.length < 8) {
  console.error("Password must contain at least 8 characters.");
  process.exit(1);
}

const supabase = createClient(url, secretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const { data, error } =
  await supabase.auth.admin.updateUserById(userId, {
    password,
  });

if (error) {
  console.error("Password reset failed:");
  console.error(error.message);
  process.exit(1);
}

console.log("");
console.log("SUCCESS: Command Centre password updated.");
console.log(`User: ${data.user.email}`);
console.log(`UID: ${data.user.id}`);
