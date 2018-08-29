import * as commander from "commander";
import chalk from "chalk";
const figlet = require("figlet");

export class Dou {
  private program: commander.CommanderStatic;
  private package: any;

  constructor() {
    this.program = commander;
    this.package = require("../../package.json");
  }

  public initialize() {
    process.stdout.write(chalk.blue(figlet.textSync("dOu")));
    process.stdout.write("\n");

    this.program
      .version(this.package.version)
      .command("create", "Mount app")
      .parse(process.argv);
  }
}

let app = new Dou();
app.initialize();
