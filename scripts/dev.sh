#!/usr/bin/env bash
set -e

OS="unknown"
if [[ "$OSTYPE" == "darwin"* ]]; then
  OS="macos"
elif [[ "$OSTYPE" == "linux"* ]]; then
  OS="linux"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
  OS="windows"
fi

# --- Check & install Bun ---
if ! command -v bun >/dev/null 2>&1; then
  echo "[setup] Bun not found. Installing..."
  if [[ "$OS" == "macos" || "$OS" == "linux" ]]; then
    curl -fsSL https://bun.sh/install | bash
    export BUN_INSTALL="${BUN_INSTALL:-$HOME/.bun}"
    export PATH="$BUN_INSTALL/bin:$PATH"
  elif [[ "$OS" == "windows" ]]; then
    powershell -c "irm bun.sh/install.ps1 | iex"
    export PATH="$USERPROFILE/.bun/bin:$PATH"
  fi

  if ! command -v bun >/dev/null 2>&1; then
    echo "[error] Bun installation failed. Install manually from https://bun.sh"
    exit 1
  fi
  echo "[setup] Bun installed successfully."
fi

# --- Check & install Docker ---
if ! command -v docker >/dev/null 2>&1; then
  echo "[setup] Docker not found. Installing..."

  if [[ "$OS" == "macos" ]]; then
    if command -v brew >/dev/null 2>&1; then
      echo "[setup] Installing Docker Desktop via Homebrew..."
      brew install --cask docker
      echo "[setup] Opening Docker Desktop (required for first run)..."
      open -a Docker
      echo "[setup] Waiting for Docker daemon to start..."
      for i in $(seq 1 60); do
        if docker info >/dev/null 2>&1; then break; fi
        if [ "$i" -eq 60 ]; then
          echo "[error] Docker daemon did not start. Open Docker Desktop manually and re-run."
          exit 1
        fi
        sleep 2
      done
    else
      echo "[error] Install Docker Desktop from https://docker.com/products/docker-desktop"
      exit 1
    fi

  elif [[ "$OS" == "linux" ]]; then
    echo "[setup] Installing Docker via get.docker.com..."
    curl -fsSL https://get.docker.com | sudo sh
    sudo usermod -aG docker "$USER"
    sudo systemctl start docker 2>/dev/null || sudo service docker start 2>/dev/null || true

  elif [[ "$OS" == "windows" ]]; then
    echo "[error] Install Docker Desktop from https://docker.com/products/docker-desktop"
    exit 1
  fi

  if ! command -v docker >/dev/null 2>&1; then
    echo "[error] Docker installation failed. Install manually from https://docker.com"
    exit 1
  fi
  echo "[setup] Docker installed successfully."
fi

# Verify Docker daemon is running
if ! docker info >/dev/null 2>&1; then
  echo "[setup] Docker daemon not running. Starting..."
  if [[ "$OS" == "macos" ]]; then
    open -a Docker
    for i in $(seq 1 60); do
      if docker info >/dev/null 2>&1; then break; fi
      if [ "$i" -eq 60 ]; then
        echo "[error] Docker daemon did not start. Open Docker Desktop manually and re-run."
        exit 1
      fi
      sleep 2
    done
  elif [[ "$OS" == "linux" ]]; then
    sudo systemctl start docker 2>/dev/null || sudo service docker start 2>/dev/null
    sleep 2
    if ! docker info >/dev/null 2>&1; then
      echo "[error] Could not start Docker daemon. Start it manually and re-run."
      exit 1
    fi
  fi
fi

# --- Check .env ---
if [ ! -f .env ]; then
  echo "[setup] Creating .env from .env.example..."
  cp .env.example .env
  SECRET=$(openssl rand -base64 32)
  if [[ "$OS" == "macos" ]]; then
    sed -i '' "s|generate-with-openssl-rand-base64-32|$SECRET|" .env
  else
    sed -i "s|generate-with-openssl-rand-base64-32|$SECRET|" .env
  fi
  echo "[setup] Generated BETTER_AUTH_SECRET. Edit .env to add RESEND_API_KEY and STRIPE keys."
fi

# --- Check node_modules ---
if [ ! -d node_modules ]; then
  echo "[setup] Installing dependencies..."
  bun install
fi

# --- Check Postgres ---
CONTAINER="sponsor-tracker-postgres-1"
if ! docker inspect "$CONTAINER" >/dev/null 2>&1 || [ "$(docker inspect -f '{{.State.Running}}' "$CONTAINER" 2>/dev/null)" != "true" ]; then
  echo "[setup] Starting Postgres..."
  if command -v docker-compose >/dev/null 2>&1; then
    docker-compose up -d
  else
    docker compose up -d
  fi

  echo "[setup] Waiting for Postgres..."
  for i in $(seq 1 30); do
    if docker exec "$CONTAINER" pg_isready -U sponsor_tracker >/dev/null 2>&1; then
      break
    fi
    if [ "$i" -eq 30 ]; then
      echo "[error] Postgres did not start in time."
      exit 1
    fi
    sleep 1
  done
fi

# --- Enable pg_trgm extension ---
docker exec "$CONTAINER" psql -U sponsor_tracker -d sponsor_tracker -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;" >/dev/null 2>&1

# --- Check if schema is pushed (probe a known table) ---
if ! docker exec "$CONTAINER" psql -U sponsor_tracker -d sponsor_tracker -c "SELECT 1 FROM sponsors LIMIT 0" >/dev/null 2>&1; then
  echo "[setup] Pushing database schema..."
  bun run db:push
fi

# --- Start dev server ---
exec bunx next dev --turbopack
