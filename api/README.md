# Portal API

## Development

Example launch.json to be used in Visual Studio Code for debugging:

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch API",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "runtimeExecutable": "npm",
      "runtimeArgs": [
        "run",
        "start"
      ],
      "cwd": "${workspaceRoot}/api",
      "console": "internalConsole",
      "outputCapture": "std"
    }
  ]
}
```

## Troubleshooting

### ARM M1 Mac

`argon2` may throw the following error when you attempt to install packages:

```sh
Error: dlopen(/Users/hugo/code/github.com/identifee/portal/api/node_modules/argon2/lib/binding/napi-v3/argon2.node, 0x0001): tried: '/Users/hugo/code/github.com/identifee/portal/api/node_modules/argon2/lib/binding/napi-v3/argon2.node' (mach-o file, but is an incompatible architecture (have 'arm64', need 'x86_64')), '/usr/local/lib/argon2.node' (no such file), '/usr/lib/argon2.node' (no such file)
    at Object.Module._extensions..node (internal/modules/cjs/loader.js:1057:18)
    at Module.load (internal/modules/cjs/loader.js:863:32)
    at Function.Module._load (internal/modules/cjs/loader.js:708:14)
    at Module.require (internal/modules/cjs/loader.js:887:19)
    at require (internal/modules/cjs/helpers.js:74:18)
    at Object.<anonymous> (/Users/hugo/code/github.com/identifee/portal/api/node_modules/argon2/argon2.js:9:56)
    at Module._compile (internal/modules/cjs/loader.js:999:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1027:10)
    at Module.load (internal/modules/cjs/loader.js:863:32)
    at Function.Module._load (internal/modules/cjs/loader.js:708:14)
```

To resolve this, run the following:

```sh
brew install gcc
npm rebuild argon2 --build-from-source

# continue with install and build
npm i
npm run build
```

See this issue for more details: https://github.com/ranisalt/node-argon2/issues/305
