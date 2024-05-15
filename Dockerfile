# Use a Ubuntu-based image as the base
FROM ubuntu:22.04 as base

# Install necessary dependencies (Java, Nginx, MongoDB)
RUN apt-get update && apt-get install -y \
    openjdk-11-jdk \
    nginx \
    curl \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Install MongoDB from the official MongoDB repository
# Import the public key used by the package management system
RUN curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor
RUN echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Reload local package database
RUN apt-get update

# Install MongoDB package
RUN apt-get install -y mongodb-org

# Expose ports (if needed)
EXPOSE 80
EXPOSE 8080
EXPOSE 27017

# Branch off to a different stage and pulling in the generated items later.
FROM clojure:openjdk-11-lein as builder

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy the project definition files
COPY /backend/project.clj /usr/src/app/

# Fetch and cache the project dependencies
RUN lein deps

# Copy the project files into the Docker container
COPY /backend /usr/src/app

# Use Leiningen to build the standalone Uberjar
RUN lein uberjar

FROM base

# Set the working directory in the Docker container
WORKDIR /usr/app

# Pulling the Uberjar from the builder stage
COPY --from=builder /usr/src/app/target/uberjar/backend-0.1.0-SNAPSHOT-standalone.jar /usr/app/

# Create nginx user and group
RUN adduser --system --no-create-home --disabled-login --group nginx

# Copy custom Nginx config
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/conf.d/ /etc/nginx/conf.d/

# Copy static content from your frontend build folder
COPY static/ /usr/share/nginx/html/

# Set root username and password (modify as needed)
ENV MONGO_INITDB_ROOT_USERNAME=root
ENV MONGO_INITDB_ROOT_PASSWORD=password

# Start Nginx, Clojure backend, and MongoDB
CMD ["sh", "-c", "nginx -g 'daemon off;' & java -jar /usr/app/backend-0.1.0-SNAPSHOT-standalone.jar & mongod --bind_ip_all"]
