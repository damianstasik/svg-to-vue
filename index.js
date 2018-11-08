const SVGO = require('svgo');
const { compile } = require('vue-template-compiler');
const stripWith = require('vue-template-es2015-compiler');

module.exports = (content, options = {}) => {
  const {
    svgoConfig = {},
    svgoPath = null,
  } = options;

  let svg = Promise.resolve(content);

  if (svgoConfig !== false) {
    svg = new SVGO(svgoConfig)
      .optimize(content, { path: svgoPath })
      .then(result => result.data);
  }

  return svg.then((result) => {
    let { render: renderFunction } = compile(result, {
      preserveWhitespace: false
    });

    renderFunction = `
      function render(_h, _vm) {
        ${renderFunction}
      }
    `;

    renderFunction = stripWith(renderFunction, {
      transforms: {
        stripWithFunctional: true,
      },
    });

    return `
      import {mergeData} from 'vue-functional-data-merge';
    
      function createRender(realRender) {
        return function render(_h1, _vm) {
          function _h(tag, data, children) { return _h1(tag, mergeData(data, _vm.data), children); }
          return realRender(_h, _vm);
        }
      }
    
      export default {
        functional: true,
        render: createRender(${renderFunction})
      }
    `;
  });
};
