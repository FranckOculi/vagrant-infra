# Latest recommended version
FROM debian:latest

# Create app directory
WORKDIR /usr/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Update packages and install curl
RUN apt-get update && \
    apt-get install -y ca-certificates curl gnupg nodejs npm

RUN install -m 0755 -d /etc/apt/keyrings
RUN curl -fsSL https://get.docker.com | sh; >/dev/null
RUN usermod -aG docker root
RUN curl -sL "https://github.com/docker/compose/releases/download/1.25.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
RUN chmod +x /usr/local/bin/docker-compose && ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
RUN npm install --global yarn

# Bundle app source
COPY . .

# Run server
CMD [ "yarn", "start" ]