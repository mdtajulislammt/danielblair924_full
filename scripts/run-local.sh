#!/usr/bin/env bash
# scripts/run-local.sh - Quick Local Runner for Avengers Protocol Full-Stack Application
# Allows easy, one-command launching of Frontend, Backend, or Full-Stack services.
set -eo pipefail

TARGET="${1:-all}"

echo "========================================================"
echo "🛡️  AVENGERS LOCAL RUNNER: $TARGET"
echo "========================================================"

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

case "$TARGET" in
  frontend)
    echo "🚀 Starting Frontend Web application (Next.js)..."
    echo "🌐 URL: http://localhost:3000"
    fuser -k 3000/tcp 2>/dev/null || true
    if [ -d "$FRONTEND_DIR" ]; then
      cd "$FRONTEND_DIR"
      if command -v npm >/dev/null 2>&1; then
        npm run dev
      elif [ -f "yarn.lock" ]; then
        yarn dev
      else
        npm run dev
      fi
    else
      echo "❌ Frontend directory not found."
      exit 1
    fi
    ;;

  backend)
    echo "⚙️ Starting Backend API service (NestJS/Node.js)..."
    echo "🌐 API URL: http://localhost:4000/api"
    echo "📚 Swagger Docs: http://localhost:4000/api/docs"
    fuser -k 4000/tcp 2>/dev/null || true
    if [ -d "$BACKEND_DIR" ]; then
      cd "$BACKEND_DIR"
      if [ -f "yarn.lock" ]; then
        yarn start:dev
      elif [ -f "pnpm-lock.yaml" ]; then
        pnpm run start:dev
      else
        npm run start:dev 2>/dev/null || npm run dev 2>/dev/null || npm start
      fi
    else
      echo "❌ Backend directory not found."
      exit 1
    fi
    ;;

  infra)
    bash scripts/start-infra.sh
    ;;

  all)
    echo "🚀 Launching Full-Stack Services..."
    echo "--------------------------------------------------------"
    echo "  📱 Frontend: http://localhost:3000"
    echo "  ⚙️ Backend:  http://localhost:4000/api"
    echo "--------------------------------------------------------"
    echo "Tip: You can open two terminal windows and run:"
    echo "  Window 1: bash scripts/run-local.sh backend"
    echo "  Window 2: bash scripts/run-local.sh frontend"
    echo ""
    echo "Starting Frontend in this terminal (Ctrl+C to stop)..."
    if [ -d "$FRONTEND_DIR" ]; then
      cd "$FRONTEND_DIR"
      if command -v npm >/dev/null 2>&1; then
        npm run dev
      elif [ -f "yarn.lock" ]; then
        yarn dev
      else
        npm run dev
      fi
    fi
    ;;

  *)
    echo "Usage: bash scripts/run-local.sh [infra|backend|frontend|all]"
    exit 1
    ;;
esac
