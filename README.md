### TODO
- Make more prettier
- move electron stuff to folder
- pack frontend and use it instead of webpack version

```sh
wsl --cd "${PWD}" docker "$@"
```

### Packaging (might take a long time)
```sh
npm run package
```

### WSL setup

```bat
# Set WSL to default to v2
wsl --set-default-version 2

# check the version
wsl -l -v

# Output should show Ubuntu and version 2
# if not, you can upgrade the distro
# this usually takes 5-10 minutes
wsl --set-version Ubuntu 2
```

####in wsl
```sh

# update the package manager and install some prerequisites (all of these aren't technically required)
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common libssl-dev libffi-dev git wget nano

# create a group named docker and add yourself to it
#   so that we don't have to type sudo docker every time
#   note you will need to logout and login before this takes affect (which we do later)
sudo groupadd docker
sudo usermod -aG docker ${USER}

# add Docker key and repo
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# (optional) add kubectl key and repo
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list

# update the package manager with the new repos
sudo apt-get update

# upgrade the distro
sudo apt-get upgrade -y
sudo apt-get autoremove -y

# install docker
sudo apt-get install -y docker-ce containerd.io

# (optional) install kubectl
sudo apt-get install -y kubectl

# (optional) install latest version of docker compose
sudo curl -sSL https://github.com/docker/compose/releases/download/`curl -s https://github.com/docker/compose/tags | \
grep "compose/releases/tag" | sed -r 's|.*([0-9]+\.[0-9]+\.[0-9]+).*|\1|p' | head -n 1`/docker-compose-`uname -s`-`uname -m` \
-o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose

echo "sudo service docker start" >> ~/.profile

# exit and then restart WSL
exit

```

#### docker.bat
```bat
wsl -e docker %*
```