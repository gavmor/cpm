import { readFileSync } from "fs";

export function install({ packageFile }) {
    console.log("Installing: " + JSON.stringify(constructInstallationPlan(dependencies(packageFile))));
}

type Herd = Record<string, string>;

function dependencies(packageFilePath: string): Herd {
    return JSON
        .parse(readFileSync(packageFilePath, { encoding: 'utf-8' }))
        .dependencies;
}

type InstallationPlan = Dependency[]
type Version = string;
type Dependency = Record<string, Version>;

function constructInstallationPlan(
    topLevelDependencies: Dependency
): InstallationPlan {
    return [
        {name: "foo", version: "1.0"},
        {name: "bar", version: "2.0"}
    ]
}