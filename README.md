# Dota 2 HUDs
View a live demo of any Dota 2 HUD.

## Commands
* `yarn build` - Builds a static website into the `/dist` directory.
* `yarn docker-build` - Builds a Docker image for the application.
* `yarn optimize` - Compresses all PNGs in `/src/hud_skins`.

## Tech Stack
* `Docker` - Used to containerize and deploy the application.
* `JavaScript` - Used to live-render changes in selected HUDs.
* `nginx` - Used as a static file server.
* `node` - Used to generate the static files.
* `yarn` - Used for shorthand commands.

## HUD Skins
Dota 2 HUD skins can be found in `C:\Program Files (x86)\Steam\steamapps\common\dota 2 beta\game\dota\` in the `pako1_*.vpk` files under `root\resource\flash3\images\hud_skins\`.
