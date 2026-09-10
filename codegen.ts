import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://api.bnp-coorporation.com/graphql",
  documents: ["src/**/*.{ts,tsx}"],
  generates: {
    "schema.graphql": {
      plugins: ["schema-ast"]
    },
    "src/gql/": {
      preset: "client",
      plugins: []
    }
  }
};

export default config;
