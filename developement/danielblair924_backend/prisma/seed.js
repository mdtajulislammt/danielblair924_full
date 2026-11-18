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
  console.log('🌱 Starting Rich FMC Platform Database Seed...');
  console.log('Connecting to:', connectionString);

  // Strong production-grade distinct passwords for seed accounts
  const superAdminPassword = process.env.SEED_SUPERADMIN_PASSWORD || 'FMC_Admin#Secure2026!';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'FMC_Moderator#2026!';
  const memberPassword = process.env.SEED_MEMBER_PASSWORD || 'FMC_Runner#Club2026!';

  const superAdminHash = await bcrypt.hash(superAdminPassword, 10);
  const adminHash = await bcrypt.hash(adminPassword, 10);
  const memberHash = await bcrypt.hash(memberPassword, 10);

  // ---------------------------------------------------------------------------
  // 1. SEED USERS FOR ALL 3 ROLES (SUPERADMIN, ADMIN, MEMBER)
  // ---------------------------------------------------------------------------
  // A) Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@fmc.com' },
    update: {
      passwordHash: superAdminHash,
      role: 'SUPERADMIN',
      status: 'ACTIVE',
      fname: 'FMC',
      lname: 'SuperAdmin',
      username: 'superadmin',
    },
    create: {
      email: 'admin@fmc.com',
      username: 'superadmin',
      passwordHash: superAdminHash,
      fname: 'FMC',
      lname: 'SuperAdmin',
      role: 'SUPERADMIN',
      status: 'ACTIVE',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      country: 'United Kingdom',
      city: 'London',
    },
  });
  console.log('✔ Super Admin created:', superAdmin.email);

  // B) Moderator / Club Admin
  const clubAdmin = await prisma.user.upsert({
    where: { email: 'moderator@fmc.com' },
    update: {
      passwordHash: adminHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      fname: 'Sarah',
      lname: 'Jenkins',
      username: 'sarah_admin',
    },
    create: {
      email: 'moderator@fmc.com',
      username: 'sarah_admin',
      passwordHash: adminHash,
      fname: 'Sarah',
      lname: 'Jenkins',
      role: 'ADMIN',
      status: 'ACTIVE',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      country: 'United Kingdom',
      city: 'Manchester',
    },
  });
  console.log('✔ Admin/Moderator created:', clubAdmin.email);

  // C) Primary Demo Runner (Marcus Vance)
  const runner1 = await prisma.user.upsert({
    where: { email: 'runner@fmc.com' },
    update: {
      passwordHash: memberHash,
      role: 'MEMBER',
      status: 'ACTIVE',
      fname: 'Marcus',
      lname: 'Vance',
      username: 'marcus_vance',
      totalDistanceKm: 142.5,
    },
    create: {
      email: 'runner@fmc.com',
      username: 'marcus_vance',
      passwordHash: memberHash,
      fname: 'Marcus',
      lname: 'Vance',
      role: 'MEMBER',
      status: 'ACTIVE',
      totalDistanceKm: 142.5,
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      country: 'United Kingdom',
      city: 'London',
    },
  });

  // D) Runner 2 (Emma Watson)
  const runner2 = await prisma.user.upsert({
    where: { email: 'emma.watson@fmc.com' },
    update: {
      passwordHash: memberHash,
      role: 'MEMBER',
      status: 'ACTIVE',
      fname: 'Emma',
      lname: 'Watson',
      username: 'emma_w',
      totalDistanceKm: 88.0,
    },
    create: {
      email: 'emma.watson@fmc.com',
      username: 'emma_w',
      passwordHash: memberHash,
      fname: 'Emma',
      lname: 'Watson',
      role: 'MEMBER',
      status: 'ACTIVE',
      totalDistanceKm: 88.0,
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      country: 'United Kingdom',
      city: 'Edinburgh',
    },
  });

  // E) Runner 3 (David Miller)
  const runner3 = await prisma.user.upsert({
    where: { email: 'david.miller@fmc.com' },
    update: {
      passwordHash: memberHash,
      role: 'MEMBER',
      status: 'ACTIVE',
      fname: 'David',
      lname: 'Miller',
      username: 'david_m',
      totalDistanceKm: 65.2,
    },
    create: {
      email: 'david.miller@fmc.com',
      username: 'david_m',
      passwordHash: memberHash,
      fname: 'David',
      lname: 'Miller',
      role: 'MEMBER',
      status: 'ACTIVE',
      totalDistanceKm: 65.2,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      country: 'United Kingdom',
      city: 'Bristol',
    },
  });

  // F) Runner 4 (Nadia Islam)
  const runner4 = await prisma.user.upsert({
    where: { email: 'nadia.islam@fmc.com' },
    update: {
      passwordHash: memberHash,
      role: 'MEMBER',
      status: 'ACTIVE',
      fname: 'Nadia',
      lname: 'Islam',
      username: 'nadia_i',
      totalDistanceKm: 110.8,
    },
    create: {
      email: 'nadia.islam@fmc.com',
      username: 'nadia_i',
      passwordHash: memberHash,
      fname: 'Nadia',
      lname: 'Islam',
      role: 'MEMBER',
      status: 'ACTIVE',
      totalDistanceKm: 110.8,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      country: 'United Kingdom',
      city: 'Birmingham',
    },
  });

  console.log('✔ Seeded 6 Users across roles (SUPERADMIN, ADMIN, MEMBER)');

  // ---------------------------------------------------------------------------
  // 2. SEED SAMPLE BADGES
  // ---------------------------------------------------------------------------
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
    {
      slug: 'first-mile-finisher',
      name: 'First Mile Finisher',
      description: 'Completed and verified your very first official FMC mile.',
      tagType: 'SPECIAL',
      iconUrl: 'https://placehold.co/100x100/f59e0b/ffffff?text=1stMile',
    },
  ];

  for (const b of badgesData) {
    await prisma.badge.upsert({
      where: { slug: b.slug },
      update: {
        name: b.name,
        description: b.description,
        tagType: b.tagType,
        iconUrl: b.iconUrl,
        isActive: true,
      },
      create: {
        slug: b.slug,
        name: b.name,
        description: b.description,
        tagType: b.tagType,
        iconUrl: b.iconUrl,
        isActive: true,
      },
    });
  }
  console.log('✔ Badges seeded');

  // ---------------------------------------------------------------------------
  // 3. SEED EVENTS (PUBLISHED & DRAFT)
  // ---------------------------------------------------------------------------
  const event1 = await prisma.event.upsert({
    where: { id: 'e1000000-0000-0000-0000-000000000001' },
    update: {
      title: 'London Thames Sunrise 10K',
      description: 'Kick off your morning running along the scenic River Thames in central London.',
      status: 'PUBLISHED',
      distanceType: '10K',
      category: 'Road Race',
      eventDate: new Date('2026-12-05T08:00:00Z'),
      coverImageUrl: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800',
    },
    create: {
      id: 'e1000000-0000-0000-0000-000000000001',
      title: 'London Thames Sunrise 10K',
      description: 'Kick off your morning running along the scenic River Thames in central London.',
      status: 'PUBLISHED',
      distanceType: '10K',
      category: 'Road Race',
      eventDate: new Date('2026-12-05T08:00:00Z'),
      coverImageUrl: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800',
      registeredCount: 4,
    },
  });

  const event2 = await prisma.event.upsert({
    where: { id: 'e2000000-0000-0000-0000-000000000002' },
    update: {
      title: 'Highland Trail Half Marathon',
      description: 'A breathtaking and challenging half marathon through rugged Scottish hills.',
      status: 'PUBLISHED',
      distanceType: 'Half Marathon',
      category: 'Trail',
      eventDate: new Date('2026-12-20T09:30:00Z'),
      coverImageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
    },
    create: {
      id: 'e2000000-0000-0000-0000-000000000002',
      title: 'Highland Trail Half Marathon',
      description: 'A breathtaking and challenging half marathon through rugged Scottish hills.',
      status: 'PUBLISHED',
      distanceType: 'Half Marathon',
      category: 'Trail',
      eventDate: new Date('2026-12-20T09:30:00Z'),
      coverImageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
      registeredCount: 2,
    },
  });

  const event3 = await prisma.event.upsert({
    where: { id: 'e3000000-0000-0000-0000-000000000003' },
    update: {
      title: 'New Year Midnight 5K',
      description: 'Celebrate the arrival of the New Year under the stars with FMC club runners.',
      status: 'PUBLISHED',
      distanceType: '5K',
      category: 'Night Run',
      eventDate: new Date('2026-12-31T23:50:00Z'),
      coverImageUrl: 'https://images.unsplash.com/photo-1486218119243-13883505764c?w=800',
    },
    create: {
      id: 'e3000000-0000-0000-0000-000000000003',
      title: 'New Year Midnight 5K',
      description: 'Celebrate the arrival of the New Year under the stars with FMC club runners.',
      status: 'PUBLISHED',
      distanceType: '5K',
      category: 'Night Run',
      eventDate: new Date('2026-12-31T23:50:00Z'),
      coverImageUrl: 'https://images.unsplash.com/photo-1486218119243-13883505764c?w=800',
      registeredCount: 3,
    },
  });

  console.log('✔ Seeded 3 Published Events');

  // ---------------------------------------------------------------------------
  // 4. SEED CHALLENGES (RATW COMMUNITY & INDIVIDUAL)
  // ---------------------------------------------------------------------------
  const ratwChallenge = await prisma.challenge.upsert({
    where: { id: 'c1000000-0000-0000-0000-000000000001' },
    update: {
      title: 'Round Along The World 2026',
      description: 'Unite runners globally to conquer the equator distance of 40,075 km collectively.',
      scope: 'COMMUNITY_WIDE',
      status: 'ACTIVE',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      targetProgress: 40075.0,
      currentProgress: 1845.2,
      progressUnit: 'km',
      coverImageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800',
    },
    create: {
      id: 'c1000000-0000-0000-0000-000000000001',
      title: 'Round Along The World 2026',
      description: 'Unite runners globally to conquer the equator distance of 40,075 km collectively.',
      scope: 'COMMUNITY_WIDE',
      status: 'ACTIVE',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      targetProgress: 40075.0,
      currentProgress: 1845.2,
      progressUnit: 'km',
      coverImageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800',
    },
  });

  const sprintChallenge = await prisma.challenge.upsert({
    where: { id: 'c2000000-0000-0000-0000-000000000002' },
    update: {
      title: 'December 100K Endurance Streak',
      description: 'Record a total of 100km individually within the month of December.',
      scope: 'INDIVIDUAL',
      status: 'ACTIVE',
      startDate: new Date('2026-12-01'),
      endDate: new Date('2026-12-31'),
      targetProgress: 100.0,
      currentProgress: 42.0,
      progressUnit: 'km',
      coverImageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
    },
    create: {
      id: 'c2000000-0000-0000-0000-000000000002',
      title: 'December 100K Endurance Streak',
      description: 'Record a total of 100km individually within the month of December.',
      scope: 'INDIVIDUAL',
      status: 'ACTIVE',
      startDate: new Date('2026-12-01'),
      endDate: new Date('2026-12-31'),
      targetProgress: 100.0,
      currentProgress: 42.0,
      progressUnit: 'km',
      coverImageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
    },
  });

  console.log('✔ Seeded 2 Active Challenges');

  // ---------------------------------------------------------------------------
  // 5. SEED SUBMISSIONS (PENDING, APPROVED, REJECTED)
  // ---------------------------------------------------------------------------
  const submissionsData = [
    {
      id: 's1000000-0000-0000-0000-000000000001',
      userId: runner1.id,
      eventId: event1.id,
      challengeId: ratwChallenge.id,
      activityType: 'RUNNING',
      distanceKm: 10.2,
      duration: '48m 15s',
      pace: '4:44/km',
      runDate: new Date('2026-11-17T07:30:00Z'),
      status: 'PENDING',
      source: 'MANUAL',
      stravaImageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600',
      postedOnTikTok: true,
      taggedClub: true,
      usedHashtag: true,
    },
    {
      id: 's2000000-0000-0000-0000-000000000002',
      userId: runner2.id,
      eventId: event1.id,
      challengeId: ratwChallenge.id,
      activityType: 'RUNNING',
      distanceKm: 5.0,
      duration: '24m 50s',
      pace: '4:58/km',
      runDate: new Date('2026-11-16T18:20:00Z'),
      status: 'PENDING',
      source: 'STRAVA_AUTO',
      stravaImageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600',
      postedOnTikTok: false,
      taggedClub: true,
      usedHashtag: true,
    },
    {
      id: 's3000000-0000-0000-0000-000000000003',
      userId: runner3.id,
      eventId: event2.id,
      challengeId: ratwChallenge.id,
      activityType: 'RUNNING',
      distanceKm: 21.1,
      duration: '1h 45m',
      pace: '4:59/km',
      runDate: new Date('2026-11-15T09:00:00Z'),
      status: 'APPROVED',
      source: 'MANUAL',
      stravaImageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=600',
      postedOnTikTok: true,
      taggedClub: true,
      usedHashtag: true,
      reviewedAt: new Date('2026-11-15T14:00:00Z'),
      reviewedById: superAdmin.id,
    },
    {
      id: 's4000000-0000-0000-0000-000000000004',
      userId: runner4.id,
      eventId: event3.id,
      challengeId: sprintChallenge.id,
      activityType: 'RUNNING',
      distanceKm: 8.5,
      duration: '42m 10s',
      pace: '4:58/km',
      runDate: new Date('2026-11-14T20:15:00Z'),
      status: 'APPROVED',
      source: 'MANUAL',
      stravaImageUrl: 'https://images.unsplash.com/photo-1486218119243-13883505764c?w=600',
      postedOnTikTok: true,
      taggedClub: true,
      usedHashtag: true,
      reviewedAt: new Date('2026-11-15T10:00:00Z'),
      reviewedById: clubAdmin.id,
    },
    {
      id: 's5000000-0000-0000-0000-000000000005',
      userId: runner1.id,
      eventId: null,
      challengeId: ratwChallenge.id,
      activityType: 'RUNNING',
      distanceKm: 15.0,
      duration: '1h 12m',
      pace: '4:48/km',
      runDate: new Date('2026-11-13T06:45:00Z'),
      status: 'REJECTED',
      rejectionReason: 'GPS evidence image was unreadable / corrupt.',
      source: 'MANUAL',
      stravaImageUrl: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=600',
      postedOnTikTok: false,
      taggedClub: false,
      usedHashtag: false,
      reviewedAt: new Date('2026-11-13T12:00:00Z'),
      reviewedById: superAdmin.id,
    },
  ];

  for (const s of submissionsData) {
    await prisma.submission.upsert({
      where: { id: s.id },
      update: {
        distanceKm: s.distanceKm,
        duration: s.duration,
        pace: s.pace,
        status: s.status,
        rejectionReason: s.rejectionReason,
        reviewedAt: s.reviewedAt,
        reviewedById: s.reviewedById,
      },
      create: s,
    });
  }
  console.log('✔ Seeded 5 Submissions (2 Pending, 2 Approved, 1 Rejected)');

  // ---------------------------------------------------------------------------
  // 6. SEED NEWS POST
  // ---------------------------------------------------------------------------
  await prisma.newsPost.upsert({
    where: { id: 'n1000000-0000-0000-0000-000000000001' },
    update: {
      title: 'Welcome to the FMC Global Season 2026',
      body: '<p>Welcome runners, admins, and pacing enthusiasts to the newly revamped FMC portal. Join our upcoming 10K events and log your runs seamlessly via Strava auto-sync!</p>',
      status: 'PUBLISHED',
      publishDate: new Date('2026-11-01T00:00:00Z'),
      coverImageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
    },
    create: {
      id: 'n1000000-0000-0000-0000-000000000001',
      title: 'Welcome to the FMC Global Season 2026',
      body: '<p>Welcome runners, admins, and pacing enthusiasts to the newly revamped FMC portal. Join our upcoming 10K events and log your runs seamlessly via Strava auto-sync!</p>',
      status: 'PUBLISHED',
      publishDate: new Date('2026-11-01T00:00:00Z'),
      coverImageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
      authorId: superAdmin.id,
    },
  });

  const news2 = await prisma.newsPost.upsert({
    where: { id: 'n2000000-0000-0000-0000-000000000002' },
    update: {
      title: 'FMC Round Along The World Milestone: 1,800+ KM Conquered',
      body: '<p>Our club community has officially surpassed the 1,800 kilometer mark in our equator challenge! Keep submitting your verified runs to earn the exclusive Global Trailblazer badge.</p>',
      status: 'PUBLISHED',
      publishDate: new Date('2026-11-15T00:00:00Z'),
      coverImageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800',
    },
    create: {
      id: 'n2000000-0000-0000-0000-000000000002',
      title: 'FMC Round Along The World Milestone: 1,800+ KM Conquered',
      body: '<p>Our club community has officially surpassed the 1,800 kilometer mark in our equator challenge! Keep submitting your verified runs to earn the exclusive Global Trailblazer badge.</p>',
      status: 'PUBLISHED',
      publishDate: new Date('2026-11-15T00:00:00Z'),
      coverImageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800',
      authorId: superAdmin.id,
    },
  });
  console.log('✔ Seeded 2 Published News Posts');

  // ---------------------------------------------------------------------------
  // 7. SEED NOTIFICATION SETTINGS
  // ---------------------------------------------------------------------------
  await prisma.notificationSettings.upsert({
    where: { userId: superAdmin.id },
    update: {
      newSubmissionAlert: true,
      newRegistrationAlert: true,
      weeklySummaryEmail: false,
    },
    create: {
      userId: superAdmin.id,
      newSubmissionAlert: true,
      newRegistrationAlert: true,
      weeklySummaryEmail: false,
    },
  });

  console.log('✅ Rich Database Seed Completed Successfully!');
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
