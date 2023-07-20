module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            src: "./src",
            features: "./src/features",
            components: "./src/components",
            hooks: "./src/hooks",
            utils: "./src/utils",
            api: "./src/api",
            assets: "./src/assets",
            app: "./src/app",
            layouts: "./src/layouts",
          },
        },
      ],
    ],
  };
};
