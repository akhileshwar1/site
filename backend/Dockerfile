# Use the official Clojure image that includes Leiningen
FROM clojure:openjdk-11-lein as builder

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy the project definition files
COPY project.clj /usr/src/app/

# Fetch and cache the project dependencies
RUN lein deps

# Copy the project files into the Docker container
COPY . /usr/src/app

# Use Leiningen to build the standalone Uberjar
RUN lein uberjar

# Use OpenJDK 11 slim for the runtime base image
FROM openjdk:11-slim

# Set the working directory in the Docker container
WORKDIR /usr/app

# Copy the Uberjar from the builder stage
COPY --from=builder /usr/src/app/target/uberjar/backend-0.1.0-SNAPSHOT-standalone.jar /usr/app/

# Expose the port the Jetty server will run on
EXPOSE 8080 

# Run the Uberjar
CMD ["java", "-jar", "backend-0.1.0-SNAPSHOT-standalone.jar"]
