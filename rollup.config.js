const typescript = require('@rollup/plugin-typescript');
const { nodeResolve } = require('@rollup/plugin-node-resolve');

module.exports = {
  input: 'src/module/roll-table-importer.ts',
  output: {
    dir: 'dist/roll-table-importer/module',
    format: 'es',
    sourcemap: true,
  },
  plugins: [nodeResolve(), typescript({})],
};
