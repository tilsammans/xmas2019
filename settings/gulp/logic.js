// to use commonjs modules transparently with ES6 imports
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';

// then come the usual dependencies
import { src, dest } from 'gulp';
import { rollup } from 'rollup';
import babel from 'rollup-plugin-babel';
import replace from '@rollup/plugin-replace';
import { eslint } from 'rollup-plugin-eslint';
import { terser } from 'rollup-plugin-terser';
import includePaths from 'rollup-plugin-includepaths';
import { app, src as source, ctx } from '..';

const production = ctx.id === 'production';

const data = {
    ENV: `'${ ctx.id }'`,
    VERSION: `'${ app.version }'`,
    AUTHOR: `'${ app.author }'`,
    DATE: `'${ app.date }'`,
};

let includePathOptions = {
    include: {},
    paths: [source.components, `${ source.logic }/js/`],
    external: []
};

const preamble =
`/* ┌ 𝗯𝘂𝗶𝗹𝗱
 * ├ type: ${ ctx.id }
 * └ date: ${ app.date }
 *  𝘃𝗲𝗿𝘀𝗶𝗼𝗻: ${ app.version }
 *  𝗴𝗲𝗻𝗲𝗿𝗮𝘁𝗼𝗿: Platframe
 *  © ${ app.author } */\n`;

function logic() {

    return rollup({
        input: `${ source.logic }/js/root.js`,
        // nodeArgs: ['--require dotenv/config'],
        plugins: [
            resolve({
                preferBuiltins: true
            }),
            commonjs(),
            builtins(),
            eslint({
                exclude: [
                    `${ source.fonts }/**`,
                    `${ source.images }/**`,
                    `${ source.styles }/**`,
                    `${ source.templates }/**`,
                ],
            }),
            includePaths(includePathOptions),
            replace({
                exclude: 'node_modules/**',
                values: data,
            }),
            babel({
                exclude: 'node_modules/**',
            }),
            (production && terser({
                output: {
                    preamble,
                },
            })),
        ]
    })
        .then(bundle => {
            return bundle.write({
                format: 'iife',
                sourcemap: production ? false : true,
                file: `${ ctx.path.logic }/js/root.js`,
            });
        }) // verbatim copy non-JS logic
        .then(src(`${ source.logic }/**/*.{py,rb,php*}`)
            .pipe(dest(ctx.path.logic))
        );

}

export default logic;
