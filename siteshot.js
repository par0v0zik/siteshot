#!/usr/bin/env node
// Generated by CoffeeScript 1.9.3
(function() {
  var SiteShot, _, async, fs, mkdirp, parseString, path, phantom, url;

  fs = require('fs');

  url = require('url');

  path = require('path');

  _ = require('lodash');

  parseString = require('xml2js').parseString;

  phantom = require('phantom');

  async = require('async');

  mkdirp = require('mkdirp');

  SiteShot = (function() {
    function SiteShot() {
      var config;
      if (process.argv.indexOf('config') !== -1) {
        this.config();
      } else {
        config = require((process.cwd()) + "/config.js");
        parseString(fs.readFileSync(config.sitemap), (function(_this) {
          return function(err, result) {
            var routes;
            if (err != null) {
              throw err;
            } else {
              routes = _.flatten(_.pluck(result.urlset.url, 'loc'));
              return phantom.create(function(ph) {
                var pageLoad;
                pageLoad = function(route, callback) {
                  return ph.createPage(function(page) {
                    return page.open(route, function(status) {
                      if (status === 'success') {
                        return setTimeout((function() {
                          var generateHTML;
                          generateHTML = function() {
                            return page.evaluate((function() {
                              return document.documentElement.outerHTML;
                            }), (function(_this) {
                              return function(res) {
                                var snapPath, snapPrefix;
                                snapPrefix = url.parse(route).path === '/' ? '/index' : url.parse(route).path;
                                snapPath = "" + config.snapshotDir + snapPrefix + ".html";
                                return mkdirp(path.dirname(snapPath), function(err) {
                                  if (err != null) {
                                    throw err;
                                  }
                                  return fs.writeFile(snapPath, res, function(err) {
                                    if (err != null) {
                                      throw err;
                                    }
                                    page.close();
                                    console.log("Finish loading " + route + " and save it in " + snapPath);
                                    return callback();
                                  });
                                });
                              };
                            })(this));
                          };
                          if (typeof config.pageModifier === 'function') {
                            return config.pageModifier(page, function() {
                              return generateHTML();
                            });
                          } else {
                            return generateHTML();
                          }
                        }), config.delay || 0);
                      }
                    });
                  });
                };
                return async.eachSeries(routes, pageLoad, function(err) {
                  if (err != null) {
                    throw err;
                  }
                  console.log('----------------------------');
                  console.log('Finish snapshots');
                  return ph.exit();
                });
              });
            }
          };
        })(this));
      }
    }

    SiteShot.prototype.config = function() {
      var example;
      example = {
        snapshotDir: (process.cwd()) + "/snapshots",
        sitemap: (process.cwd()) + "/sitemap.xml",
        delay: 500,
        pageModifier: null
      };
      return fs.writeFileSync('config.js', JSON.stringify(example, null, 2));
    };

    return SiteShot;

  })();

  module.exports = SiteShot;

  new SiteShot;

}).call(this);