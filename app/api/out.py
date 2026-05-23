import os

OUTPUT_FILE = "output.txt"

# Ignore large/unnecessary folders
IGNORE_DIRS = {
    ".git",
    "__pycache__",
    "node_modules",
    ".next",
    "venv",
    ".idea",
    ".vscode",
}

# Ignore binary file extensions
IGNORE_EXT = {
    ".png", ".jpg", ".jpeg", ".gif", ".webp",
    ".mp4", ".mp3", ".exe", ".dll", ".zip",
    ".rar", ".pdf", ".ico", ".ttf", ".woff",
}

def create_tree(path, prefix=""):
    items = sorted(os.listdir(path))

    items = [
        item for item in items
        if item not in IGNORE_DIRS
    ]

    tree = []

    for i, item in enumerate(items):
        full_path = os.path.join(path, item)

        connector = "└── " if i == len(items)-1 else "├── "

        tree.append(prefix + connector + item)

        if os.path.isdir(full_path):
            extension = "    " if i == len(items)-1 else "│   "
            tree.extend(
                create_tree(
                    full_path,
                    prefix + extension
                )
            )

    return tree


def read_all_files(path):
    content = []

    for root, dirs, files in os.walk(path):

        dirs[:] = [
            d for d in dirs
            if d not in IGNORE_DIRS
        ]

        for file in files:
            full_path = os.path.join(root, file)

            ext = os.path.splitext(file)[1].lower()

            if ext in IGNORE_EXT:
                continue

            rel_path = os.path.relpath(full_path)

            content.append("\n")
            content.append("=" * 80)
            content.append(f"\nFILE: {rel_path}\n")
            content.append("=" * 80)

            try:
                with open(
                    full_path,
                    "r",
                    encoding="utf-8"
                ) as f:

                    text = f.read()

                    content.append(text)

            except Exception as e:
                content.append(
                    f"\n[Cannot read file: {e}]"
                )

            content.append("\n")

    return "\n".join(content)


with open(
    OUTPUT_FILE,
    "w",
    encoding="utf-8"
) as out:

    out.write("FOLDER STRUCTURE\n")
    out.write("=" * 80)
    out.write("\n.\n")

    tree = create_tree(".")
    out.write("\n".join(tree))

    out.write("\n\n\n")
    out.write("FILE CONTENTS\n")
    out.write("=" * 80)

    all_files = read_all_files(".")
    out.write(all_files)

print(f"Done! Output saved in {OUTPUT_FILE}")