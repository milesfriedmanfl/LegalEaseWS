# Use MySQL as the base image
FROM mysql:8.0.30

# Copy custom MySQL configuration to adress possible errors
COPY my.cnf /etc/mysql/conf.d/

# Copy initialization scripts to container
COPY ./db-init-scripts /docker-entrypoint-initdb.d/

# Set permissions for MySQL data directory
RUN chown -R mysql:mysql /var/lib/mysql && chmod -R 755 /var/lib/mysql

# Expose MySQL port
EXPOSE 3306