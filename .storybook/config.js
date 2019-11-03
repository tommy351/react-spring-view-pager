import { configure, addParameters } from "@storybook/react";
import { themes } from "@storybook/theming";

addParameters({
  options: {
    theme: themes.dark
  }
});

configure(require.context("../stories", true, /\.tsx?$/), module);
