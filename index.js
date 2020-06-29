const SVGO = require('svgo');
const { parseComponent } = require('vue-template-compiler');

module.exports = (content, options = {}) => {
  const {
    svgoConfig = {},
    svgoPath = null,
  } = options;

  let svg = Promise.resolve(content);

  if (svgoConfig !== false) {
    svg = new SVGO(svgoConfig)
      .optimize(content, { path: svgoPath })
      .then((result) => result.data);
  }

  return svg.then((result) => {
    return parseComponent('<template functional>' + file.replace('<svg', '<svg v-bind="data.attrs" :class="data.staticClass" :style="data.staticStyle"') + '</template>', options);
  });
};
