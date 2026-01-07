#!/usr/bin/env sh
set -o errexit

# Ensure the project root is in PYTHONPATH
export PYTHONPATH=$PYTHONPATH:$(pwd)

# Tell Django where to find settings
export DJANGO_SETTINGS_MODULE=cookies.settings

# Activate virtual environment (if using Render's default venv path)
if [ -f "./.venv/bin/activate" ]; then
    . ./.venv/bin/activate
fi

# Upgrade pip to latest version
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate
