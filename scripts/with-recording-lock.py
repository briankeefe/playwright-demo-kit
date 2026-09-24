#!/usr/bin/env python3
"""Run one recording at a time on this Mac; the child shares the lock."""

import fcntl
import json
import os
from pathlib import Path
import subprocess
import sys
from datetime import datetime, timezone


def main():
    slug = os.environ.get("DEMO_SLUG")
    if not slug or len(sys.argv) < 3 or sys.argv[1] != "--":
        print("Usage: DEMO_SLUG=<work-slug> with-recording-lock.py -- <command> [args...]", file=sys.stderr)
        return 2

    path = Path.home() / "Library/Caches/playwright-demo-kit/recording.lock"
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a+") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            lock.seek(0)
            print(f"Recording already in progress: {lock.read().strip() or path}", file=sys.stderr)
            return 1

        lock.seek(0)
        lock.truncate()
        json.dump({"slug": slug, "pid": os.getpid(), "started_at": datetime.now(timezone.utc).isoformat()}, lock)
        lock.flush()
        try:
            # The child retains the lock if this wrapper is killed during capture.
            return subprocess.run(sys.argv[2:], pass_fds=(lock.fileno(),)).returncode
        finally:
            lock.seek(0)
            lock.truncate()


if __name__ == "__main__":
    sys.exit(main())
