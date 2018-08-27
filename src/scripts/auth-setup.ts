import * as cp from "child_process";
import * as inquirer from "inquirer";
const path = require("path");



export class AuthSetup {
  questions = [
    {
      type: "input",
      name: "kcPort",
      message: "Which port do you want keycloak service to run on?",
      default: "9000"
    },
    {
      type: "input",
      name: "kcUsername",
      message: "Type a username to access to keycloack: ",
      default: "admin"
    },
    {
      type: "password",
      name: "kcPassword",
      message: "Type a password for the created user: ",
      default: "admin"
    },
    {
      type: "password",
      name: "kcPasswordConfirm",
      message: "Confirm password: ",
      validate(input: any, answers: any) {
        if (input === answers.kcPassword) {
          return true;
        }
        return "Input does not match with previously submitted password";
      },
      default: "admin"
    }
  ];

  public initialize() {
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
      "Cleaning any existing postgress and keycloak containers... \n"
    );
    cp.spawnSync('bash',[__dirname + '/../../src/scripts/shells/clean_postgress_keycloack_container.sh'],
      {
        stdio: "inherit"
      }
    );
  };

  mountPostgressContainer = () => {
    process.stdout.write("Mounting postgress docker container... \n");
    cp.spawnSync('bash',[__dirname + '/../../src/scripts/shells/mounting_postgress_docker.sh'],
      {
        stdio: "inherit"
      }
    );
  };

  mountKeycloakContainer = (port: any, username: any, password: any) => {
    process.stdout.write("Mounting keycloack docker container... \n");
    cp.execSync(
      `
    docker run -p ${port}:8080 --name keycloak --link postgres:postgres  -e KEYCLOAK_USER=${username} -e KEYCLOAK_PASSWORD=${password} -e POSTGRES_DATABASE=keycloak -e POSTGRES_USER=keycloak -e POSTGRES_PASSWORD=password -d jboss/keycloak-ha-postgres
    `,
      {
        stdio: "inherit"
      }
    );
  };

  listDockerContainers = () => {
    cp.execSync(
      `
    docker ps
    `,
      {
        stdio: "inherit"
      }
    );
  };

  checkIfDockerIsAlreadyInstalled = () => {
    process.stdout.write("Check if docker is already installed... \n");
    cp.spawnSync('bash',[__dirname + '/../../src/scripts/shells/check_docker_deamon.sh'],
      {
        stdio: "inherit"
      }
    );
  };

  checkIfDockerDeamonIsRunning = () => {
    
    process.stdout.write("Check if docker deamon is running... \n");
    cp.spawnSync('bash', [__dirname + '/../../src/scripts/shells/check_docker_deamon.sh']
      ,{ stdio: "inherit" }
    );
  };
}

let authSetup = new AuthSetup();
authSetup.initialize();
