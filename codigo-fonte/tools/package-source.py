"""Package the file-open distribution, excluding this generated archive."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root=Path(__file__).resolve().parents[2]
archive=root/"codigo-fonte.zip"
with ZipFile(archive,"w",ZIP_DEFLATED) as output:
    for path in sorted(root.rglob("*")):
        if not path.is_file() or path==archive:
            continue
        relative=path.relative_to(root)
        if any(p in {".git",".openai","node_modules","__pycache__"} for p in relative.parts):
            continue
        if path.suffix.lower() not in {".md",".js",".mjs",".py",".html",".css",".json",".xlsx",".txt"}:
            continue
        output.write(path,"Huawei_Activation_Analytics/"+relative.as_posix())
print(archive)
