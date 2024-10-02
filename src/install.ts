import { readFileSync } from "fs";
import { test, expect, equals } from "@benchristel/taste"
import { constructInstallationPlan, registryPath, planetize, stubFetch } from "./constructInstallationPlan";

export async function install({ packageFile }) {
    constructInstallationPlan(readDeps(packageFile))
}

export type InstallationPlan = DependencyInstallation[]
type Version = `${number}.${number}.${number}`;
interface Dependency { name: string, version: Version }
interface DependencyInstallation extends Dependency {
    parentDirectory?: string
}

function readDeps(packageFilePath: string): Herd {
    return JSON.parse(readFileSync(packageFilePath, { encoding: 'utf-8' }))
        .dependencies;
}

export type Herd = Record<string, Version>;
export const spreadInstallation = async (memo: InstallationPlan, i: DependencyInstallation): Promise<InstallationPlan> => {
    const response = await fetch(registryPath("@benchristel/taste", "0.6.0"));
    const { dependencies }: { dependencies: Herd } = await response.json()
    return [...memo, ...planetize(dependencies)]
};

test("descendPlan", {
    async "fetches the dependencies of a dependency installation, and merges them into a plan"() {
        stubFetch()

        expect(await spreadInstallation([], { name: "qux", version: "0.4.2" }), equals, [{
            name: "child",
            version: "1.0.1",
            parentDirectory: "node_modules"
        }])
    }
})


