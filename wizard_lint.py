import os
import sys
import py_compile


def iter_python_files(root: str):
    for dirpath, dirnames, filenames in os.walk(root):
        # Skip some common noise dirs
        dirnames[:] = [d for d in dirnames if d not in {".git", ".venv", "node_modules", "__pycache__"}]
        for name in filenames:
            if name.endswith(".py"):
                yield os.path.join(dirpath, name)


def main() -> int:
    root = os.getcwd()
    print(f"Running simple Python lint/compile check under {root}", flush=True)

    errors = 0
    for path in iter_python_files(root):
        rel = os.path.relpath(path, root)
        try:
            py_compile.compile(path, doraise=True)
            print(f"[OK] {rel}")
        except py_compile.PyCompileError as exc:
            errors += 1
            print(f"[FAIL] {rel}")
            print(exc)

    if errors:
        print(f"\nCompleted with {errors} file(s) failing compile checks.")
        return 1

    print("\nAll Python files compiled successfully.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

