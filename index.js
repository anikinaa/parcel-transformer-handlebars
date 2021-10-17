const frontMatter = require('front-matter');
const handlebars = require('handlebars');
const handlebarsWax = require('handlebars-wax');
const handlebarsLayouts = require('handlebars-layouts');
const handlebarsHelpersPackage = require('handlebars-helpers');
const { Transformer } = require('@parcel/plugin');

const handlebarsHelpers = handlebarsHelpersPackage();
const { loadUserConfig, parseSimpleLayout } = require('./utils');

const userConfig = loadUserConfig();
const config = Object.assign({}, {
    data: 'src/markup/data',
    decorators: 'src/markup/decorators',
    helpers: 'src/markup/helpers',
    layouts: 'src/markup/layouts',
    partials: 'src/markup/partials',
}, userConfig);


const wax = handlebarsWax(handlebars)
    .helpers(handlebarsLayouts)
    .helpers(handlebarsHelpers)
    .helpers(`${config.helpers}/**/*.js`)
    .data(`${config.data}/**/*.{json,js}`)
    .decorators(`${config.decorators}/**/*.js`)
    .partials(`${config.layouts}/**/*.{hbs,handlebars,js}`)
    .partials(`${config.partials}/**/*.{hbs,handlebars,js}`);

const transformer = new Transformer({
    async transform({asset}) {

        const code = await asset.getCode();
        const frontmatter = frontMatter(code);
        const content = parseSimpleLayout(frontmatter.body, config);
        const data = Object.assign({}, frontmatter.attributes, { NODE_ENV: process.env.NODE_ENV });
        const html = wax.compile(content)(data);

        asset.type = 'html';
        asset.setCode(html);

        return [asset];
    }
});

module.exports = transformer;
