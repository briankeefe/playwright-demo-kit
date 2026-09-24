import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import time
import unittest


WRAPPER = Path(__file__).resolve().parents[1] / "scripts" / "with-recording-lock.py"


class RecordingLockTest(unittest.TestCase):
    def test_contention_and_process_lifetime(self):
        with tempfile.TemporaryDirectory() as home:
            marker = Path(home) / "started"
            finished = Path(home) / "finished"
            env = {**os.environ, "HOME": home, "DEMO_SLUG": "first-demo"}
            recording = subprocess.Popen(
                [sys.executable, str(WRAPPER), "--", sys.executable, "-c",
                 "import pathlib,sys,time; pathlib.Path(sys.argv[1]).touch(); time.sleep(0.7); pathlib.Path(sys.argv[2]).touch()",
                 str(marker), str(finished)],
                env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
            )
            try:
                for _ in range(100):
                    if marker.exists():
                        break
                    time.sleep(0.02)
                self.assertTrue(marker.exists(), recording.communicate(timeout=5)[1].decode() if recording.poll() is not None else "recorder did not start")
                lock = Path(home) / "Library/Caches/playwright-demo-kit/recording.lock"
                self.assertEqual(json.loads(lock.read_text())["slug"], "first-demo")
                busy = subprocess.run(
                    [sys.executable, str(WRAPPER), "--", sys.executable, "-c", "print('overlap')"],
                    env={**env, "DEMO_SLUG": "second-demo"}, capture_output=True, text=True, timeout=5,
                )
                self.assertNotEqual(busy.returncode, 0)
                self.assertNotIn("overlap", busy.stdout)
                recording.kill()
                recording.wait(timeout=5)
                still_busy = subprocess.run(
                    [sys.executable, str(WRAPPER), "--", sys.executable, "-c", "print('overlap')"],
                    env={**env, "DEMO_SLUG": "third-demo"}, capture_output=True, text=True, timeout=5,
                )
                self.assertNotEqual(still_busy.returncode, 0)
                self.assertNotIn("overlap", still_busy.stdout)
                for _ in range(100):
                    if finished.exists():
                        break
                    time.sleep(0.02)
                self.assertTrue(finished.exists(), "recorder child did not finish")
                for _ in range(100):
                    released = subprocess.run(
                        [sys.executable, str(WRAPPER), "--", sys.executable, "-c", "print('recorded')"],
                        env=env, capture_output=True, text=True, timeout=5,
                    )
                    if released.returncode == 0:
                        break
                    time.sleep(0.02)
                self.assertEqual(released.returncode, 0, released.stderr)
                self.assertIn("recorded", released.stdout)
            finally:
                if recording.poll() is None:
                    recording.kill()
                recording.communicate(timeout=5)


if __name__ == "__main__":
    unittest.main()
