#!/usr/bin/env bash
# Usage: launch.sh [port]   (default $VERIFY_SITE_PORT or 3100)
# Starts `next dev` in its own process group and blocks until the home page
# renders real content. Idempotent: an instance we already own on the port is reused.
set -euo pipefail
source "$(dirname "$0")/env.sh"
port="${1:-$VERIFY_SITE_PORT}"
pidfile="$(pidfile_for "$port")"
logfile="$(logfile_for "$port")"
base="http://127.0.0.1:$port"

if [ -f "$pidfile" ] && kill -0 "$(cat "$pidfile")" 2>/dev/null; then
  echo "already running: pid $(cat "$pidfile") at $base"
  exit 0
fi
rm -f "$pidfile"

if [ -n "$(listener_pids "$port")" ]; then
  echo "refusing: port $port is held by a process this skill did not start (pids: $(listener_pids "$port" | tr '\n' ' '))." >&2
  echo "pick another port: launch.sh <port>" >&2
  exit 1
fi

existing="$(next_dev_in_repo)"
if [ -n "$existing" ]; then
  echo "refusing: another 'next dev' is already running in $REPO_ROOT (pids: $(echo "$existing" | tr '\n' ' '))." >&2
  echo "two dev servers share .next/ and corrupt each other; drive that one or stop it yourself." >&2
  exit 1
fi

cd "$REPO_ROOT"
[ -x node_modules/.bin/next ] || npm ci

perl -MPOSIX -e 'POSIX::setsid() or die "setsid: $!"; exec @ARGV' -- \
  node_modules/.bin/next dev -p "$port" >"$logfile" 2>&1 &
echo $! >"$pidfile"
echo "started pid $(cat "$pidfile") (log: $logfile)"

# `next dev` answers before it can render; ready means the home page compiled
# with the blog list from blog/*.mdx in it.
for _ in $(seq 1 120); do
  if ! kill -0 "$(cat "$pidfile")" 2>/dev/null; then
    echo "dev server exited during startup:" >&2
    tail -40 "$logfile" >&2
    rm -f "$pidfile"
    exit 1
  fi
  if curl -fsS --max-time 30 "$base/" 2>/dev/null | grep -q 'href="/blog/'; then
    echo "ready: $base"
    exit 0
  fi
  sleep 1
done

echo "timed out waiting for $base to render; last log lines:" >&2
tail -40 "$logfile" >&2
"$(dirname "$0")/cleanup.sh" "$port" --keep-log
exit 1
