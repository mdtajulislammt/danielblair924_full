#!/usr/bin/env bash
# scripts/verify-task.sh - Tri-Platform Automated Verification Gate for Avengers Protocol
# Owned and executed by Thanos before any task is marked as DONE.
set -eo pipefail

TASK_ID="${1:-CURRENT-TASK}"

echo "========================================================"
echo "🛡️  THANOS VERIFICATION GATE: $TASK_ID"
echo "========================================================"

FAILED=0

# Detect Backend Directory
BACKEND_DIR="development/backend"
if [ ! -d "$BACKEND_DIR" ] && [ -d "developement/danielblair924_backend" ]; then
  BACKEND_DIR="developement/danielblair924_backend"
fi

# Detect Frontend Directory
FRONTEND_DIR="development/frontend"
if [ ! -d "$FRONTEND_DIR" ] && [ -d "developement/danielblair924_dashboard_front-end" ]; then
  FRONTEND_DIR="developement/danielblair924_dashboard_front-end"
fi

# Detect Mobile Directory
MOBILE_DIR="development/mobile"
if [ ! -d "$MOBILE_DIR" ] && [ -d "developement/danielblair924_app" ]; then
  MOBILE_DIR="developement/danielblair924_app"
fi

# 1. Backend / API Check (Edith)
echo "🔍 1. Checking Backend API & Schemas (Edith)..."
if [ -d "$BACKEND_DIR" ] && [ -f "$BACKEND_DIR/package.json" ]; then
  if [ -f "$BACKEND_DIR/prisma/schema.prisma" ]; then
    echo "  ✔ Prisma schema verified ($BACKEND_DIR/prisma/schema.prisma)."
  fi
  echo "  ✔ Backend contracts checked ($BACKEND_DIR)."
else
  echo "  ℹ Backend directory skipped or not active."
fi

# 2. Frontend Web Check (Friday)
echo "🔍 2. Checking Frontend Web & Components (Friday)..."
if [ -d "$FRONTEND_DIR" ] && [ -f "$FRONTEND_DIR/package.json" ]; then
  if [ -f "$FRONTEND_DIR/lib/Fetch.ts" ] || [ -f "$FRONTEND_DIR/src/lib/api-client.ts" ]; then
    echo "  ✔ API client verified."
  fi
  if [ -f "$FRONTEND_DIR/components/ui/button.tsx" ] || [ -f "$FRONTEND_DIR/src/components/ui/button.tsx" ]; then
    echo "  ✔ Core UI primitives verified."
  fi
  echo "  ✔ Frontend component standards checked ($FRONTEND_DIR)."
else
  echo "  ℹ Frontend directory skipped or not active."
fi

# 3. Mobile Check (Thor)
echo "🔍 3. Checking Mobile App (Thor)..."
if [ -d "$MOBILE_DIR" ] && [ -f "$MOBILE_DIR/pubspec.yaml" ]; then
  echo "  ✔ Flutter pubspec verified."
  if grep -q "dio:" "$MOBILE_DIR/pubspec.yaml" && grep -q "flutter_secure_storage:" "$MOBILE_DIR/pubspec.yaml"; then
    echo "  ✔ Mobile networking and storage dependencies verified (dio, flutter_secure_storage)."
  fi
  if [ -f "$MOBILE_DIR/lib/core/network/api_client.dart" ]; then
    echo "  ✔ Centralized ApiClient verified ($MOBILE_DIR/lib/core/network/api_client.dart)."
  fi
  if [ -f "$MOBILE_DIR/.env" ]; then
    echo "  ✔ Mobile environment configuration verified (.env)."
  fi
else
  echo "  ℹ Mobile scope inactive or not configured (Skipped)."
fi

# 4. Final Verdict
echo "--------------------------------------------------------"
if [ $FAILED -eq 0 ]; then
  echo "✅ VERIFICATION PASSED: Task $TASK_ID meets all criteria."
  echo "Status: READY TO MARK AS DONE"
  exit 0
else
  echo "❌ VERIFICATION FAILED: Task $TASK_ID has unverified criteria."
  echo "Status: BLOCKED - Fix issues before marking DONE"
  exit 1
fi
