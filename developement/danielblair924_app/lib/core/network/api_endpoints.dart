class ApiEndpoints {
  // Authentication & Member Identity
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String forgotPassword = '/auth/forgot-password';
  static const String verifyOtp = '/auth/verify-otp';
  static const String resetPassword = '/auth/reset-password';
  static const String me = '/auth/me';

  // Run Submissions & Evidence
  static const String submissions = '/submissions';
  static const String mySubmissions = '/submissions/my';
  static String submissionDetails(String id) => '/submissions/$id';

  // Events
  static const String events = '/events';
  static String eventDetails(String id) => '/events/$id';
  static String joinEvent(String id) => '/events/$id/join';

  // Challenges (RATW - Run Around The World)
  static const String challenges = '/challenges';
  static String challengeDetails(String id) => '/challenges/$id';
  static String challengeDestinations(String id) => '/challenges/$id/destinations';
  static String challengeParticipants(String id) => '/challenges/$id/participants';

  // Leaderboard & Members
  static const String leaderboard = '/members/leaderboard';
  static const String myStats = '/members/me/stats';
  static const String updateProfile = '/members/me';
  static String memberProfile(String id) => '/members/$id';

  // Badges & Gamification
  static const String badges = '/badges';
  static const String myBadges = '/badges/my';

  // News & Announcements
  static const String news = '/news';
  static String newsDetails(String id) => '/news/$id';

  // File Upload (Static / Local multipart)
  static const String upload = '/upload';

  // Strava Auto-Sync Integration
  static const String stravaAuthUrl = '/strava/auth-url';
  static const String stravaStatus = '/strava/status';
  static const String stravaDisconnect = '/strava/disconnect';
  static const String stravaExchange = '/strava/exchange';
}

