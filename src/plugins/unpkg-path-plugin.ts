import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
  //ESBuild plugin
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      //onResolve will be called whenever ESBuild tries to figure out a path to a module
      //handle root entry file of 'index.js'
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: 'index.js', namespace: 'a' };
      });
      //handle relative paths in a module
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: 'a',
          path: new URL(
            args.path,
            'https://unpkg.com' + args.resolveDir + '/' //for nested packages
          ).href,
        };
      });
      //handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        };
      });
    },
  };
};
