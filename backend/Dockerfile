# Use an official Java runtime as a parent image
FROM openjdk:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the compiled java code or jar file into the container
COPY ./target/backend-1.0-SNAPSHOT.jar /usr/src/app

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run the jar file 
CMD ["java", "-jar", "backend-1.0-SNAPSHOT.jar"]
