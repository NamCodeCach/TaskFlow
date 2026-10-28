# Stage 1: Build file JAR từ mã nguồn
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY . .
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# Stage 2: Môi trường chạy siêu nhẹ với JRE 21
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
RUN mkdir -p uploads/submissions
EXPOSE 8080
# Giới hạn RAM tối đa 256MB để phù hợp với gói Free của Render (512MB RAM)
ENTRYPOINT ["java", "-Xmx256m", "-Xms128m", "-jar", "app.jar"]
