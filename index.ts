import { Command } from "commander";
const program = new Command()


function add() { console.log("add") }
function install() { console.log("install") }

program
    .command('add')
    .argument('package', 'The package name')
    .option('-d, --dev', 'Add to devDependencies')
    .action(add);

program.command('install')
    .action(install)

program.parse();