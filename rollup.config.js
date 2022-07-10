import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';

import glslify from 'rollup-plugin-glslify';

import { terser } from 'rollup-plugin-terser';
import externalGlobals from "rollup-plugin-external-globals";

import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

import pkg from './package.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const header = readFileSync(`${__dirname}/dist/annotations.js`)
                + '\n'
                + readFileSync('header.js', 'utf-8');

export default [
	{
        input: 'src/main.ts',
        output: [
            {
                file: `${__dirname}/dist/js/plugins/${pkg.name}.js`,
                name: pkg.namespace,
                format: 'iife',
                sourcemap: false,
                plugins: [
                    replace({
                        __pluginId__: pkg.name
                    }),
                    terser({
                        format: {
                            comments: false,
                            preamble: header
                        }
                    })
                ]
            },
            {
                file: `${pkg.testProjectDir || `${__dirname}/dist`}/js/plugins/${pkg.name}.debug.js`,
                name: pkg.namespace,
                format: 'iife',
                sourcemap: true,
                banner: header,
                plugins: [
                    replace({
                        __pluginId__: `${pkg.name}.debug`
                    })
                ]
            }
        ],
        plugins: [
            glslify({
                compress: true
            }),
            typescript(),
            externalGlobals({
                "rmmz": "window"
            })            
        ]
	}
];
