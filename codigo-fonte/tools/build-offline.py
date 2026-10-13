"""Generate a file-open HTML edition without third-party build dependencies.

Supports this project's named imports, namespace imports, named declarations
and star re-exports; rejects unsupported syntax instead of omitting code.
"""
from pathlib import Path
import re
import json

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT.parent
MODULES = ROOT / "dist/modules"
IMPORT = re.compile(r"^import\s+(.*?)\s+from\s+['\"](\./[^'\"]+)['\"];\s*$", re.M)
STAR = re.compile(r"^export\s+\*\s+from\s+['\"](\./[^'\"]+)['\"];\s*$", re.M)
DECL = re.compile(r"^export\s+((?:async\s+)?(?:function|const|let|class))\s+([A-Za-z_$][\w$]*)", re.M)
sources = {p.name:p.read_text(encoding="utf-8") for p in MODULES.glob("*.js")}
order, visiting, visited = [], set(), set()

def visit(name):
    if name in visiting:
        raise ValueError("Circular dependency: " + name)
    if name in visited:
        return
    if name not in sources:
        raise ValueError("Missing module: " + name)
    visiting.add(name)
    text = sources[name]
    for dependency in [m[1][2:] for m in IMPORT.findall(text)] + [m[2:] for m in STAR.findall(text)]:
        visit(dependency)
    visiting.remove(name)
    visited.add(name)
    order.append(name)

def convert(name):
    text = sources[name]
    exports = [m.group(2) for m in DECL.finditer(text)]
    stars = STAR.findall(text)
    def replace_import(match):
        binding, path = match.groups()
        dependency = "__modules[" + json.dumps(path[2:]) + "]"
        if re.fullmatch(r"\*\s+as\s+\w+", binding):
            return "const " + binding.split()[-1] + "=" + dependency + ";"
        if binding.startswith("{") and binding.endswith("}"):
            binding = re.sub(r"\s+as\s+", ":", binding)
            return "const " + binding + "=" + dependency + ";"
        raise ValueError("Unsupported import in " + name + ": " + binding)
    text = IMPORT.sub(replace_import, text)
    text = STAR.sub("", text)
    text = DECL.sub(lambda m:m.group(1)+" "+m.group(2),text)
    if re.search(r"^\s*(?:import|export)\b",text,re.M):
        raise ValueError("Unsupported module syntax remains in " + name)
    if name == "app.js":
        return text
    values = ["__modules["+json.dumps(path[2:])+"]" for path in stars]
    values.append("{"+",".join(exports)+"}")
    result = "Object.assign({},"+",".join(values)+")"
    return "__modules["+json.dumps(name)+"]=(()=>{\n"+text+"\nreturn "+result+";\n})();\n"

visit("app.js")
bundle = "(async()=>{\n'use strict';\nconst __modules=Object.create(null);\n"
for name in order:
    bundle += "\n// MODULE: "+name+"\n"+convert(name)
bundle += "\n})().catch(error=>{console.error(error);const target=document.getElementById('main');if(target){target.textContent='Could not open the dashboard: '+error.message;}});\n"
(ROOT/"dist/app.offline.js").write_text(bundle,encoding="utf-8")

html=(ROOT/"dist/index.html").read_text(encoding="utf-8")
css=(ROOT/"dist/styles.css").read_text(encoding="utf-8")
vendor=(ROOT/"dist/vendor/jszip.min.js").read_text(encoding="utf-8")
html=html.replace('<link rel="stylesheet" href="styles.css">','<style>\n'+css+'\n</style>')
html=html.replace('<script src="vendor/jszip.min.js" defer></script>','')
html=html.replace('<script type="module" src="modules/app.js"></script>','')
def inline_script(text):
    return '<script>\n'+re.sub(r'</script',r'<\\/script',text,flags=re.I)+'\n</script>\n'
html=html.replace('</body>',inline_script(vendor)+inline_script(bundle)+'</body>')
html=html.replace('Opening your workspace…','Opening your offline workspace…')
(OUTPUT/"index.html").write_text(html,encoding="utf-8")
print("File-open HTML built:",OUTPUT/"index.html")
