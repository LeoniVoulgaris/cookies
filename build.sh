#!/usr/bin/env sh
set -o errexit

# install dependencies
pip install -r requirements.txt

# set Django settings module
export DJANGO_SETTINGS_MODULE=cookies.settings
export PYTHONPATH=$(pwd)  # ensures the repo root is on Python path

# run Django management commands
python manage.py collectstatic --noinput
python manage.py migrate