<h1 align="center">svg-to-vue</h1>
<p align="center">Utility to convert SVG code into Vue component definition</p>

## Instalation
``` bash
npm i svg-to-vue

yarn add svg-to-vue
```

## Usage
``` js
const svgToVue = require('svg-to-vue');

const svg = `
  <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="red" />
  </svg>
`;

svgToVue(svg)
  .then((component) => {
    // `component` contains Vue component definition
    console.log(component);
  });
```
