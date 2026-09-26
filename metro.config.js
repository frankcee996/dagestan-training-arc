const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Firebase's package.json "exports" field isn't resolved correctly by
// Metro's newer resolver, which breaks firebase/auth in React Native
// (causes "Component auth has not been registered yet"). Disabling
// package-exports resolution fixes it.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
