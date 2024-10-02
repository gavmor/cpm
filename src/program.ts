import { Command } from "commander";
import { add } from "./add";
import { install } from "./install";

export const program = new Command();
program
    .command('add')
    .argument('package', 'The package name')
    .option('-d, --dev', 'Add to devDependencies')
    .action(add);
    
program.command('install')
    .option('--packageFile <file>', 'Source file to install from', "./package.json")
    .action(install);
