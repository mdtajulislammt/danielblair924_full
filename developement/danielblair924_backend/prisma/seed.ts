import 'dotenv/config';
import { PrismaClient } from '../dist/src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:root@127.0.0.1:5434/testdb?schema=public';

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting FMC Platform Database Seed...');
  console.log('Connecting to:', connectionString);

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Seed Super Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fmc.com' },
    update: {
      passwordHash,
      role: 'SUPERADMIN',
      status: 'ACTIVE',
    },
    create: {
      email: 'admin@fmc.com',
      username: 'admin',
      passwordHash,
      fname: 'FMC',
      lname: 'Administrator',
      role: 'SUPERADMIN',
      status: 'ACTIVE',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      country: 'United Kingdom',
    },
  });
  console.log('✔ Super Admin created:', admin.email);

  // 2. Seed Demo Runner
  const runner = await prisma.user.upsert({
    where: { email: 'runner@fmc.com' },
    update: {
      passwordHash,
      role: 'MEMBER',
      status: 'ACTIVE',
    },
    create: {
      email: 'runner@fmc.com',
      username: 'marcus_vance',
      passwordHash,
      fname: 'Marcus',
      lname: 'Vance',
      role: 'MEMBER',
      status: 'ACTIVE',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      country: 'United Kingdom',
    },
  });
  console.log('✔ Demo Runner created:', runner.email);

  // 3. Seed Sample Badges
  const badgesData = [
    {
      slug: 'centurion-pacer',
      name: 'Centurion Pacer',
      description: 'Completed 100km total recorded distance across FMC events.',
      tagType: 'EVENT',
      iconUrl: 'https://placehold.co/100x100/10b981/ffffff?text=100K',
    },
    {
      slug: 'global-trailblazer',
      name: 'Global Trailblazer',
      description: 'Submitted 10 verified runs towards the Round Along The World challenge.',
      tagType: 'RATW',
      iconUrl: 'https://placehold.co/100x100/3b82f6/ffffff?text=RATW',
    },
    {
      slug: 'night-hawk-runner',
      name: 'Night Hawk Runner',
      description: 'Completed an official night run between 10 PM and 4 AM.',
      tagType: 'SPECIAL',
      iconUrl: 'https://placehold.co/100x100/8b5cf6/ffffff?text=Night',
    },
  ];

  for (const b of badgesData) {
    await prisma.badge.upsert({
      where: { slug: b.slug },
      update: {
        name: b.name,
        description: b.description,
        tagType: b.tagType as any,
        iconUrl: b.iconUrl,
        isActive: true,
      },
      create: {
        slug: b.slug,
        name: b.name,
        description: b.description,
        tagType: b.tagType as any,
        iconUrl: b.iconUrl,
        isActive: true,
      },
    });
  }
  console.log('✔ Sample Badges seeded');

  // 4. Seed RATW Challenge
  await prisma.challenge.create({
    data: {
      title: 'Round Along The World 2026',
      description: 'Unite runners globally to conquer the equator distance of 40,075 km collectively.',
      scope: 'COMMUNITY_WIDE',
      status: 'ACTIVE',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      targetProgress: 40075.0,
      currentProgress: 1420.5,
      progressUnit: 'km',
      coverImageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800',
    },
  }).catch(() => null);
  console.log('✔ Seeded RATW Challenge');

  // 4.1 Seed Sample Events
  const eventsData = [
    {
      title: '5K Community Run',
      description: 'Join runners worldwide for our weekly 5K community run. Complete the distance, record your pace, and share your journey!',
      distanceType: '5KM',
      category: 'General',
      status: 'ACTIVE',
      eventDate: new Date('2026-11-20T08:00:00Z'),
      coverImageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
      registeredCount: 18,
    },
    {
      title: 'Sunset City Run 10K',
      description: 'Golden hour pacing through the city skyline. Capture the sunset on your run and submit your evidence.',
      distanceType: '10KM',
      category: 'City',
      status: 'UPCOMING',
      eventDate: new Date('2026-11-28T17:30:00Z'),
      coverImageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800',
      registeredCount: 34,
    },
    {
      title: 'Trailblazer 15K Challenge',
      description: 'Conquer the rugged trails and push your endurance to the next level.',
      distanceType: '15KM',
      category: 'Trail',
      status: 'UPCOMING',
      eventDate: new Date('2026-12-05T07:00:00Z'),
      coverImageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
      registeredCount: 12,
    },
  ];

  for (const ev of eventsData) {
    const existing = await prisma.event.findFirst({ where: { title: ev.title } });
    if (!existing) {
      await prisma.event.create({
        data: {
          title: ev.title,
          description: ev.description,
          distanceType: ev.distanceType,
          category: ev.category,
          status: ev.status as any,
          eventDate: ev.eventDate,
          coverImageUrl: ev.coverImageUrl,
          registeredCount: ev.registeredCount,
          requirements: {
            create: {
              completeDistance: true,
              uploadRunningEvidence: true,
              postOnTikTok: true,
              tiktokCaptionInstructions: 'Tag @FirstMileClub and use #FirstMileClub in your TikTok caption!',
              tagFirstMileClub: true,
              useSpecificHashtag: true,
              specificHashtag: '#FirstMileClub',
            },
          },
        },
      });
    }
  }
  console.log('✔ Seeded Club Events');

  // 5. Seed News Post
  await prisma.newsPost.create({
    data: {
      title: 'Welcome to the FMC Global Season 2026',
      body: '<p>Welcome runners, admins, and pacing enthusiasts to the revamped FMC portal.</p>',
      status: 'PUBLISHED',
      publishDate: new Date(),
      coverImageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
      authorId: admin.id,
    },
  }).catch(() => null);
  console.log('✔ Sample News Post seeded');

  // 6. Seed Notification Settings
  await prisma.notificationSettings.upsert({
    where: { userId: admin.id },
    update: {
      newSubmissionAlert: true,
      newRegistrationAlert: true,
      weeklySummaryEmail: false,
    },
    create: {
      userId: admin.id,
      newSubmissionAlert: true,
      newRegistrationAlert: true,
      weeklySummaryEmail: false,
    },
  }).catch(() => null);
  console.log('✔ Notification Settings seeded');

  console.log('✅ Database Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
