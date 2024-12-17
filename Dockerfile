FROM mysql:latest

# Set environment variables
ENV MYSQL_DATABASE=buzzbox_db
ENV MYSQL_USER=docker_user
ENV MYSQL_PASSWORD=admin1234$

COPY ./src/db /docker-entrypoint-initdb.d/

EXPOSE 3306
