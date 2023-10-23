import {asciiSlayer07, clearScreen, optionsSeparator, separator, displayOptMessage} from "./utils.mjs";
import chalk from "chalk";
import {controller} from "./controller.mjs";
import mainMenu from "./mainMenu.mjs"
import rl from './readline.mjs'
import {IInfo} from "slayer07";

let listWorkersMenuOptMessage: string | undefined = undefined;
function listWorkersMenu() {
    clearScreen();
    asciiSlayer07();
    console.log(chalk.redBright('Slayer07 ') + chalk.blue('Worker list: '));
    if (controller.workerCount == 0) {
        console.log(chalk.redBright('There are no workers.'));
        rl.question(chalk.cyan('Press enter to return: '), (opt: string) => {
            workersMenu();
        });
    } else {
        console.log(chalk.greenBright(`Worker count: ${controller.workerCount}`));
        separator();
        for (const worker of controller.workers) {
            console.log('Worker ID: ' + chalk.cyan(worker.workerId));
            if (worker.workerStatus == 'free') {
                console.log('Worker Status: ' + chalk.greenBright(worker.workerStatus));
            } else {
                console.log('Worker Status: ' + chalk.red(worker.workerStatus));
            }
            separator();
        }

        optionsSeparator();
        console.log(chalk.cyanBright('1 - Exit'));
        console.log(chalk.cyanBright('2 - Worker verbose info'));
        separator();
        displayOptMessage(listWorkersMenuOptMessage);
        listWorkersMenuOptMessage = undefined;

        rl.question(chalk.cyan('option: '), (opt: string) => {
            switch (opt) {
                case '1':
                    workersMenu();
                case '2': {
                    let found: boolean = false;
                    rl.question('Worker id? ', (id) => {
                        for (const worker of controller.workers) {
                            if (worker.workerId == parseInt(id)) {
                                found = true;
                                separator();
                                console.log('Worker ID: ' + chalk.cyan(worker.workerId));
                                if (worker.workerStatus == 'free') {
                                    console.log('Worker Status: ' + chalk.greenBright(worker.workerStatus));
                                } else {
                                    console.log('Worker Status: ' + chalk.red(worker.workerStatus));
                                }
                                console.log('Worker Discord ID: ' + chalk.cyan(worker.workerDiscordId));
                                console.log('Worker Token: ' + chalk.cyan(worker.workerToken));
                                console.log('Worker Host: ' + chalk.cyan(worker.workerHost));
                                console.log('Worker Port: ' + chalk.cyan(worker.workerPort));
                                separator();

                                rl.question("Press enter to return: ", enter => {
                                    listWorkersMenu();
                                });
                            }
                        }
                        if (!found) {
                            listWorkersMenuOptMessage = chalk.red('Worker ID ' + id + ' not found.')
                            listWorkersMenu();
                        }
                    });
                    break;
                }
                default: {
                    listWorkersMenuOptMessage = chalk.red('Invalid option.');
                    listWorkersMenu();
                }
            }
        });
    }
}

let connectWorkerMenuOptMessage: string | undefined = undefined;
function connectWorkerMenu() {
    clearScreen();
    asciiSlayer07();
    console.log(chalk.redBright('Slayer07 ') + chalk.blue('Connect worker'));
    optionsSeparator();
    console.log(chalk.cyanBright('1 - Localhost'));
    console.log(chalk.cyanBright('2 - Custom host'));
    console.log(chalk.cyanBright('Enter - Return to worker module'));
    separator();
    displayOptMessage(connectWorkerMenuOptMessage);
    connectWorkerMenuOptMessage = undefined;

    rl.question(chalk.cyan('option: '), opt => {
        switch (opt) {
            case '1': {
                rl.question(chalk.cyan('Worker port? '), opt => {
                    const port = parseInt(opt);
                    controller.connect('localhost', port).then(() => {
                        connectWorkerMenuOptMessage = chalk.greenBright('Successfully connected!');
                        connectWorkerMenu();
                    }).catch((err: any) => {
                        connectWorkerMenuOptMessage = chalk.redBright(err);
                        connectWorkerMenu();
                    });
                });
                break;
            }
            case '2': {
                rl.question(chalk.cyan('Worker host? '), _host => {
                    const host = _host;
                    rl.question(chalk.cyan('Worker port? '), _port => {
                        const port = parseInt(_port);
                        controller.connect(host, port).then(() => {
                            console.log("AAAAAA");
                            connectWorkerMenuOptMessage = chalk.greenBright('Successfully connected!');
                            connectWorkerMenu();
                        }).catch((err: any) => {
                            connectWorkerMenuOptMessage = chalk.redBright(err)
                            connectWorkerMenu();
                        });
                    });
                });
                break;
            }
            default: {
                workersMenu();
            }
        }
    });
}

let workersMenuOptMessage: string | undefined = undefined;
function workersMenu() {
    clearScreen();
    asciiSlayer07();
    console.log(chalk.redBright('Slayer07 ') + chalk.blue('Worker module'));
    optionsSeparator();
    console.log(chalk.cyanBright('1 - List workers'));
    console.log(chalk.cyanBright('2 - Update workers'));
    console.log(chalk.cyanBright('3 - Connect worker'));
    console.log(chalk.cyanBright('Enter - Return to main menu'));
    separator();
    displayOptMessage(workersMenuOptMessage);
    workersMenuOptMessage = undefined;

    rl.question(chalk.cyan('option: '), opt => {
        switch (opt) {
            case '1': {
                listWorkersMenu();
                break;
            }
            case '2': {
                updateWorkers();
                break;
            }
            case '3': {
                connectWorkerMenu();
                break;
            }
            default: {
                mainMenu();
            }
        }
    })
}

function updateWorkers() {
    if (controller.workerCount == 0) {
        workersMenuOptMessage = chalk.redBright('There are no workers.')
        workersMenu();
    } else {
        controller.updateWorkers().then((workers: IInfo[]) => {
            workersMenuOptMessage = chalk.greenBright('Successfully updated %d workers!', workers.length)
            workersMenu();
        }).catch((error: any) => {
            workersMenuOptMessage = chalk.red(error);
            workersMenu();
        });
    }
}

export default workersMenu;