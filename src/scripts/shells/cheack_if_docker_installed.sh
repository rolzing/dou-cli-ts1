if ! [ -x "$(command -v docker)" ]; then 
    echo "command 'docker' does not exist... installing docker"
    brew install docker docker-compose docker-machine xhyve docker-machine-driver-xhyve
    else 
    echo "command 'docker' is a valid command"
    fi;`