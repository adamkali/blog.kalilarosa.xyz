FROM alpine:latest

# Install Hugo
RUN apk update && \
    apk add --no-cache hugo

# Set working directory to /app (you can change this if you want)
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app
EXPOSE 1313

# Run Hugo server in the foreground
CMD ["hugo", "server", "-c", "/app/hugo.toml"]
