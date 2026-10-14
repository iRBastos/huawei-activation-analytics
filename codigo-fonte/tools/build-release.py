"""Reproducibly package the current offline app, editable source and verification notes.

Run after tools/build-offline.py and (optionally) npm test:
  python3 tools/build-release.py --test-log /tmp/huawei-tests.tap

The ZIP is deterministic: ordered paths, constant timestamps and permissions.
It contains no user activation data, secrets, .git history or temporary files.
"""
from __future__ import annotations
import argparse
import re
import sys
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "codigo-fonte"
ARCHIVE = ROOT / "codigo-fonte.zip"
TOP_FILES = ("index.html", "README.md", "LEIA-ME.txt")
TOP_DIRS = ("codigo-fonte", "documentacao", "templates", ".github/workflows")
IGNORED_DIRS = (".git", "__pycache__", "node_modules", ".pytest_cache", ".venv")
IGNORED_SUFFIXES = (".pyc", ".pyo", ".swp", ".tmp", ".bak")

def report_from_log(filename: Path):
    text = filename.read_text(encoding="utf-8")
    counts = {key: int(value) for key,value in re.findall(r"^# (tests|pass|fail) (\d+)\s*$",text,re.M)}
    if len(counts) != 3 or counts["fail"] or counts["pass"] != counts["tests"] or counts["tests"] < 1:
        raise SystemExit("Refusing to publish unverified tests: inspect "+str(filename))
    return (
        "Huawei Activation Analytics — verified automated test summary\n"
        "Source of truth: npm test output captured during release verification.\n"
        "Feature: equipment analytics and installer import foundation.\n"
        f"Tests: {counts['tests']}\n"
        f"Passed: {counts['pass']}\n"
        f"Failed: {counts['fail']}\n"
        "Additional offline smoke test: node tools/verify-offline.mjs.\n"
        "A passing node test suite and simulated browser do NOT constitute manual Windows acceptance.\n"
        "For authoritative commit-specific evidence, open the green GitHub Actions run on the commit.\n"
        "This file is a reproducible summary; it is not the full TAP transcript.\n"
    )

def selected_paths():
    paths = [ROOT / p for p in TOP_FILES]
    for folder in TOP_DIRS:
        d = ROOT / folder
        if not d.exists():
            raise SystemExit("Required distribution folder does not exist: " + folder)
        paths.extend(p for p in d.rglob("*") if p.is_file())
    unique = {}
    for p in paths:
        relative = p.relative_to(ROOT)
        if any(part in IGNORED_DIRS for part in relative.parts):
            continue
        if p.suffix.lower() in IGNORED_SUFFIXES or p.name.startswith(".DS_Store"):
            continue
        if p == ARCHIVE:
            raise SystemExit("Recursive packaging forbidden")
        unique[str(relative).replace("\\", "/")] = p
    for expected in ["index.html","codigo-fonte/dist/app.offline.js",
                     "codigo-fonte/dist/modules/inverter-catalog.js",
                     "codigo-fonte/dist/test-results.txt","documentacao/test-results.txt"]:
        if expected not in unique:
            raise SystemExit("Distribution is incomplete: "+expected)
    return sorted(unique.items())

def build_zip():
    paths=selected_paths()
    with ZipFile(ARCHIVE, "w", compression=ZIP_DEFLATED, compresslevel=9) as z:
        for relative, file in paths:
            info=ZipInfo(relative, date_time=(1980,1,1,0,0,0))
            info.compress_type=ZIP_DEFLATED
            info.external_attr=(0o100644 << 16)
            z.writestr(info, file.read_bytes(), compress_type=ZIP_DEFLATED, compresslevel=9)
    with ZipFile(ARCHIVE,"r") as z:
        if z.testzip() is not None:
            raise SystemExit("Distribution ZIP integrity check failed")
        assert len(z.namelist()) == len(set(z.namelist()))
    print(f"Created reproducible source release ZIP: {ARCHIVE} ({len(paths)} files)")

if __name__ == "__main__":
    p=argparse.ArgumentParser()
    p.add_argument("--test-log", type=Path)
    args=p.parse_args()
    if args.test_log:
        report=report_from_log(args.test_log)
        for path in [SOURCE/"dist/test-results.txt",ROOT/"documentacao/test-results.txt"]:
            path.write_text(report,encoding="utf-8")
    build_zip()
