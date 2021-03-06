const fs = require('fs');
const path = require('path');

function BuildManifestPlugin () {

};

BuildManifestPlugin.prototype.apply = function (compiler) {
  compiler.plugin('emit', (compiler, callback) => {
    let stats = compiler.getStats();
    let manifest = JSON.stringify(stats.toJson().assetsByChunkName);

    compiler.assets['manifest.json'] = {

      source: function () {
        return manifest
      },

      size: function () {
        return manifest.length;
      }
      
    };

    callback();
  })
};



module.exports = BuildManifestPlugin;
