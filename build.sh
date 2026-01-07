#!/usr/bin/env sh
set -o errexit

# Ensure we are in the project root
cd "$(dirname "$0")"

# Ensure Python can find the project and settings
export PYTHONPATH=$(pwd)
export DJANGO_SETTINGS_MODULE=cookies.settings

# Upgrade pip and install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate
