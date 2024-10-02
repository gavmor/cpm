import { readFileSync } from "fs";
import { test, expect, is, equals } from "@benchristel/taste"


export async function install({ packageFile }) {
    constructInstallationPlan(pluckDeps(packageFile))
}

type Herd = Record<string, Version>;
type InstallationPlan = DependencyInstallation[]
type Version = `${number}.${number}.${number}`;
interface Dependency { name: string, version: Version }
interface DependencyInstallation extends Dependency {
    parentDirectory?:string
}

function pluckDeps(packageFilePath: string): Herd {
    return JSON.parse(readFileSync(packageFilePath, { encoding: 'utf-8' }))
        .dependencies;
}

async function constructInstallationPlan(
    topLevelDependencies: Herd
): Promise<InstallationPlan> {
    return Object
       .entries(topLevelDependencies)
       .map(([name, version]) => ({
            name, 
            version,
            parentDirectory:  "node_modules"
        }));
}

test("constructInstallationPlan", {
    async "by default, assigns dependencies to node_modules"() {
        expect(await constructInstallationPlan({ 
            "foo": "1.2.3", "bar": "1.0.1",
        }), equals, [
            { name: "foo", version:"1.2.3", parentDirectory:"node_modules"},
            { name: "bar", version:"1.0.1", parentDirectory:"node_modules"}
        ]);
    },
})