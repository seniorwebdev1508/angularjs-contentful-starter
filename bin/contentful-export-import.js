/**
 * Node.js script which exports the 'Sample' Contentful space and uploads it into the users specified space.
 * @author Josh Hebb
 */

var prompt = require('prompt');
var spaceExport = require('contentful-export');
var spaceImport = require('contentful-import');
var updateJson = require('update-json');

// Contentful Export & Import Options
var options = {
  spaceId: 'hpty8kufn7nl',
  managementToken: '8fa7f1194e1440f869e193c2cab5e8da3e009f242046785b86f9aa054dfff744',
  saveFile: false,
  maxAllowedItems: 100
}

// Package JSON relative path.
var filePath = './package.json';

// Contentful options parameter definitions.
var schema = {
  properties: {
    // Contentful Space ID
    spaceId: {
      required: true
    },
    // Contentful Token
    managementToken: {
      required: true
    }
  }
};

// Configuration data that we'll inject into package.json
var data = { 
  config: {
    contentfulConfigurations: {
      spaceId: options.spaceId,
      managementToken: options.managementToken
    }
  }
}


prompt.start();
console.log("Starting the Contentful Export & Import Process..");
console.log("Please enter your Contentful Space ID & Management Token.");
console.log("You can find those values in Contentful under your space.");
console.log("---------------------------------------------------------");

// Get two properties from the user: username and email 
prompt.get(schema, function (err, result) {
  spaceExport(options)
    .then((output) => {

      // Update the options with the output JSON from the export and the user input spaceId & management token.
      options.content = output;
      options.spaceId = result.spaceId;
      options.managementToken = result.managementToken;

      spaceImport(options)
        .then((output) => {
          console.log('Data Imported successfully');
          updateJson(filePath, data, function (error) {
            if (error) {
              console.log("An error occurred updating package.json: " + err);
            }
          });
        })
        .catch((err) => {
          console.log('Something went wrong with the import: ', err)
        })
    })
    .catch((err) => {
      console.log('Uh oh! Something went wrong: ', err)
    })
});
