# Stage 1: Build file JAR bằng Maven chính thức đã tích hợp sẵn JDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Môi trường chạy siêu nhẹ với JRE 21
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
RUN mkdir -p uploads/submissions
EXPOSE 8080
# Giới hạn RAM tối đa 256MB để phù hợp với gói Free của Render (512MB RAM)
ENTRYPOINT ["java", "-Xmx256m", "-Xms128m", "-jar", "app.jar"]
