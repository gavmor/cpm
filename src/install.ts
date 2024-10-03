import { readFileSync } from "fs";
import { constructInstallationPlan, Herd } from "./constructInstallationPlan";

export async function install({ packageFile }) {
    constructInstallationPlan(readDeps(packageFile))
}

function readDeps(packageFilePath: string): Hegird {
    return JSON.parse(readFileSync(packageFilePath, { encoding: 'utf-8' }))
        .dependencies;
}

