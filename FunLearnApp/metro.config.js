// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add any custom configurations here
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json'];
config.resolver.extraNodeModules = {
  'react-native': __dirname + '/node_modules/react-native',
  'react': __dirname + '/node_modules/react',
};

module.exports = config;