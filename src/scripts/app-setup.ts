import * as cp from 'child_process';
import chalk from "chalk";
import * as inquirer from 'inquirer';
import * as path from 'path';
import * as fs from 'fs';


export class AppSetup {
    currentDir:any = process.cwd();
    framework: any;
    repositories:any = {
        react: 'https://github.com/andoniArb/react-base-app.git',
        vue: 'https://github.com/andoniArb/vue-base-app.git',
        angular: 'https://github.com/rolzing/digitalonus-angular-base-app'
    };
    startInstructions:any  = {
        react: `
        cd app
        npm start
    `,
        vue: `
        cd app
        npm run dev
    `,
        angular: `
    cd app
    npm start
    `
    };
    questions:any = [
        {
            type: 'confirm',
            name: 'overwriteFolder',
            message: 'Do you wish to overwrite the folder?',
            default: false
        },
        {
            type: 'confirm',
            name: 'backupFiles',
            message: 'Do you wish to backup existing app folder files?',
            when: (answers:any) => {
                return answers.overwriteFolder;
            },
            default: false
        },
        {
            type: 'input',
            name: 'backupDir',
            message: 'What name would you want the backup folder to have',
            when: (answers:any) => {
                return answers.backupFiles;
            },
            default: 'app_oldv'
        }
    ];
    frameworksApp:any = [
        {
            type: 'list',
            name: 'frameworkApp',
            message: 'Want framework want to choice',
            choices: ['react', 'vue', 'angular'],
            default: 'angular'
        }
    ];

    public initialize(){
        inquirer.prompt(this.frameworksApp).then((answers:any) => {
            this.framework = answers.frameworkApp;
            this.appSetupScript();
        });
    }

    /**
     * @function eraseAppFolder
     * shell command to remove
     * all files from app folder
     */
    eraseAppFolder = () => {
        process.stdout.write('Deleting app folder...\n');
        cp.execSync('rm -rf app', { stdio: 'inherit' });
    };

    /**
     * @function moveFilesToFolder
     * @param {string} dir Desired relative path to save files.
     * shell command to backup existing
     * app folder in the desired location
     */
    moveFilesToFolder = (dir:any) => {
        process.stdout.write(
            chalk.yellow(`Backing up current app files to ${dir} folder\n`)
        );
        cp.execSync(`mv app ${dir}`, { stdio: 'inherit' });
    };

    /**
     * @function cloneRepo
     * shell command to clone repository into
     * app folder and remove .git folder
     * so that it is not attached to any remote
     * repository
     */
    cloneRepo = () => {
        process.stdout.write('Cloning base project into app folder \n');
        cp.execSync(
            `
       git clone ${this.repositories[this.framework]} app
       cd app
       rm -rf .git
     `,
            {
                stdio: 'inherit'
            }
        );
    };

    /**
     * @function installDependencies
     * shell command to install of the project
     * dependencies on the app folder
     */
    installDependencies = () => {
        process.stdout.write(chalk.green('Installing project dependencies...\n'));
        cp.execSync(
            `
           cd app
           npm install
       `,
            {
                stdio: 'inherit'
            }
        );
        process.stdout.write(
            chalk.green(`\n\nBase ${this.framework} app installed on app folder\n`)
        );
    };

    /**
     * @function runProject
     * shell command to run the project
     * especified on the startInstructions
     * dictionary
     */
    runProject = () => {
        process.stdout.write('Starting proyect...');
        cp.execSync(this.startInstructions[this.framework], {
            stdio: 'inherit'
        });
    };

    appSetupScript = () => {
        /**
         * If the app folder already exists we promp
         * the user with the question if they desire to
         * overwrite it
         */
        if (fs.existsSync(path.join(this.currentDir, 'app'))) {
            process.stdout.write(chalk.red('An app folder already exists\n'));
            /**
             * We prompt the user with three questions specified
             * at the questions dictionary
             */
            inquirer.prompt(this.questions).then((answers:any) => {
                /** We receive and destructure the answers */
                const { overwriteFolder, backupFiles, backupDir } = answers;
                if (overwriteFolder) {
                    /** if user answered yes to overwrite question */
                    if (backupFiles) {
                        /** if user wants to keep the existing files */
                        /**
                         * We call moveFilesToFolder function and send
                         * the backupDir answer as dir parameter
                         * @see moveFilesToFolder
                         */
                        this.moveFilesToFolder(backupDir);
                    }
                    /**
                     * We then proceed to run all of the
                     * shell commands to clean app folder,
                     * clone repository to app folder,
                     * install dependencies, and run project.
                     */
                    this.eraseAppFolder();
                    this.cloneRepo();
                    this.installDependencies();
                    this.runProject();
                } else {
                    /**
                     * If user anwers no to the overwrite question
                     * we abort the process and notify them
                     */
                    process.stdout.write(chalk.red('Aborting proyect setup\n'));
                    process.exit();
                }
            });
        } else {
            /**
             * If there is no app folder existing
             * we just proceed to clone, install dependecies and run
             * the project
             */
            this.cloneRepo();
            this.installDependencies();
            this.runProject();
        }
    };
}
let appSetup = new AppSetup();
appSetup.initialize();

interface repository {
   repository: {
        name: string
    }
}