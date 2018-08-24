import * as commander from 'commander';
import { Writer } from '../writer';
import {DouCliCreate} from "./dou-cli-create";

export class Write {

    private program: commander.CommanderStatic;
    private package: any;
    private writer: Writer;
    douCliCreate:DouCliCreate;
    constructor() {
        this.program = commander;
        this.package = require('../../package.json');
        this.writer = new Writer();
        this.douCliCreate = new DouCliCreate();
    }

    public initialize() {
        this.program
            .version(this.package.version)
            .option('-m, --message [value]', 'Say hello!')
            .parse(process.argv);

        this.douCliCreate.appSetup();

        this.program.help();
    }

}

let app = new Write();
app.initialize();
