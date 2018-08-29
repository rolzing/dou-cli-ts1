import * as commander from "commander";
import { DouCliCreate } from "../scripts/dou-cli-create";
import { AuthSetup } from "../scripts/auth-setup";
import * as inquirer from 'inquirer';


export class DouCreate {
  private program: commander.CommanderStatic;
  private package: any;
  douCliCreate: DouCliCreate;
  authSetup: AuthSetup;
  frameworkToClone:any;
  dockerNeedIt:any;

  frameworksApp:any = [
    {
        type: 'list',
        name: 'frameworkApp',
        message: 'Want framework want to choice',
        choices: ['react', 'vue', 'angular'],
        default: 'react'
    },{
      type: 'confirm',
      name: 'questionDockerNeedIt',
      message: 'Do you wish login/register component?',
      default: false
  },
];
  constructor() {
    this.program = commander;
    this.package = require("../../package.json");
    this.douCliCreate = new DouCliCreate();
  }

  public initialize() {
    this.program
      .version(this.package.version)
      .option("-m, --message [value]", "Say hello!")
      .parse(process.argv);

      inquirer.prompt(this.frameworksApp).then((answers: any) => {
        this.frameworkToClone =answers.frameworkApp;
        this.dockerNeedIt =answers.questionDockerNeedIt;

        if(this.dockerNeedIt){
          this.douCliCreate.authSetup();
          this.douCliCreate.appSetup(this.frameworkToClone);      
        }else
        this.douCliCreate.appSetup(this.frameworkToClone);    

      })
  }
}

let app = new DouCreate();
app.initialize();
