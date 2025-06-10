import os
import shutil
import zipfile
from pathlib import Path

# Define paths
source_dir = Path(r"C:\Projects\EIGHT\portal_project_final_build")
cleaned_dir = Path(r"C:\Projects\EIGHT\portal_cleaned_temp")
zip_path = Path(r"C:\Projects\EIGHT\portal_project_cleaned.zip")

# Directories to exclude
excluded_dirs = {'node_modules', '.git', '__pycache__', '.next', 'dist', 'build', '.turbo'}

# Remove old temp if it exists
if cleaned_dir.exists():
    shutil.rmtree(cleaned_dir)

# Copy and clean
def should_ignore(dir, names):
    return [n for n in names if n in excluded_dirs]

shutil.copytree(source_dir, cleaned_dir, ignore=should_ignore)

# Zip the cleaned folder
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(cleaned_dir):
        for file in files:
            file_path = Path(root) / file
            arcname = file_path.relative_to(cleaned_dir)
            zipf.write(file_path, arcname)

# Clean up temp folder
shutil.rmtree(cleaned_dir)

print(f"Cleaned project zipped at: {zip_path}")
