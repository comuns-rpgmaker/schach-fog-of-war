# Schach - Fog of war

This plugin creates a "fog of war" effect on annotated maps.

To enable the effect on a map, add the following tag to the map's notes:

```
[FoW]
```

By default, the player is the only source of "light" that clears the fog.

Events may be annotated to clear the fog, too, by adding the following comment on their command list (once per page;
different pages may have different ranges):

```
[FoW light source (range = N)]
```

Where "N" should be replaced by the radius of the light in tiles.

# Installation

The [Releases](https://github.com/comuns-rpgmaker/schach-fog-of-war/releases) page contains downloadable `.js` files for the plugin.

Refer to the [official plugin installation guide](https://www.rpgmakerweb.com/blog/using-plugins-in-mz) for further information.

## Building from source

This plugin is built with [Node](https://nodejs.org/en/), so make sure you have it installed before continuing.

To build the project, run:

    npm ci
    npm run build

This will output a file named `schach-fog-of-war.js` on the `dist/js/plugins`
directory and a file named `schach-fog-of-war.debug.js` on `../../js/plugins`.
The relative path is intenteded to be used such that you can clone the plugin
repository into the `js` folder of a RMMZ project and test it easily.

We recommend using [VS Code](https://code.visualstudio.com/) to build and edit
sources, and ready-made settings for building and debugging the
plugin on it are provided. 

## License

See [LICENSE](./LICENSE).
