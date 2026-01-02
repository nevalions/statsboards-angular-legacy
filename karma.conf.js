module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chromium-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
        showStack: false, // don't show stack traces
        random: false, // run tests in order
      },
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      captureConsole: false, // suppress console output
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },
    coverageReporter: {
      dir: require("path").join(
        __dirname,
        "./coverage/statsboards-angular-legacy",
      ),
      subdir: ".",
      reporters: [{ type: "html" }, { type: "text-summary" }],
    },
    reporters: ["dots"],
    browsers: ["ChromiumHeadless"],
    restartOnFileChange: true,
    colors: false,
    browserConsoleLogOptions: { level: "", format: "", terminal: false },
    logLevel: config.LOG_ERROR,
    browserDisconnectTimeout: 120000,
    browserNoActivityTimeout: 120000,
    captureTimeout: 120000,
  });
};
