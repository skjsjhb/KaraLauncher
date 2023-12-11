const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');
const config = {
    transform: {
        '^.+\\.[tj]sx?$': 'esbuild-jest',
        '^.+\\.ya?ml$': 'jest-transform-yaml',
        '^.+\\.toml$': './toml-transformer'
    },
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>' })
};

module.exports = config;
