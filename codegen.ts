import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:8090/graphql",
  generates: {
    "./src/interfaces/api/generated.ts": {
      plugins: ["typescript"],
    },
  },
};

export default config;
