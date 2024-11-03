// config-overrides.js
const { override, addBabelPlugin } = require("customize-cra");

module.exports = override(
  addBabelPlugin("@babel/plugin-proposal-private-property-in-object")
);
