import {clearScreen, optionsSeparator, separator, asciiSlayer07} from "./utils.mjs";
import chalk from "chalk";

import workersMenu from './workersMenu.mjs';
import whitelistMenu from './whitelistMenu.mjs';
import commandsMenu from './commandsMenu.mjs';
import rl from './readline.mjs'

function mainMenu() {
    clearScreen();
    asciiSlayer07();
    console.log(chalk.blue('Welcome to ') + chalk.redBright('Slayer07') + chalk.blue(' Controller'));
    optionsSeparator();
    console.log(chalk.cyanBright('1 - Workers'));
    console.log(chalk.cyanBright('2 - Commands'));
    console.log(chalk.cyanBright('3 - Whitelist'));
    separator();

    rl.question(chalk.cyan("option: "), (opt: string) => {
        switch (opt) {
            case '1': {
                workersMenu();
                break;
            }
            case '2': {
                commandsMenu();
                break;
            }
            case '3': {
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
export default mainMenu;