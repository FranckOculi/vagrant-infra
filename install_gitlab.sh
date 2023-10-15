
IP=$(hostname -I | awk '{print $2}')

echo "START - install gitlab - "$IP

echo "[1]: install gitlab"
apt-get update -qq >/dev/null
apt-get install -qq -y vim git wget curl >/dev/null
curl -sS https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.deb.sh | sudo bash
apt-get update -qq >/dev/null
echo "
LC_CTYPE="en_US.UTF-8"
LC_ALL="en_US.UTF-8"
" >>/etc/default/locale
apt install -y gitlab-ce
gitlab-ctl reconfigure
echo "END - install gitlab"

# if postgres crash :
# sudo dpkg-reconfigure locales 
# gitlab-ctl reconfigure