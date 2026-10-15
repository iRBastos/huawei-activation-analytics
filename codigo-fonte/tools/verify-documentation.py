"""Validate the multilingual documentation in the reproducible source ZIP."""
from __future__ import annotations
import re
import sys
from html.parser import HTMLParser
from pathlib import Path, PurePosixPath
from urllib.parse import unquote, urlsplit
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[2]
ZIP = ROOT / "codigo-fonte.zip"
LANGS = ("en", "pt-BR", "zh-CN")
PAGES = ("PROJECT_OVERVIEW", "CHANNEL_MANAGER_PLAYBOOK", "USER_GUIDE", "QUICK_START", "DOCUMENTATION_AUDIT")
PREFIX = "docs/commercial/"

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.hrefs = []
    def handle_starttag(self, tag, attrs):
        if tag == "a":
            self.hrefs += [v for k, v in attrs if k == "href" and v is not None]

def target(source, href):
    parts = urlsplit(href)
    if not parts.path or parts.scheme or href.startswith(("#", "//", "/")):
        return None
    result = list(PurePosixPath(source).parts[:-1])
    for c in unquote(parts.path).replace("\\", "/").split("/"):
        if c in ("", "."):
            continue
        if c == "..":
            if not result:
                raise ValueError(f"Link leaves ZIP: {source} -> {href}")
            result.pop()
        else:
            result.append(c)
    return "/".join(result)

def main():
    if not ZIP.is_file():
        raise SystemExit("Missing generated source ZIP")
    with ZipFile(ZIP) as z:
        if z.testzip():
            raise SystemExit("Corrupt source ZIP")
        names = set(z.namelist())
        required = {"README.md", PREFIX + "README.md", PREFIX + "index.html"}
        required.update(PREFIX + lang + "/" + page + "." + ext
                        for lang in LANGS for page in PAGES for ext in ("md", "html"))
        errors = ["Missing from ZIP: " + name for name in sorted(required - names)]
        count = 0
        for name in sorted(required & names):
            file = ROOT / name
            if not file.is_file() or z.read(name) != file.read_bytes():
                errors.append("Stale or missing source: " + name)
            s = z.read(name).decode("utf-8-sig")
            if name.endswith(".html"):
                parser = Links()
                parser.feed(s)
                hrefs = parser.hrefs
            else:
                hrefs = [m.group(1) for m in re.finditer(r"(?<!!)\[[^\]]+\]\(([^)]+)\)", s)]
            for href in hrefs:
                try:
                    path = target(name, href)
                except ValueError as error:
                    errors.append(str(error))
                    continue
                if path is None:
                    continue
                count += 1
                if path not in names:
                    errors.append(f"Broken ZIP link: {name} -> {href} -> {path}")
        if errors:
            raise SystemExit("\n".join(errors))
        print(f"Multilingual documentation verified in ZIP: {len(required)} checked files, {count} relative links, 3 languages.")

if __name__ == "__main__":
    main()
