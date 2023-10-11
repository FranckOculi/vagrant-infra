Vagrant.configure("2") do |config|
    # p1jenkins server
    config.vm.define "p1jenkins-pipeline" do |p1jenkins|
      p1jenkins.vm.box = "debian/buster64"
      p1jenkins.vm.hostname = "p1jenkins-pipeline"
      p1jenkins.vm.box_url = "debian/buster64"
      p1jenkins.vm.network :private_network, ip: "192.168.5.2"
      p1jenkins.ssh.insert_key=false
      p1jenkins.vm.provider :virtualbox do |v|
        v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
        v.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
        v.customize ["modifyvm", :id, "--memory", 3072]
        v.customize ["modifyvm", :id, "--name", "p1jenkins-pipeline"]
        v.customize ["modifyvm", :id, "--cpus", "2"]
      end
      config.vm.provision "shell", inline: <<-SHELL
        sed -i 's/ChallengeResponseAuthentication no/ChallengeResponseAuthentication yes/g' /etc/ssh/sshd_config    
        service ssh restart
      SHELL
      config.vm.provision "ansible" do |ansible|
        ansible.playbook = "playbook.yml"
      end
    end
  
    # serveur dev
    config.vm.define "srvdev-pipeline" do |srvdev|
      srvdev.vm.box = "debian/buster64"
      srvdev.vm.hostname = "srvdev-pipeline"
      srvdev.vm.box_url = "debian/buster64"
      srvdev.vm.network :private_network, ip: "192.168.5.3"
      srvdev.ssh.insert_key=false
      srvdev.vm.provider :virtualbox do |v|
        v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
        v.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
        v.customize ["modifyvm", :id, "--memory", 512]
        v.customize ["modifyvm", :id, "--name", "srvdev-pipeline"]
        v.customize ["modifyvm", :id, "--cpus", "1"]
      end
      config.vm.provision "shell", inline: <<-SHELL
        sed -i 's/ChallengeResponseAuthentication no/ChallengeResponseAuthentication yes/g' /etc/ssh/sshd_config
        service ssh restart
      SHELL
    end
  
    # serveur stage/recette
    config.vm.define "srvstage-pipeline" do |srvstage|
      srvstage.vm.box = "debian/buster64"
      srvstage.vm.hostname = "srvstage-pipeline"
      srvstage.vm.box_url = "debian/buster64"
      srvstage.vm.network :private_network, ip: "192.168.5.7"
      srvstage.ssh.insert_key=false
      srvstage.vm.provider :virtualbox do |v|
        v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
        v.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
        v.customize ["modifyvm", :id, "--memory", 512]
        v.customize ["modifyvm", :id, "--name", "srvstage-pipeline"]
        v.customize ["modifyvm", :id, "--cpus", "1"]
      end
      config.vm.provision "shell", inline: <<-SHELL
        sed -i 's/ChallengeResponseAuthentication no/ChallengeResponseAuthentication yes/g' /etc/ssh/sshd_config
        service ssh restart
      SHELL
    end
  
    # serveur prod
    config.vm.define "srvprod-pipeline" do |srvprod|
      srvprod.vm.box = "debian/buster64"
      srvprod.vm.hostname = "srvprod-pipeline"
      srvprod.vm.box_url = "debian/buster64"
      srvprod.vm.network :private_network, ip: "192.168.5.4"
      srvprod.ssh.insert_key=false
      srvprod.vm.provider :virtualbox do |v|
        v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
        v.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
        v.customize ["modifyvm", :id, "--memory", 512]
        v.customize ["modifyvm", :id, "--name", "srvprod-pipeline"]
        v.customize ["modifyvm", :id, "--cpus", "1"]
      end
      config.vm.provision "shell", inline: <<-SHELL
        sed -i 's/ChallengeResponseAuthentication no/ChallengeResponseAuthentication yes/g' /etc/ssh/sshd_config
        service ssh restart
      SHELL
    end
  
  end
  
  