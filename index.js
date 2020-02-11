
const { path } = require('@vuepress/shared-utils');

module.exports = (options) => ({
    alias: {
        '@SearchBox':
            path.resolve(__dirname, 'LunrSearch.vue')
    },

    define: {
        SEARCH_MAX_SUGGESTIONS: options.searchMaxSuggestions || 5,
        SEARCH_HOTKEYS: options.searchHotkeys || ['s', '/'],
        DOCUMENTS: options.documents,
        ACTIVATE_STEMMING: options.activateStemming || false,
    }
});
