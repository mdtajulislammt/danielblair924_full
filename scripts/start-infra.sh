#!/usr/bin/env bash
# scripts/start-infra.sh - Start FMC PostgreSQL & Redis via Docker
set -e

echo "========================================================"
echo "🐘 STARTING FMC DOCKER INFRASTRUCTURE (POSTGRESQL + REDIS)"
echo "========================================================"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$ROOT_DIR"

echo "Launching FMC PostgreSQL (Port 5434) & Redis (Port 6381)..."
docker compose up -d postgres redis

echo ""
echo "Waiting for PostgreSQL container to become ready..."
until docker exec fmc-postgres pg_isready -U postgres >/dev/null 2>&1; do
  sleep 1
done

echo ""
echo "✅ FMC Database & Cache are live in Docker:"
echo "  🐘 PostgreSQL: localhost:5434 (User: postgres, Password: root, Database: testdb)"
echo "  ⚡ Redis:      localhost:6381"
echo "========================================================"
echo ""
echo "Now run database migrations and seeding:"
echo "  cd developement/danielblair924_backend"
echo "  yarn prisma:push"
echo "  yarn prisma:seed"
