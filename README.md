# Vuepress-plugin-offlinesearch
The search is based on the [official vuepress search plugin](https://vuepress.vuejs.org/plugin/official/plugin-search.html).
But instead of just indexing headers, it leverages [lunrjs](https://lunrjs.com/) to enable a (simplistic) full-text search.
Although the [Algolia](https://vuepress.vuejs.org/theme/default-theme-config.html#algolia-docsearch) search is great, it may not be an option for teams sitting behind a corporate firewall.

For each search result, the page title and the title of the section, where the text was found, are displayed. The links take you right to that section.

## Demo
We created a sample project that showcases the search. Check it out here: https://datev.gitlab.io/vuepress-plugin-offlinesearch-example/

## Usage

* Add the plugin as dependency:  

``` sh
npm i @datev/vuepress-plugin-offlinesearch
```

* Add the plugin to `.vuepress/config.js`

``` javascript
    ,
    plugins: [
        ['@datev/vuepress-plugin-offlinesearch', {searchMaxSuggestions: 7, documents: require('../.vuepress/public/documents.json')}]
    ],
```

### Options
####  `searchMaxSuggestions` 
Defines the maximum number of search results displayed.
* Type: `number`
* Default: 5
Disclaimer: taken form [here](https://vuepress.vuejs.org/plugin/official/plugin-search.html#searchmaxsuggestions)

#### `searchHotkeys`
* Configure the hotkeys which when pressed will focus the search box. Set to an empty array to disable this feature.
* Type: `Array<string>`
* Default: ['s', '/']`
Disclaimer: taken form [here](https://vuepress.vuejs.org/plugin/official/plugin-search.html#searchhotkeys)

#### `activateStemming`
* Activates lunr's stemming feature. In our experience, the search works better when this option is disabled.
Please refer to the [official docs](https://lunrjs.com/guides/core_concepts.html#stemming) for more information on stemming.
* Type: `boolean`
* Default: `false`

#### `documents`
* Path to your documents file, e.g. `'../.vuepress/public/documents.json'`. Note that the file needs to be [deployed as an asset](https://v1.vuepress.vuejs.org/guide/assets.html).
* Type: `string`
* required

The plugin requires the following json structure to build its index. The json can be either generated
by your own generator, by hand or by using our [npm-cli tool](https://gitlab.com/datev/vuepress-documents-parser-cli) 

If you choose to use the vuepress-documents-parser-cli, generating the documents.json file is as simple as
installing the package with 
``` sh
npm i @datev/vuepress-offlinesearch-parse-cli
```

and executing the command `generate-documents` from your command line.

If you choose to build your own documents.json file, please comply with following json structure:

```json
[
  {
    "pageTitle": "exampleTitle",
    "sectionHeader": "ExampleHeader",
    "sectionSlug": "/exampleSite.html#exampleSection",
    "sectionContent": "This is example Content"
  }
]
```

Note that the sectionHeader and sectionContent are the field that will later be used to match search queries.

After these steps the search for your vuepress Site should be set up and ready to go.  

## Contributing 

Contributions are welcome !

 
If you want to contribute or have a question please just open a new Issue.





