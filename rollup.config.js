import sass from "rollup-plugin-sass";
import typescript from "rollup-plugin-typescript2";
import babel from "rollup-plugin-babel";
import { uglify } from "rollup-plugin-uglify";

import pkg from "./package.json";

export default {
  input: "src/GraphComponent/react-graph.tsx",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true,
      strict: false,
    },
  ],
  plugins: [sass({ insert: true }), typescript(), babel(), uglify()],
  external: ["react", "react-dom"],
};
