# ModDota template

A template for Dota 2 Custom Games built with modern technologies.

[This tutorial](https://moddota.com/scripting/Typescript/typescript-introduction/) explains how to set up and use the template.

The template includes:

- [TypeScript for Panorama](https://moddota.com/panorama/introduction-to-panorama-ui-with-typescript)
- [TypeScript for VScripts](https://typescripttolua.github.io/)
- Simple commands to build and launch your custom game
- [Continuous Integration](#continuous-integration) support

## Getting Started

1. Clone this repository or, if you're planning to have a repository for your custom game on GitHub, [create a new repository from this template](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template) and clone it instead.
2. Open the directory of your custom game and change `name` field in `package.json` file to the name of your addon name.
3. Open terminal in that directory and run `npm install` to install dependencies. You also should run `npm update` once in a while to get tool updates.

After that you can press `Ctrl+Shift+B` in VSCode or run `npm run dev` command in terminal to compile your code and watch for changes.

## Contents:

* **[src/common]:** TypeScript .d.ts type declaration files with types that can be shared between Panorama and VScripts
* **[src/vscripts]:** TypeScript code for Dota addon (Lua) vscripts. Compiles lua to game/scripts/vscripts.
* **[src/panorama]:** TypeScript code for panorama UI. Compiles js to content/panorama/scripts/custom_game

--

* **[game/*]:** Dota game directory containing files such as npc kv files and compiled lua scripts.
* **[content/*]:** Dota content directory containing panorama sources other than scripts (xml, css, compiled js)

--

* **[scripts/*]:** Repository installation scripts

## Gotchas

### Stale Lua Files

- Watch out for stale lua files under `game/`. If you're in `src/vscripts/a.ts`,
and you `require("b")`, the TS compiler will copy over `b.lua` to
`game/scripts/vscripts/b.lua`. That file won't be tracked by git, and it won't
be obvious that it's still there. You might comment out that `require("b")` line
in `a.ts`, expecting that `b.lua` won't be loaded. However, that file is still
under `game/`, and dota will load it just fine. Make sure to delete `b.lua`
under `game/` if you don't want it to load.

## Continuous Integration

This template includes a [GitHub Actions](https://github.com/features/actions) [workflow](.github/workflows/ci.yml) that builds your custom game on every commit and fails when there are type errors.
