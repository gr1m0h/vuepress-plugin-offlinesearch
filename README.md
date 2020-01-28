# Vuepress-plugin-offlinesearch

This plugin extends the regular vuepress-search-plugin with functionality to search through all published md files.  

## Usage

* Add the plugin as dependency:  

`npm i @datev_eg/vuepress-plugin-offlinesearch`

* Add plugin to .vuepress/config.js  

Here you can choose with the parameter searchMaxSuggestions how many searchResults will be shown in the drop down field. default: 5

```,
    plugins: [
        ['@datev_eg/vuepress-plugin-offlinesearch', {searchMaxSuggestions: 7, documents: require('../.vuepress/public/documents.json')}]
    ],
```

* Provide required documents.json in .vuepress/public/document.json  

The plugin require following json structure to build it's index. The json can be either generated
by your own generator, by hand or by using our [npm-cli tool](https://gitlab.com/datev/vuepress-documents-parser-cli) 

If you choose to use the vuepress-documents-parser-cli, generating the documents.json file is as simple as
installing the package with 

`npm i @datev_eg/vuepress-plugin-offlinesearch`

running

`npm link`

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







