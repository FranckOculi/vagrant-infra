IP=$(hostname -I | awk '{print $2}')

echo "START - install registry - "$IP

echo "[1]: install docker"
apt-get update -qq >/dev/null
apt-get install -qq -y git wget curl git >/dev/null
curl -fsSL https://get.docker.com | sh; >/dev/null
curl -L "https://github.com/docker/compose/releases/download/1.25.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose


echo "[2]: install registry"
mkdir certs/ passwd/ data/
openssl req -x509 -newkey rsa:4096 -nodes -keyout certs/myregistry.key -out certs/myregistry.crt -days 365 -subj /CN=myregistry.my
docker run --entrypoint htpasswd httpd:2 -Bbn chouchoubeignet password > passwd/htpasswd

echo "nouveau mdp :"
cat passwd/htpasswd

echo "
version: '3.5'
services:
  registry:
    restart: always
    image: registry:2
    container_name: registry
    ports:
      - 5000:5000
    environment:
      REGISTRY_HTTP_TLS_CERTIFICATE: /certs/myregistry.crt
      REGISTRY_HTTP_TLS_KEY: /certs/myregistry.key
      REGISTRY_AUTH: htpasswd
      REGISTRY_AUTH_HTPASSWD_PATH: /auth/htpasswd
      REGISTRY_AUTH_HTPASSWD_REALM: Registry Realm
    volumes:
      - ./data:/var/lib/registry
      - ./certs:/certs
      - ./passwd:/auth
" > docker-compose-registry.yml

docker-compose -f docker-compose-registry.yml up -d

echo "END - install registry"


# Test
# docker login https://192.168.5.7:5000
# Username: chouchoubeignet
# Password: password