import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  declaration: "node16",
  externals: ["nitropack"],
  rollup: {
    dts: {
      respectExternal: false,
      compilerOptions: {
        skipLibCheck: true,
      },
    },
  },
});
