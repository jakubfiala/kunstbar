import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'index.js',
  output: {
    dir: 'dist',
  },
  plugins: [nodeResolve(), terser()],
};
