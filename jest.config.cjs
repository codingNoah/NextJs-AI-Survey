/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
        isolatedModules: true,
        useESM: true,
      },
    ],
  },
  // 👇 Allow these ESM packages to be transformed
  transformIgnorePatterns: [
    "node_modules/(?!(@auth/prisma-adapter|next-auth|openai|@vercel|nanoid)/)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
};
