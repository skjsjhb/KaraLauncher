const toml = require('toml');
module.exports = {
    process(sourceText, sourcePath, options) {
        return {
            code: `module.exports = ${JSON.stringify(toml.parse(sourceText))};`
        };
    }
};
