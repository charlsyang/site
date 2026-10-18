#!/usr/bin/env bash
# Usage: doctor.sh [port]
# Read-only. Exit 0 only if the instance on the port is ours, current, and rendering.
set -uo pipefail
source "$(dirname "$0")/env.sh"
port="${1:-$VERIFY_SITE_PORT}"
pidfile="$(pidfile_for "$port")"
base="http://127.0.0.1:$port"
fail=0
ok()  { echo "ok    $*"; }
bad() { echo "FAIL  $*"; fail=1; }

if [ -f "$pidfile" ] && kill -0 "$(cat "$pidfile")" 2>/dev/null; then
  pid="$(cat "$pidfile")"
  ok "process $pid alive (pgid $(pgid_of "$pid"))"
  owned=0
  for lp in $(listener_pids "$port"); do
    [ "$(pgid_of "$lp")" = "$(pgid_of "$pid")" ] && owned=1
  done
  [ "$owned" = 1 ] && ok "port $port is held by our process group" \
                   || bad "port $port is not held by our process group (listeners: $(listener_pids "$port" | tr '\n' ' '))"
else
  bad "no instance started by this skill on port $port (pidfile: $pidfile)"
fi

home="$(curl -fsS --max-time 60 "$base/" 2>/dev/null)"
if echo "$home" | grep -q 'href="/blog/'; then
  ok "GET / renders the blog list"
else
  bad "GET / did not render the blog list"
fi

code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 60 "$base/blog")"
[ "$code" = 200 ] && ok "GET /blog -> 200" || bad "GET /blog -> $code"

echo "info  checkout $REPO_ROOT @ $(git -C "$REPO_ROOT" rev-parse --short HEAD) ($(git -C "$REPO_ROOT" rev-parse --abbrev-ref HEAD))"
echo "info  next $(node -p "require('$REPO_ROOT/node_modules/next/package.json').version" 2>/dev/null || echo '?')"
exit "$fail"
