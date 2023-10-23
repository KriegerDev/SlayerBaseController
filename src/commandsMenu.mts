import {clearScreen, optionsSeparator, separator, asciiSlayer07, displayOptMessage} from "./utils.mjs";
import chalk from "chalk";
import rl from "./readline.mjs";
import mainMenu from "./mainMenu.mjs";
import {controller, whitelist} from "./controller.mjs";
import {IInfo, IMassBan, IMassReply, IMassSend, IPacket, IResponse, PACKET_TYPE} from 'slayer07';

function displayCache(cache: {} | undefined) {
    if(cache !== undefined) {
        separator();
        console.log(chalk.cyan("Cache: "))
        console.log(chalk.cyan(JSON.stringify(cache, null, 2)));
        separator();
    }
}

let sendCache: {} | undefined = {};
let sendOptMessage: string | undefined = undefined;
function send() {
    clearScreen();
    asciiSlayer07();
    console.log(chalk.redBright('Slayer07 ') + chalk.blue('send command'));
    displayCache(sendCache);
    displayOptMessage(sendOptMessage);
    sendOptMessage = undefined;

    rl.question(chalk.cyan('Worker ID? [Enter to return]: '), id => {
        if (id == '') {
            commandsMenu();
        } else {
            controller.updateWorkers().then((workers: IInfo[]) => {
                let found = false;
                for(const worker of workers) {
                    if(worker.workerId == parseInt(id)) {
                        found = true;
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

                                    const packet: IPacket = {
                                        type: PACKET_TYPE.MASSSEND,
                                        data: masssend
                                    }

                                    controller.sendPacket(packet, worker).then((worker: IInfo) => {
                                        sendOptMessage = chalk.green(`Worker ${worker.workerId} has successfully listened to command`);
                                        sendCache = {
                                            workerId: parseInt(id),
                                            data: masssend
                                        }
                                        send();
                                    }).catch((error: any) => {
                                        sendOptMessage = chalk.red(`${error}`);
                                        send();
                                    });
                                });
                            });
                        });
                    }

                }
                if(!found) {
                    sendOptMessage = chalk.red('Worker ID ' + id + ' not found.');
                    send();
                }
            })
        }
    })
}

let mass_sendCache: {} | undefined = {};
let mass_sendOptMessage: string | undefined = undefined;
function mass_send() {
    clearScreen();
    asciiSlayer07();
    console.log(chalk.redBright('Slayer07 ') + chalk.blue('mass send command'));
    displayCache(mass_sendCache);
    displayOptMessage(mass_sendOptMessage);
    mass_sendOptMessage = undefined;

    const masssend: IMassSend = {
        guildId: "",
        channelId: "",
        content: ""
    }

    rl.question(chalk.cyan('guildId: [Enter to return]'), guildId => {
        if(guildId == '') {
            commandsMenu();
        } else {
            masssend.guildId = guildId;
            rl.question(chalk.cyan('channelId: '), channelId => {
                masssend.channelId = channelId;
                rl.question(chalk.cyan('content: '), content => {
                    masssend.content = content;

                    const packet: IPacket = {
                        type: PACKET_TYPE.MASSSEND,
                        data: masssend
                    }

                    controller.sendBroadcastPacket(packet).then((resp: IResponse) => {
                        mass_sendOptMessage = chalk.green(`${resp.data.length} bots listened to command`);
                        mass_sendCache = masssend;
                        mass_send();
                    }).catch((error: any) => {
                        mass_sendOptMessage = chalk.red(`${error}`);
                        mass_send();
                    });
                });
            });
        }
    });
}

let replyCache: {} | undefined = {};
let replyOptMessage: string | undefined = undefined;
function reply() {
    clearScreen();
    asciiSlayer07();
    console.log(chalk.redBright('Slayer07 ') + chalk.blue('reply command'));
    displayCache(replyCache);
    displayOptMessage(replyOptMessage);
    replyOptMessage = undefined;

    rl.question(chalk.cyan('Worker ID? [Enter to return]: '), id => {
        if (id == '') {
            commandsMenu();
        } else {
            controller.updateWorkers().then((workers: IInfo[]) => {
                let found = false;
                for(const worker of workers) {
                    if(worker.workerId == parseInt(id)) {
                        found = true;
                        const massreply: IMassReply = {
                            guildId: "",
                            channelId: "",
                            messageId: "",
                            content: ""
                        }
                        rl.question(chalk.cyan('guildId: '), guildId => {
                            massreply.guildId = guildId;
                            rl.question(chalk.cyan('channelId: '), channelId => {
                                massreply.channelId = channelId;
                                rl.question(chalk.cyan('messageId: '), messageId => {
                                    massreply.messageId = messageId;
                                    rl.question(chalk.cyan('content: '), content => {
                                        massreply.content = content;

                                        const packet: IPacket = {
                                            type: PACKET_TYPE.MASSREPLY,
                                            data: massreply
                                        }
                                        controller.sendPacket(packet, worker).then((worker: IInfo) => {
                                            replyOptMessage = chalk.green(`Worker ${worker.workerId} has successfully listened to command`);
                                            replyCache = {
                                                workerId: parseInt(id),
                                                data: massreply
                                            }
                                            reply();
                                        }).catch((error: any) => {
                                            replyOptMessage = chalk.red(`${error}`);
                                            reply();
                                        });
                                    });
                                });
                            });
                        });
                    }
                }
                if(!found) {
                    replyOptMessage = chalk.red('Worker ID ' + id + ' not found.');
                    reply();
                }
            })
        }
    })
}

let mass_replyCache: {} | undefined = {};
let mass_replyOptMessage: string | undefined = undefined;
function mass_reply() {
    clearScreen();
    asciiSlayer07();
    console.log(chalk.redBright('Slayer07 ') + chalk.blue('mass reply command'));
    displayCache(mass_replyCache);
    displayOptMessage(mass_replyOptMessage);
    mass_replyOptMessage = undefined;

    const massreply: IMassReply = {
        guildId: "",
        channelId: "",
        messageId: "",
        content: ""
    }

    rl.question(chalk.cyan('guildId: [Enter to return]'), guildId => {
        if(guildId == '') {
            commandsMenu();
        } else {
            massreply.guildId = guildId;
            rl.question(chalk.cyan('channelId: '), channelId => {
                massreply.channelId = channelId;
                rl.question(chalk.cyan('messageId: '), messageId => {
                    massreply.messageId = messageId;
                    rl.question(chalk.cyan('content: '), content => {
                        massreply.content = content;

                        const packet: IPacket = {
                            type: PACKET_TYPE.MASSREPLY,
                            data: massreply
                        }
                        controller.sendBroadcastPacket(packet).then((resp: IResponse) => {
                            mass_replyOptMessage = chalk.green(`${resp.data.length} bots listened to command`);
                            mass_replyCache = massreply;
                            mass_reply();
                        }).catch((error: any) => {
                            mass_replyOptMessage = chalk.red(`${error}`);
                            mass_reply();
                        });
                    });
                });
            });
        }
    });
}

let massbanCache: {} | undefined = {};
let massbanOptMessage: string | undefined = undefined;
function massban() {
    clearScreen();
    displayCache(massbanCache);
    displayOptMessage(massbanOptMessage);
    massbanOptMessage = undefined;

    rl.question(chalk.cyan('Worker ID? [Enter to return]: '), id => {
        if (id == '') {
            commandsMenu();
        } else {
            controller.updateWorkers().then((workers: IInfo[]) => {
                let found = false;
                for(const worker of workers) {
                    if(worker.workerId == parseInt(id)) {
                        found = true;
                        const _massban: IMassBan = {
                            guildId: "",
                            id_whitelist: [],
                            workerCount: 1
                        }
                        _massban.id_whitelist = whitelist;

                        rl.question(chalk.cyan('guildId: '), guildId => {
                            _massban.guildId = guildId;
                            const packet: IPacket = {
                                type: PACKET_TYPE.MASSBAN,
                                data: _massban
                            }
                            controller.sendPacket(packet, worker).then((worker: IInfo) => {
                                replyOptMessage = chalk.green(`Worker ${worker.workerId} has successfully listened to command`);
                                massbanCache = {
                                    workerId: parseInt(id),
                                    data: _massban
                                }
                                massban();
                            }).catch((error: any) => {
                                replyOptMessage = chalk.red(`${error}`);
                                massban();
                            });
                        });
                    }
                }
                if(!found) {
                    massbanOptMessage = chalk.red('Worker ID ' + id + ' not found.');
                    massban();
                }
            })
        }
    })
}

let mass_banCache: {} | undefined = {};
let mass_banOptMessage: string | undefined = undefined;
function mass_ban() {
    clearScreen();
    displayCache(mass_banCache);
    displayOptMessage(mass_banOptMessage);
    mass_banOptMessage = undefined;

    const _massban: IMassBan = {
        guildId: "",
        id_whitelist: [],
        workerCount: 1
    }
    _massban.id_whitelist = whitelist;
    rl.question(chalk.cyan('guildId: [Enter to return] '), guildId => {
        if(guildId == '') {
            commandsMenu();
        } else {
            _massban.guildId = guildId;
            const packet: IPacket = {
                type: PACKET_TYPE.MASSBAN,
                data: _massban
            }
            controller.sendBroadcastPacket(packet).then((resp: IResponse) => {
                mass_banOptMessage = chalk.green(`${resp.data.length} bots listened to command`);
                massbanCache = _massban;
                mass_ban();
            }).catch((error: any) => {
                replyOptMessage = chalk.red(`${error}`);
                mass_ban();
            });
        }
    });
}


let commandsMenuOptMessage: string | undefined = undefined;
function commandsMenu() {
    clearScreen();
    asciiSlayer07();
    console.log(chalk.redBright('Slayer07 ') + chalk.blue('command module'));
    optionsSeparator();
    console.log(chalk.cyanBright('1 - Send'));
    console.log(chalk.cyanBright('2 - Reply'));
    console.log(chalk.cyanBright('3 - Single massban'));
    console.log(chalk.cyanBright('4 - Mass send [all workers]'));
    console.log(chalk.cyanBright('5 - Mass reply [all workers]'));
    console.log(chalk.cyanBright('6 - Mass ban [all workers]'));
    console.log(chalk.cyanBright('Enter - Return to main menu'));
    separator();
    displayOptMessage(commandsMenuOptMessage);

    rl.question(chalk.cyan('option: '), opt => {
        switch(opt) {
            case '1': {
                send();
                break;
            }
            case '2': {
                reply();
                break;
            }
            case '3': {
                massban();
                break;
            }
            case '4': {
                mass_send();
                break;
            }
            case '5': {
                mass_reply()
                break;
            }
            case '6': {
                mass_ban();
                break;
            }
            default: {
                mainMenu();
            }
        }
    });
}
export default commandsMenu;