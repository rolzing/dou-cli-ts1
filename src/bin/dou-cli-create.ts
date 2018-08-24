const program = require("commander");
const chalk = require("chalk");
const cp = require("child_process");
const path = require("path");

export class DouCliCreate {
  /**
   * @function appSetup
   * Function used to call the appSetup script
   * @see scripts/appSetup
   */
  appSetup = () => {
    const scriptPath = `${path.join(__dirname, "../scripts/app-setup.js")}`;
    process.stdout.write(chalk.blue("Creating app...\n"));
    cp.execSync(`node ${scriptPath}`, {
      stdio: "inherit"
    });
  };

  /**
   * @function authSetup
   * Function used to call the appSetup script
   * @see scripts/authSetup
   */
  authSetup = () => {
    const scriptPath = `${path.join(__dirname, "scripts/authSetup.js")}`;
    process.stdout.write(chalk.blue("Mounting auth services...\n"));
    cp.execSync(`node ${scriptPath} `, {
      stdio: "inherit"
    });
  };
}
