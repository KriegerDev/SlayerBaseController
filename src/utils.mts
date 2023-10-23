import chalk from "chalk";

export function clearScreen() {
    process.stdout.write('\x1Bc');
}

export function optionsSeparator() {
    console.log(chalk.blue('===========') + chalk.cyan(' Options ') + chalk.blue('==========='));
}

export function separator() {
    console.log(chalk.blue('==============================='));
}
export function asciiSlayer07() {
    console.log(chalk.redBright(` ___ _                    __ ____ \r\n \/ __| |__ _ _  _ ___ _ _ \/  \\__  |\r\n \\__ \\ \/ _\` | || \/ -_) \'_| () |\/ \/ \r\n |___\/_\\__,_|\\_, \\___|_|  \\__\/\/_\/  \r\n             |__\/                 `));
}

export function displayOptMessage(message: string | undefined) {
    if(message !== undefined)
    {
        console.log(message);
    }
}
