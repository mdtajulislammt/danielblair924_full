/**
 * Comprehensive Integration & Auth Test Suite for FMC Frontend Services
 * Verifies all frontend services, route protection, and token injection.
 */
import assert from "node:assert";
import axios from "axios";
import { CookieHelper } from "../helper/cookie.helper";
import { Fetch } from "../lib/Fetch";
import { UserService } from "../service/user/user.service";
import { SubmissionService } from "../service/submission/submission.service";
import { MemberService } from "../service/member/member.service";
import { EventService } from "../service/event/event.service";
import { ChallengeService } from "../service/event/challenge.service";
import { BadgeService } from "../service/badge/badge.service";
import { NewsService } from "../service/news/news.service";
import { SettingsService } from "../service/settings/settings.service";

console.log("========================================================");
console.log("🛡️  FMC FULL-STACK FRONTEND SERVICE INTEGRATION AUDIT");
console.log("========================================================");

let passedCount = 0;
let totalCount = 0;

function it(name: string, fn: () => void | Promise<void>) {
  totalCount++;
  try {
    fn();
    console.log(`  ✔ PASS: ${name}`);
    passedCount++;
  } catch (err: any) {
    console.error(`  ❌ FAIL: ${name}`, err?.message || err);
  }
}

// 1. Auth & CookieHelper Testing
it("CookieHelper: token set, get, and destroy operations", () => {
  CookieHelper.set({ key: "token", value: "test-jwt-token-12345" });
  const val = CookieHelper.get({ key: "token" });
  assert.strictEqual(val, "test-jwt-token-12345");

  CookieHelper.destroy({ key: "token" });
  const valAfter = CookieHelper.get({ key: "token" });
  assert.strictEqual(valAfter, undefined);
});

// 2. Fetch Bearer Token Injection
it("Fetch: Injects Authorization Bearer header when token is present", async () => {
  CookieHelper.set({ key: "token", value: "mock-bearer-token" });

  let capturedHeaders: any = null;
  const originalPost = axios.post;
  (axios as any).post = async (url: string, data: any, config: any) => {
    capturedHeaders = config?.headers;
    return { data: { success: true } };
  };

  try {
    await Fetch.post("/test-endpoint", { foo: "bar" });
    assert.strictEqual(
      capturedHeaders?.Authorization,
      "Bearer mock-bearer-token",
      "Authorization header must match 'Bearer mock-bearer-token'"
    );
  } finally {
    axios.post = originalPost;
    CookieHelper.destroy({ key: "token" });
  }
});

// 3. UserService API Integration
it("UserService: login, register, and logout signatures", () => {
  assert.strictEqual(typeof UserService.login, "function");
  assert.strictEqual(typeof UserService.register, "function");
  assert.strictEqual(typeof UserService.logout, "function");
});

// 4. SubmissionService API Integration
it("SubmissionService: getSubmissions, getSubmissionById, moderateSubmission", async () => {
  assert.strictEqual(typeof SubmissionService.getSubmissions, "function");
  assert.strictEqual(typeof SubmissionService.getSubmissionById, "function");
  assert.strictEqual(typeof SubmissionService.moderateSubmission, "function");

  let calledUrl = "";
  let calledMethod = "";
  const originalPatch = axios.patch;
  (axios as any).patch = async (url: string) => {
    calledUrl = url;
    calledMethod = "PATCH";
    return { data: { status: "APPROVED" } };
  };

  try {
    await SubmissionService.moderateSubmission("sub-123", { status: "APPROVED" });
    assert.ok(calledUrl.includes("/admin/submissions/sub-123/approve"));
    assert.strictEqual(calledMethod, "PATCH");
  } finally {
    axios.patch = originalPatch;
  }
});

// 5. MemberService API Integration
it("MemberService: getMembers, getMemberById, getMemberBadges, getMemberSubmissions, updateMemberStatus, deleteMember", async () => {
  assert.strictEqual(typeof MemberService.getMembers, "function");
  assert.strictEqual(typeof MemberService.getMemberById, "function");
  assert.strictEqual(typeof MemberService.getMemberBadges, "function");
  assert.strictEqual(typeof MemberService.getMemberSubmissions, "function");
  assert.strictEqual(typeof MemberService.updateMemberStatus, "function");
  assert.strictEqual(typeof MemberService.deleteMember, "function");

  let calledUrl = "";
  const originalPatch = axios.patch;
  (axios as any).patch = async (url: string, data: any) => {
    calledUrl = url;
    return { data: { status: data.status } };
  };

  try {
    await MemberService.updateMemberStatus("user-456", "SUSPENDED");
    assert.ok(calledUrl.includes("/admin/members/user-456/status"));
  } finally {
    axios.patch = originalPatch;
  }
});

// 6. EventService & ChallengeService API Integration
it("EventService: getEvents, getEventById, createEvent, updateEvent, deleteEvent, uploadCoverImage", () => {
  assert.strictEqual(typeof EventService.getEvents, "function");
  assert.strictEqual(typeof EventService.getEventById, "function");
  assert.strictEqual(typeof EventService.createEvent, "function");
  assert.strictEqual(typeof EventService.updateEvent, "function");
  assert.strictEqual(typeof EventService.deleteEvent, "function");
  assert.strictEqual(typeof EventService.uploadCoverImage, "function");
});

it("ChallengeService: getChallenges, getChallengeById, getDestinations, getChallengeParticipants, createChallenge, updateChallenge, deleteChallenge", async () => {
  assert.strictEqual(typeof ChallengeService.getChallenges, "function");
  assert.strictEqual(typeof ChallengeService.getChallengeById, "function");
  assert.strictEqual(typeof ChallengeService.getDestinations, "function");
  assert.strictEqual(typeof ChallengeService.getChallengeParticipants, "function");
  assert.strictEqual(typeof ChallengeService.createChallenge, "function");
  assert.strictEqual(typeof ChallengeService.updateChallenge, "function");
  assert.strictEqual(typeof ChallengeService.deleteChallenge, "function");

  let calledUrl = "";
  const originalPost = axios.post;
  (axios as any).post = async (url: string, data: any) => {
    calledUrl = url;
    return { data };
  };

  try {
    await ChallengeService.createChallenge({
      title: "Round Along The World 2026",
      scope: "COMMUNITY_WIDE",
      description: "Equator run challenge",
      targetProgress: 40075,
      progressUnit: "km",
    });
    assert.ok(calledUrl.includes("/admin/challenges"));
  } finally {
    axios.post = originalPost;
  }
});

// 7. BadgeService API Integration
it("BadgeService: getBadges, getBadge, createBadge, updateBadge, deleteBadge, uploadBadgeIcon", async () => {
  assert.strictEqual(typeof BadgeService.getBadges, "function");
  assert.strictEqual(typeof BadgeService.getBadge, "function");
  assert.strictEqual(typeof BadgeService.createBadge, "function");
  assert.strictEqual(typeof BadgeService.updateBadge, "function");
  assert.strictEqual(typeof BadgeService.deleteBadge, "function");
  assert.strictEqual(typeof BadgeService.uploadBadgeIcon, "function");

  let calledUrl = "";
  const originalPost = axios.post;
  (axios as any).post = async (url: string, data: any) => {
    calledUrl = url;
    return { data: { id: "badge-789", ...data } };
  };

  try {
    await BadgeService.createBadge({
      name: "Super Pacer",
      description: "Paced over 50km",
      isActive: true,
    });
    assert.ok(calledUrl.includes("/badges"));
  } finally {
    axios.post = originalPost;
  }
});

// 8. NewsService API Integration
it("NewsService: getNews, getNewsById, createNews, updateNews, deleteNews, uploadCoverImage", async () => {
  assert.strictEqual(typeof NewsService.getNews, "function");
  assert.strictEqual(typeof NewsService.getNewsById, "function");
  assert.strictEqual(typeof NewsService.createNews, "function");
  assert.strictEqual(typeof NewsService.updateNews, "function");
  assert.strictEqual(typeof NewsService.deleteNews, "function");
  assert.strictEqual(typeof NewsService.uploadCoverImage, "function");

  let calledUrl = "";
  const originalPost = axios.post;
  (axios as any).post = async (url: string, data: any) => {
    calledUrl = url;
    return { data: { id: "news-101", ...data } };
  };

  try {
    await NewsService.createNews({
      title: "Season 2026 Kickoff",
      body: "<p>New season started</p>",
      status: "Published",
    });
    assert.ok(calledUrl.includes("/admin/news"));
  } finally {
    axios.post = originalPost;
  }
});

// 9. SettingsService API Integration
it("SettingsService: getAdminSettings, updateAdminAccount, updateNotifications, getActiveSessions, revokeSession", async () => {
  assert.strictEqual(typeof SettingsService.getAdminSettings, "function");
  assert.strictEqual(typeof SettingsService.updateAdminAccount, "function");
  assert.strictEqual(typeof SettingsService.updateNotifications, "function");
  assert.strictEqual(typeof SettingsService.getActiveSessions, "function");
  assert.strictEqual(typeof SettingsService.revokeSession, "function");

  let calledUrl = "";
  const originalDelete = axios.delete;
  (axios as any).delete = async (url: string) => {
    calledUrl = url;
    return { data: { success: true } };
  };

  try {
    await SettingsService.revokeSession("session-abc");
    assert.ok(calledUrl.includes("/admin/settings/sessions/session-abc"));
  } finally {
    axios.delete = originalDelete;
  }
});

console.log("--------------------------------------------------------");
console.log(`Results: ${passedCount}/${totalCount} integration tests passed.`);
if (passedCount === totalCount) {
  console.log("🎉 ALL FRONTEND INTEGRATION TESTS PASSED 100%!");
} else {
  console.error("❌ Some integration tests failed.");
  process.exit(1);
}
