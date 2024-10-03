# CPM

Custom Package Manager

## Usage

### `$ cpm add`

Given a package name, installs the package to `node_modules`, and  adds it as a dev dependency to your `package.json`.

```BASH
cpm add <package> [version] [--dev]
```

### `$ cpm install`

Installs all packages in `package.json`, and their entire tree of dependencies.

```BASH
cpm install
```

## Development

### `$ pnpm test`

Runs the `@benchristel/taste` tests.

### `$ pnpm build` 

Compiles the project into an executable.