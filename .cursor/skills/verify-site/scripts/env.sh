# Sourced by the other helpers. Override any of these via the environment.
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_ROOT="$(cd "$SKILL_DIR/../../.." && pwd)"
VERIFY_SITE_HOME="${VERIFY_SITE_HOME:-$HOME/.cache/verify-site}"
VERIFY_SITE_PORT="${VERIFY_SITE_PORT:-3100}"
STATE_DIR="$VERIFY_SITE_HOME/state"
EVIDENCE_ROOT="$VERIFY_SITE_HOME/evidence"
mkdir -p "$STATE_DIR" "$EVIDENCE_ROOT"

pidfile_for() { echo "$STATE_DIR/$1.pid"; }
logfile_for() { echo "$STATE_DIR/$1.log"; }

listener_pids() { lsof -nP -iTCP:"$1" -sTCP:LISTEN -t 2>/dev/null || true; }

pgid_of() { ps -o pgid= -p "$1" 2>/dev/null | tr -d ' '; }

# `next dev` processes whose working directory is this checkout. Two dev servers
# in one checkout fight over `.next/`, so launch refuses when one exists.
next_dev_in_repo() {
  local pid cwd
  for pid in $(pgrep -f "next dev" 2>/dev/null || true); do
    cwd="$(lsof -a -p "$pid" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p')"
    [ "$cwd" = "$REPO_ROOT" ] && echo "$pid"
  done
  return 0
}
