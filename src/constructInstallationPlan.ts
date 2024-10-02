import { test, expect, equals } from "@benchristel/taste";
import { Herd, InstallationPlan, spreadInstallation } from "./install";

export async function constructInstallationPlan(
    topLevelDependencies: Herd): Promise<InstallationPlan> {
    const currentPlan = planetize(topLevelDependencies);
    return currentPlan.reduce<InstallationPlan>(spreadInstallation, currentPlan);

    // return await currentPlan.reduce(async (plan, {name, version}) => {
    //     JSON.stringify(await fetch(registryPath(name, version)))
    //     return plan
    // }, currentPlan);
}

test("constructInstallationPlan", {
    async "by default, assigns dependencies to node_modules"() {
        stubFetch({ dependencies: {} as Herd });

        expect(await constructInstallationPlan({
            "foo": "1.2.3", "bar": "1.0.1",
        }), equals, [
            { name: "foo", version: "1.2.3", parentDirectory: "node_modules" },
            { name: "bar", version: "1.0.1", parentDirectory: "node_modules" }
        ]);
    },
    async "given a depency with dependencies, adds their deps to the plan"() {
        stubFetch();

        expect(await constructInstallationPlan({
            "parent": "1.2.3",
        }), equals, [
            { name: "parent", version: "1.2.3", parentDirectory: "node_modules" },
            { name: "child", version: "1.0.1", parentDirectory: "node_modules" }
        ]);
    },
});

export function planetize(topLevelDependencies: Herd): InstallationPlan {
    return Object
        .entries(topLevelDependencies)
        .map(([name, version]) => ({
            name,
            version,
            parentDirectory: "node_modules"
        }));
}

export function stubFetch(json?) {
    // @ts-expect-error
    global.fetch = (input, init) => new Promise(resolve => resolve(new Response(JSON.stringify(json || {
        dependencies: { "child": "1.0.1" }
    }))));
}

export function registryPath(name: string, version: string): string | URL | Request {
    return `https://registry.npmjs.org/${name}@${version}`;
}
