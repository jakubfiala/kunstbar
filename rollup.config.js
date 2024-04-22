import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const plugins = [nodeResolve()];

if (process.env.NODE_ENV !== 'dev') {
  plugins.push(terser());
}

export default {
  input: 'index.js',
  output: {
    dir: 'dist',
  },
  plugins,
};
