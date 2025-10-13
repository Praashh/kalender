// Ensure Metro resolves a single copy of React/React Native from the app
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const { withNativeWind } = require('nativewind/metro');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.resolver.disableHierarchicalLookup = true;

config.resolver.nodeModulesPaths = [
  path.join(projectRoot, 'node_modules'),
  path.join(workspaceRoot, 'node_modules'),
];

config.resolver.extraNodeModules = {
  react: path.join(projectRoot, 'node_modules/react'),
  'react-dom': path.join(projectRoot, 'node_modules/react-dom'),
  'react-native': path.join(projectRoot, 'node_modules/react-native'),
};

module.exports = withNativeWind(config, {input: './app/global.css'});


