import { SlayerConnector, IInfo, IMassSend, IMassReply, IMassBan } from 'slayer07';
import readline from "readline";
import chalk from 'chalk';

const controller = new SlayerConnector();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const whitelist: Array<string> = new Array<string>();

function clearScreen() {
    process.stdout.write('\x1Bc');
}

function optionsSeparator() {
    console.log(chalk.blue('===========') + chalk.cyan(' Options ') + chalk.blue('==========='));
}

function separator() {
    console.log(chalk.blue('==============================='));
}

function listWorkers() {
    clearScreen();
    console.log(chalk.redBright('Slayer07 ') + chalk.cyan('Workers: '));
    if (controller.workerCount == 0) {
        console.log(chalk.redBright('There are no workers.'));
        rl.question(chalk.cyan('Press enter to return: '), opt => {
            mainMenu();
        });
    } else {
        console.log(chalk.greenBright(`Worker count: ${controller.workerCount}`));
        separator();
        for (const worker of controller.workers) {
            console.log('Worker ID: ' + chalk.cyan(worker.workerId));
            if (worker.workerStatus == 'free') {
                console.log('Worker Status: ' + chalk.greenBright(worker.workerStatus));
            }
            else {
                console.log('Worker Status: ' + chalk.red(worker.workerStatus));
            }
            separator();
        }

        optionsSeparator();
        console.log(chalk.cyanBright('1 - Exit'));
        console.log(chalk.cyanBright('2 - Worker verbose info'));
        separator();

        rl.question(chalk.cyan('option: '), (opt) => {
            switch (opt) {
                case '1': mainMenu();
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
                                }
                                else {
                                    console.log('Worker Status: ' + chalk.red(worker.workerStatus));
                                }
                                console.log('Worker Discord ID: ' + chalk.cyan(worker.workerDiscordId));
                                console.log('Worker Token: ' + chalk.cyan(worker.workerToken));
                                console.log('Worker Host: ' + chalk.cyan(worker.workerHost));
                                console.log('Worker Port: ' + chalk.cyan(worker.workerPort));
                                separator();
                            }
                        }
                        if (!found) console.log(chalk.red('Worker ID ' + id + ' not found.'));
                        rl.question(chalk.cyan('Press enter to return: '), opt => {
                            listWorkers();
                        });
                    });
                    break;
                }
                default: {
                    console.log(chalk.red('Invalid option.'));
                    listWorkers();
                }
            }
        });
    }



}

function whitelistMenu() {
    clearScreen();
    optionsSeparator();
    console.log(chalk.cyanBright('1 - Show whitelist'));
    console.log(chalk.cyanBright('2 - Add to whitelist'));
    console.log(chalk.cyanBright('3 - Remove from whitelist'));
    console.log(chalk.cyanBright('Enter - Exit'));
    separator();

    rl.question(chalk.cyan('option: '), opt => {
        switch (opt) {
            case '1': {
                whitelist.forEach(element => {
                    console.log(element);
                });
                rl.question(chalk.cyan('Press enter to return: '), opt => {
                    whitelistMenu();
                });
                break;
            }
            case '2': {
                rl.question(chalk.cyan('ID: '), opt => {
                    for (const element of whitelist) {
                        if (element == opt) {
                            console.log(chalk.red('This id is already in the whitelist.'));
                            rl.question(chalk.cyan('Press enter to return: '), opt => {
                                whitelistMenu();
                            });
                        }
                    }
                    whitelist.push(opt);
                    console.log(chalk.greenBright('Successfully added id to whitelist!'));
                    rl.question(chalk.cyan('Press enter to return: '), opt => {
                        whitelistMenu();
                    });
                });
                break;
            }
            case '3': {
                rl.question(chalk.cyan('ID: '), opt => {
                    const index = whitelist.findIndex(element => {
                        element == opt;
                    });

                    if (index !== -1) {
                        whitelist.splice(index, 1);
                        console.log(chalk.greenBright('Successfully removed id from whitelist!'));
                    } else {
                        console.log(chalk.red('Cant find id on whitelist.'));
                    }

                    rl.question(chalk.cyan('Press enter to return: '), opt => {
                        whitelistMenu();
                    });
                });
                break;
            }

            default: {
                mainMenu();
            }
        }
    });
}

async function mainMenu() {
    clearScreen();
    console.log(chalk.blue('Welcome to ') + chalk.redBright('Slayer07') + chalk.blue(' Controller'));
    console.log(chalk.redBright(` ___ _                    __ ____ \r\n \/ __| |__ _ _  _ ___ _ _ \/  \\__  |\r\n \\__ \\ \/ _\` | || \/ -_) \'_| () |\/ \/ \r\n |___\/_\\__,_|\\_, \\___|_|  \\__\/\/_\/  \r\n             |__\/                 `));
    optionsSeparator();
    console.log(chalk.cyanBright('1 - List workers'));
    console.log(chalk.cyanBright('2 - Connect worker'));
    console.log(chalk.cyanBright('3 - Update workers'));
    console.log(chalk.cyanBright('4 - Mass send'));
    console.log(chalk.cyanBright('5 - Mass reply'));
    console.log(chalk.cyanBright('6 - Mass ban'));
    console.log(chalk.cyanBright('7 - Id whitelist'));
    separator();

    rl.question(chalk.cyan("option: "), (opt: string) => {
        switch (opt) {
            case '1': {
                listWorkers();
                break;
            }
            case '2': {
                console.log(chalk.cyanBright('1 - Localhost'));
                console.log(chalk.cyanBright('2 - Custom'));
                rl.question('option: ', opt => {
                    switch (opt) {
                        case '1': {
                            rl.question(chalk.cyan('Worker port? '), opt => {
                                const port = parseInt(opt);
                                controller.connect('localhost', port).then(() => {
                                    console.log(chalk.greenBright('Successfully connected!'));
                                    rl.question(chalk.cyan('Press enter to return to main menu: '), opt => {
                                        mainMenu();
                                    });
                                }).catch((err: any) => {
                                    console.log(chalk.redBright(err));
                                    rl.question(chalk.cyan('Press enter to return to main menu: '), opt => {
                                        mainMenu();
                                    });
                                });
                            });
                            break;
                        }
                        case '2': {
                            rl.question(chalk.cyan('Worker host? '), opt => {
                                const host = opt;
                                rl.question(chalk.cyan('Worker port? '), opt => {
                                    const port = parseInt(opt);
                                    controller.connect(host, port).then(() => {
                                        console.log(chalk.greenBright('Successfully connected!'));
                                        rl.question(chalk.cyan('Press enter to return to main menu: '), opt => {
                                            mainMenu();
                                        });
                                    }).catch((err: any) => {
                                        console.log(chalk.redBright(err));
                                        rl.question(chalk.cyan('Press enter to return to main menu: '), opt => {
                                            mainMenu();
                                        });
                                    });
                                });
                            });
                            break;
                        }
                    }
                });
                break;
            }
            case '3': {
                if (controller.workerCount == 0) {
                    clearScreen();
                    console.log(chalk.redBright('There are no workers.'));
                    rl.question(chalk.cyan('Press enter to return: '), opt => {
                        mainMenu();
                    });
                } else {
                    controller.updateWorkers().then((workers: IInfo[]) => {
                        clearScreen();
                        console.log(chalk.greenBright('Successfully updated %d workers!', workers.length));
                        rl.question(chalk.cyan('Press enter to return: '), opt => {
                            mainMenu();
                        });
                    }).catch((error: any) => {
                        clearScreen();
                        console.log(chalk.red(error));
                        rl.question(chalk.cyan('Press enter to return: '), opt => {
                            mainMenu();
                        });
                    });
                }
                break;
            }
            case '4': {
                const masssend: IMassSend = {
                    guildId: "",
                    channelId: "",
                    content: ""
                }

                rl.question(chalk.cyan('guildId: '), guildId => {
                    masssend.guildId = guildId;
                    rl.question(chalk.cyan('channelId: '), channelId => {
                        masssend.channelId = channelId;
                        rl.question(chalk.cyan('content: '), content => {
                            masssend.content = content;

                            controller.massSend(masssend).then((workers: any) => {
                                console.log(chalk.green(`${workers.length} listened to command.`))
                                rl.question(chalk.cyan('Press enter to return: '), opt => {
                                    mainMenu();
                                });
                            }).catch((error: any) => {
                                console.log(chalk.red(`${error}`));
                                rl.question(chalk.cyan('Press enter to return: '), opt => {
                                    mainMenu();
                                });
                            });
                        });
                    });
                });
            }
            case '5': {
                const massreply: IMassReply = {
                    guildId: '',
                    channelId: '',
                    messageId: '',
                    content: ''
                }

                rl.question(chalk.cyan('guildId: '), guildId => {
                    massreply.guildId = guildId;
                    rl.question(chalk.cyan('channelId: '), channelId => {
                        massreply.channelId = channelId;
                        rl.question(chalk.cyan('messageId: '), messageId => {
                            massreply.messageId = messageId;
                            rl.question(chalk.cyan('content: '), content => {
                                massreply.content = content;
                                controller.massReply(massreply).then((workers: any) => {
                                    console.log(chalk.green(`${workers.length} listened to command.`))
                                    rl.question(chalk.cyan('Press enter to return: '), opt => {
                                        mainMenu();
                                    });
                                }).catch((error: any) => {
                                    console.log(chalk.red(`${error}`));
                                    rl.question(chalk.cyan('Press enter to return: '), opt => {
                                        mainMenu();
                                    });
                                });
                            });
                        });
                    });
                });
            }
            case '6': {
                const massban: IMassBan = {
                    guildId: '',
                    id_whitelist: [],
                    workerCount: controller.workerCount
                }

                rl.question(chalk.cyan('guildId: '), opt => {
                    massban.guildId = opt;

                    massban.id_whitelist = whitelist;

                    controller.massBan(massban).then((workers: any) => {
                        console.log(chalk.green(`${workers.length} listened to command.`))
                        rl.question(chalk.cyan('Press enter to return: '), opt => {
                            mainMenu();
                        });
                    }).catch((error: any) => {
                        console.log(chalk.red(`${error}`));
                        rl.question(chalk.cyan('Press enter to return: '), opt => {
                            mainMenu();
                        });
                    });
                });
                break;
            }
            case '7': {
                whitelistMenu();
                break;
            }
            default: {
                console.log(chalk.redBright('Unknown option'));
                mainMenu();
            }
        }
    });
}

async function main() {
    await mainMenu();
}

main();