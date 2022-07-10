import { PluginManager } from 'rmmz';

import { Game_System } from 'patch/game/system';

declare const $gameSystem: Game_System;

PluginManager.registerCommand('__pluginId__', "setPlayerVisionRange", args => {
    $gameSystem.setPlayerVisionRange(Number(args.range));
});

PluginManager.registerCommand('__pluginId__', "setFogTint", args => {
    const tint = JSON.parse(args.tint);
    const red = Number(tint.red),
        green = Number(tint.green),
        blue = Number(tint.blue);
    $gameSystem.setFogTint(red, green, blue);
});

PluginManager.registerCommand('__pluginId__', "setFogDispersionTime", args => {
    $gameSystem.setFogDispersionTime(Number(args.time));
});
