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
  const toolTemplate = JSON.stringify({
    name: "wordcount",
    command: ["bash", "-c", "wc input1 > output1"],
    cpu: 2,
    memory: 2014,
    inputs: [{ name: "input1", type: "text" }],
    outputs: [
      {
        name: "output1",
        type: "text",
      },
    ],
  });
  console.log(
    `INSERT INTO "Tool" (name,template,"updatedAt") VALUES ('wordcount',\'${toolTemplate}\',now());`
  );
  const tool = await prisma.tool.create({
    data: {
      name: "wordcount",
      template: toolTemplate,
    },
  });
  await prisma.job.create({
    data: {
      name: "wordcount",
      toolId: tool.id,
      command: ["bash","-c", "ls -l > output1"],
      cpu: 1,
      memory: 1024*1024,
      status: "created"
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
