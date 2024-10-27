python manage.py makemigrations
make build-frontend
cp -r frontend/dist/static/* static/
docker-compose -f docker-compose-dev.yaml restart web