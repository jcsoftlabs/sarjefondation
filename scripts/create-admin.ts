import "dotenv/config";
import { randomBytes } from "node:crypto";
import bcrypt from "bcrypt";
import { prisma } from "../lib/db";

// Seul moyen de créer un compte admin — il n'existe aucune page
// d'inscription publique (plan §7.1).
// Usage : npm run create-admin -- --email=admin@sarjefondation.com --name="Jean Dupont"

function parseArgs() {
  const args = new Map<string, string>();
  for (const arg of process.argv.slice(2)) {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (match) args.set(match[1], match[2]);
  }
  return args;
}

function generateTempPassword(): string {
  return randomBytes(9).toString("base64url");
}

async function main() {
  const args = parseArgs();
  const email = args.get("email");
  const name = args.get("name");

  if (!email || !name) {
    console.error(
      'Usage : npm run create-admin -- --email=admin@sarjefondation.com --name="Jean Dupont"',
    );
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.error(`Un compte existe déjà pour ${email}.`);
    process.exit(1);
  }

  const tempPassword = generateTempPassword();
  const passwordHash = await bcrypt.hash(tempPassword, 12);

  const user = await prisma.user.create({
    data: { email, name, passwordHash },
  });

  console.log("Compte admin créé :");
  console.log(`  Email          : ${user.email}`);
  console.log(`  Mot de passe   : ${tempPassword}`);
  console.log(
    "\nCommuniquez ce mot de passe de façon sécurisée. Il n'est pas récupérable une fois cette fenêtre fermée.",
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
