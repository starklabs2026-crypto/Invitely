const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Firebase uses both ESM and CJS bundles of @firebase/app and @firebase/component.
// Metro can cache them as separate instances, breaking the shared singleton registry
// that initializeAuth relies on. Force CJS for these two packages so every caller
// gets the same module instance.
const firebaseCjsMap = {
  '@firebase/app': path.resolve(__dirname, 'node_modules/@firebase/app/dist/index.cjs.js'),
  '@firebase/component': path.resolve(__dirname, 'node_modules/@firebase/component/dist/index.cjs.js'),
};

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (firebaseCjsMap[moduleName]) {
    return { filePath: firebaseCjsMap[moduleName], type: 'sourceFile' };
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
