#!/usr/bin/env bash
# Usage: cleanup.sh [port] [--keep-log]
# Stops only the process group this skill started on the port. Evidence under
# $VERIFY_SITE_HOME/evidence is never touched.
set -uo pipefail
source "$(dirname "$0")/env.sh"
port="$VERIFY_SITE_PORT"
keep_log=0
for arg in "$@"; do
  case "$arg" in
    --keep-log) keep_log=1 ;;
    *) port="$arg" ;;
  esac
done
pidfile="$(pidfile_for "$port")"

if [ ! -f "$pidfile" ]; then
  echo "nothing to clean on port $port"
  exit 0
fi

pid="$(cat "$pidfile")"
if kill -0 "$pid" 2>/dev/null; then
  kill -TERM -- "-$pid" 2>/dev/null
  for _ in $(seq 1 20); do
    kill -0 "$pid" 2>/dev/null || break
    sleep 0.5
  done
  kill -KILL -- "-$pid" 2>/dev/null
  echo "stopped process group $pid"
fi
rm -f "$pidfile"
[ "$keep_log" = 1 ] || rm -f "$(logfile_for "$port")"

if [ -n "$(listener_pids "$port")" ]; then
  echo "warning: port $port still has a listener (pids: $(listener_pids "$port" | tr '\n' ' ')); it is not ours, left alone." >&2
fi
echo "evidence kept in $EVIDENCE_ROOT"
