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
      preserveWhitespace: false,
      modules: [
        {
          transformNode: (el) => {
            if (el.tag === 'svg') {
              el.classBinding = '[data.class, data.staticClass]';
              el.styleBinding = '[data.style, data.staticStyle]';
            }
          },
        },
      ],
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
      export default {
        functional: true,
        render: ${renderFunction}
      }
    `;
  });
};
