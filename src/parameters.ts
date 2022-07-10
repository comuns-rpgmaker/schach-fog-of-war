import { PluginManager } from 'rmmz';

const parameters = PluginManager.parameters('__pluginId__');

console.info('Plugin __pluginId__ started with parameters:', parameters);

const tint = JSON.parse(parameters['fogTint']);

export default {
    playerVisionRange: Number(parameters['playerVisionRange']),
    fogTint: {
        red: Number(tint.red),
        green: Number(tint.green),
        blue: Number(tint.blue)
    },
    fogDispersionTime: Number(parameters['fogDispersionTime']),
};
