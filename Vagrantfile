IMAGE_NAME = "debian/buster64"
MAIN_MEMORY = 3072
MAIN_CPU = "2"
DEFAULT_MEMORY = 512
DEFAULT_CPU = "1"

Vagrant.configure("2") do |config|
  servers=[
    {
      :hostname => "p1jenkins-pipeline",
      :box => IMAGE_NAME,
      :memory => MAIN_MEMORY,
      :ip => "192.168.5.2",
      :cpu => MAIN_CPU
    },
    {
      :hostname => "srvdev-pipeline",
      :box => IMAGE_NAME,
      :memory => DEFAULT_MEMORY,
      :ip => "192.168.5.3",
      :cpu => DEFAULT_CPU
    },
    {
      :hostname => "srvstage-pipeline",
      :box => IMAGE_NAME,
      :memory => DEFAULT_MEMORY,
      :ip => "192.168.5.4",
      :cpu => DEFAULT_CPU
    },
    {
      :hostname => "srvprod-pipeline",
      :box => IMAGE_NAME,
      :memory => DEFAULT_MEMORY,
      :ip => "192.168.5.6",
      :cpu => DEFAULT_CPU
    },
    {
      :hostname => "srvbdd-pipeline",
      :box => IMAGE_NAME,
      :memory => DEFAULT_MEMORY,
      :ip => "192.168.5.7",
      :cpu => DEFAULT_CPU
    },
  ]

    servers.each do |machine|
      config.vm.define machine[:hostname] do |node|
        node.vm.box = machine[:box]
        node.vm.hostname = machine[:hostname]
        node.vm.box_url = machine[:box]
        node.vm.network :private_network, ip: machine[:ip]
        node.ssh.insert_key=false
        node.vm.provider :virtualbox do |vb|
          vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
          vb.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
          vb.customize ["modifyvm", :id, "--memory", machine[:memory]]
          vb.customize ["modifyvm", :id, "--name", machine[:hostname]]
          vb.customize ["modifyvm", :id, "--cpus", machine[:cpu]]
        end
        node.vm.provision "shell", inline: <<-SHELL
          sed -i 's/ChallengeResponseAuthentication no/ChallengeResponseAuthentication yes/g' /etc/ssh/sshd_config    
          service ssh restart
        SHELL
        if machine[:hostname] == "p1jenkins-pipeline"
          node.vm.provision "ansible" do |ansible|
            ansible.playbook = "playbook.yml"
          end
        end
        if machine[:hostname] == "srvbdd-pipeline"
          node.vm.provision "shell", path: "install_srvpostgres.sh"
        end
      end
    end
  end
  
  