// One-off admin bootstrap — there's no self-serve admin signup (2-person
// user base, DR.md §1). The target user must already exist in our `users`
// table, which only happens after they've signed in at least once (GoTrue
// issues the JWT, UserSyncService.syncFromJwt upserts the row on first
// authenticated request). Usage: `npm run admin:promote -- someone@example.com`
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: npm run admin:promote -- <email>');
    process.exitCode = 1;
    return;
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' },
  });
  console.log(`Promoted ${user.email} (${user.id}) to ADMIN.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
