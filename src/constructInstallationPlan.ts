import { test, expect, equals } from "@benchristel/taste";
import { match, stub } from "sinon";
import { isArray } from "util";


export type InstallationPlan = DependencyInstallation[];
type Version = `${number}.${number}.${number}`;
interface Dependency { name: string; version: Version; }
export type Herd = Record<string, Version>;
export interface DependencyInstallation extends Dependency {
    parentDirectory?: string;
}

export async function constructInstallationPlan(
    topLevelDependencies: Herd): Promise<InstallationPlan> {
    const currentPlan = planetize(topLevelDependencies);
    return currentPlan.reduce<InstallationPlan>(spreadInstallation, currentPlan);
}

export const spreadInstallation = async (memo: InstallationPlan, { name, version }: DependencyInstallation): Promise<InstallationPlan> => {
    const response = await fetch(registryPath(name, version));
    if (!response) { return memo; }

    const { dependencies }: { dependencies: Herd } = await response.json()
    return [
        ...await memo,
        ...await constructInstallationPlan(dependencies)
    ]
};

export function planetize(topLevelDependencies: Herd): InstallationPlan {
    return Object
        .entries(topLevelDependencies)
        .map(([name, version]) => ({
            name,
            version,
            parentDirectory: "node_modules"
        }));
}

export function registryPath(name: string, version: string): string | URL | Request {
    return `https://registry.npmjs.org/${name}@${version}`;
}

test("constructInstallationPlan", {
    // async "by default, assigns dependencies to node_modules"() {
    //     stubFetch({ dependencies: {} });

    //     expect(await constructInstallationPlan({
    //         "strawberry": "1.2.3", "mango": "1.0.1",
    //     }), equals, [
    //         { name: "strawberry", version: "1.2.3", parentDirectory: "node_modules" },
    //         { name: "mango", version: "1.0.1", parentDirectory: "node_modules" }
    //     ]);
    // },
    // async "given a depency with dependencies, adds their deps to the plan"() {
    //     stubFetch();

    //     expect(await constructInstallationPlan({
    //         "parent": "1.2.3",
    //     }), equals, [
    //         { name: "parent", version: "1.2.3", parentDirectory: "node_modules" },
    //         { name: "child", version: "1.0.1", parentDirectory: "node_modules" }
    //     ]);
    // },
    async "given a dependency tree at least two levels deep, adds their deps to the plan"() {
        const parentMatcher = match((url) => url.includes('parent'));
        const childMatcher = match((url) => url.includes('child'));

        const fetchStub = stub<any, any>(global, 'fetch');
        fetchStub.withArgs(parentMatcher).resolves({
            json: () => Promise.resolve({ dependencies: { "child": "1.0.1" } })
        });

        fetchStub.withArgs(childMatcher).resolves({
            json: () => Promise.resolve({ dependencies: { "grandkid": "4.0.4" } })
        });

        expect(await constructInstallationPlan({
            "parent": "1.2.3"
        }), equals, [
            { name: "parent", version: "1.2.3", parentDirectory: "node_modules" },
            { name: "child", version: "1.0.1", parentDirectory: "node_modules" },
            { name: "grandkid", version: "4.0.4", parentDirectory: "node_modules" },
        ]);
    },
});

// test("spreadInstallation", {
//     async "fetches the dependencies of a dependency installation, and merges them into a plan"() {
//         stubFetch()

//         expect(await spreadInstallation([], { name: "qux", version: "0.4.2" }), equals, [{
//             name: "child",
//             version: "1.0.1",
//             parentDirectory: "node_modules"
//         }])
//     }
// })

export function stubFetch(json?) {
    // @ts-expect-error
    global.fetch = (input, init) => new Promise(resolve => resolve(new Response(JSON.stringify(json || {
        dependencies: { "child": "1.0.1" }
    }))));
}