import { readFileSync } from "fs";
import { test, expect, is, equals } from "@benchristel/taste"


export function install({ packageFile }) {
    console.log("Installing: " + JSON.stringify(constructInstallationPlan(pluckDeps(packageFile))));
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

function constructInstallationPlan(
    topLevelDependencies: Herd
): InstallationPlan {
    return Object
       .entries(topLevelDependencies)
       .map(([name, version]) => ({
            name, 
            version
        }));
}

test("constructInstallationPlan", {
    "given a herd, returns a plan"() {
        expect(constructInstallationPlan({ 
            "foo": "1.2.3", "bar": "1.0.1",
        }), equals, [{ name: "foo", version:"1.2.3"}, {name: "bar", version:"1.0.1"}]);
    },
})
