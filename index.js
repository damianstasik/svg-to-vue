const SVGO = require('svgo');
const { compile } = require('vue-template-compiler');

const transformChildren = (value) => {
  const chilldren = value.reduce((acc, child) => {
    if (child.text) {
      acc.push(`_v('${child.text}')`);
    } else {
      const args = [`'${child.tag}'`];

      if (Object.keys(child.attrsMap).length) {
        const data = [];

        if (child.staticClass) {
          data.push(`staticClass:${child.staticClass}`);
        }

        if (child.staticStyle) {
          data.push(`staticStyle:${child.staticStyle}`);
        }

        if (child.attrsList.length) {
          const attrs = child.attrsList.reduce((v, attr) => ({
            ...v,
            [attr.name]: attr.value,
          }), {});

          data.push(`attrs:${JSON.stringify(attrs)}`);
        }

        if (data.length) {
          args.push(`{${data.join()}}`);
        }
      }

      if (child.children.length) {
        args.push(transformChildren(child.children));
      }

      acc.push(`_c(${args.join()})`);
    }

    return acc;
  }, []);

  return `[${chilldren.join()}]`;
};

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
    const { ast } = compile(result, {
      preserveWhitespace: false,
    });

    return `
      export default {
        functional: true,
        render(_h, _vm) {
          const { _c, _v, data } = _vm;

          const {
            class: classNames,
            staticClass,
            style,
            staticStyle,
            attrs = {},
            ...rest
          } = data;

          return _c(
            'svg',
            {
              class: [${ast.staticClass}, classNames, staticClass],
              style: [${ast.staticStyle}, style, staticStyle],
              attrs: Object.assign(${JSON.stringify(ast.attrsMap)}, attrs),
              ...rest,
            },
            ${transformChildren(ast.children)}
          )
        }
      }
    `;
  });
};
