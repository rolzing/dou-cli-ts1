import * as cp from 'child_process';
import chalk from "chalk";
import * as inquirer from 'inquirer';
import * as path from 'path';
import * as fs from 'fs';

export class AuthSetup {
     questions = [
        {
            type: 'input',
            name: 'kcPort',
            message: 'Which port do you want keycloak service to run on?',
            default: '9000'
        },
        {
            type: 'input',
            name: 'kcUsername',
            message: 'Type a username to access to keycloack: ',
            default: 'admin'
        },
        {
            type: 'password',
            name: 'kcPassword',
            message: 'Type a password for the created user: ',
            default: 'admin'
        },
        {
            type: 'password',
            name: 'kcPasswordConfirm',
            message: 'Confirm password: ',
            validate(input:any, answers:any) {
                if (input === answers.kcPassword) {
                    return true;
                }
                return 'Input does not match with previously submitted password';
            },
            default: 'admin'
        }
    ];

    public initialize(){
        inquirer.prompt(this.questions).then(answers => {
            const { kcPort, kcUsername, kcPassword } = answers;
            this.checkIfDockerIsAlreadyInstalled();
            this.checkIfDockerDeamonIsRunning();
            this.killCurrentInstances();
            this.mountPostgressContainer();
            this.mountKeycloakContainer(kcPort, kcUsername, kcPassword);
            this.listDockerContainers();
        });
    }

    killCurrentInstances = () => {
        process.stdout.write(
            'Cleaning any existing postgress and keycloak containers... \n'
        );
        cp.execSync(
            `
    set -x
    docker kill postgres || true && docker rm postgres || true
    docker kill keycloak || true && docker rm keycloak || true
    `,
            {
                stdio: 'inherit'
            }
        );
    };

    mountPostgressContainer = () => {
        process.stdout.write('Mounting postgress docker container... \n');
        cp.execSync(
            `
    docker run --name postgres -e POSTGRES_DATABASE=keycloak -e POSTGRES_USER=keycloak -e POSTGRES_PASSWORD=password -e POSTGRES_ROOT_PASSWORD=password -d postgres
    `,
            {
                stdio: 'inherit'
            }
        );
    };

    mountKeycloakContainer = ( port:any, username:any, password:any ) => {
        process.stdout.write('Mounting keycloack docker container... \n');
        cp.execSync(
            `
    docker run -p ${port}:8080 --name keycloak --link postgres:postgres  -e KEYCLOAK_USER=${username} -e KEYCLOAK_PASSWORD=${password} -e POSTGRES_DATABASE=keycloak -e POSTGRES_USER=keycloak -e POSTGRES_PASSWORD=password -d jboss/keycloak-ha-postgres
    `,
            {
                stdio: 'inherit'
            }
        );
    };

    listDockerContainers = () => {
        cp.execSync(
            `
    docker ps
    `,
            {
                stdio: 'inherit'
            }
        );
    };

    checkIfDockerIsAlreadyInstalled = () => {
        process.stdout.write('Check if docker is already installed... \n');
        cp.execSync(
            `
    if ! [ -x "$(command -v docker)" ]; then 
    echo "command 'docker' does not exist... installing docker"
    brew install docker docker-compose docker-machine xhyve docker-machine-driver-xhyve
    else 
    echo "command 'docker' is a valid command"
    fi;`,
            {
                stdio: 'inherit'
            }
        );
    };

    checkIfDockerDeamonIsRunning = () => {
        process.stdout.write('Check if docker deamon is running... \n');
        cp.execSync(
            `#!/bin/bash
    #Open Docker, only if is not running
    if (! docker stats --no-stream ); then
    # On Mac OS this would be the terminal command to launch Docker
    open /Applications/Docker.app
    #Wait until Docker daemon is running and has completed initialisation
    while (! docker stats --no-stream ); do
    # Docker takes a few seconds to initialize
    echo "Waiting for Docker to launch..."
    sleep 1
    done
    fi
    `,
            { stdio: 'inherit' }
        );
    };
}

let authSetup = new AuthSetup()
authSetup.initialize();