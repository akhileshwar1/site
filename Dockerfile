# Start from the official Nginx image
FROM nginx:latest AS nginx

# Remove default Nginx configuration files
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/conf.d/ /etc/nginx/conf.d/

# Copy static content from your frontend build folder
COPY static/ /usr/share/nginx/html/

# Use the official Clojure image that includes Leiningen
FROM clojure:openjdk-11-lein AS builder

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy the project definition files
COPY backend/project.clj /usr/src/app/

# Fetch and cache the project dependencies
RUN lein deps

# Copy the project files into the Docker container
COPY backend/ /usr/src/app

# Use Leiningen to build the standalone Uberjar
RUN lein uberjar

# Use OpenJDK 11 slim for the runtime base image
FROM openjdk:11-slim AS runtime

# Set the working directory in the Docker container
WORKDIR /usr/app

# Copy the Uberjar from the builder stage
COPY --from=builder /usr/src/app/target/uberjar/backend-0.1.0-SNAPSHOT-standalone.jar /usr/app/

# Expose port 8080 for your Clojure app
EXPOSE 8080

# Start your Clojure app and Nginx
CMD java -jar /usr/app/backend-0.1.0-SNAPSHOT-standalone.jar && nginx -g 'daemon off;'
