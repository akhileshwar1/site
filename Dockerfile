# Use a Ubuntu-based image as the base
FROM ubuntu:22.04 as base

# Install necessary dependencies (Java, Nginx, MongoDB)
RUN apt-get update && apt-get install -y \
    openjdk-11-jdk \
    nginx \
    && rm -rf /var/lib/apt/lists/*

# Expose ports (if needed)
EXPOSE 80
EXPOSE 8080

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

# Start Nginx, Clojure backend, and MongoDB
CMD ["sh", "-c", "nginx -g 'daemon off;' & java -jar /usr/app/backend-0.1.0-SNAPSHOT-standalone.jar"]
