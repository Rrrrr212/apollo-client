import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "./src/graphql/schema.graphql",
  documents: ["./src/graphql/queries/**/*.ts"],
  ignoreNoDocuments: true,
  hooks: {
    afterAllFileWrite: ["prettier --write"],
  },
  generates: {
    "./src/graphql/generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        avoidOptionals: {
          field: true,
          inputValue: false,
        },
        defaultScalarType: "unknown",
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
        withHooks: true,
        withHOC: false,
        withComponent: false,
        reactApolloVersion: 3,
        apolloClientInstanceImport: "@apollo/client",
      },
    },
  },
};

export default config;
