import { readFileSync } from "fs";

export function install({ packageFile }) {
    const dependencies = topLevelDependencies(packageFile);
    console.log("Installing: " + JSON.stringify(dependencies));
}
function topLevelDependencies(packageFilePath: string): Record<string, string> {
    return JSON
        .parse(readFileSync(packageFilePath, { encoding: 'utf-8' }))
        .dependencies;
}
