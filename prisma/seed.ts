import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  const saltRounds = 10;
  const password = "test";
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const testUser = await prisma.user.upsert({
    where: { email: "test@test.com" },
    update: {},
    create: {
      id: "clbopauhz0000umekzyiiw4ww",
      email: "test@test.com",
      name: "テストユーザ",
      role: "ADMIN",
      crypted_password: hashedPassword,
    },
  });
}
main()
  .then(() => {
    console.log("finished");
  })
  .catch((e) => {
    console.error(e);
  });
