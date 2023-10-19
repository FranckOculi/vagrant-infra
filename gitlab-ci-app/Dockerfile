# Latest recommended version
FROM node:18.17.0

# Create app directory
WORKDIR /usr/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN yarn

# Bundle app source
COPY . .

# Run server
CMD [ "yarn", "start" ]