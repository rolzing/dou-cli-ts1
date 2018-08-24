import * as commander from 'commander';
import chalk from "chalk";
const figlet = require('figlet');


export class App {

    private program: commander.CommanderStatic;
    private package: any;

    constructor() {
        this.program = commander;
        this.package = require('../../package.json');
    }

    public initialize() {
        process.stdout.write(chalk.blue(figlet.textSync('dOu')));
        process.stdout.write('\n');

        this.program
            .version(this.package.version)
            .command('write [message]', 'say hello!')
            .parse(process.argv);
    }

}

let app = new App();
app.initialize();
