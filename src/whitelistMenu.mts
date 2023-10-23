import {clearScreen, optionsSeparator, separator} from "./utils.mjs";
import chalk from "chalk";
import rl from './readline.mjs'
import { whitelist } from "./controller.mjs";
import mainMenu from "./mainMenu.mjs";
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

export default whitelistMenu;