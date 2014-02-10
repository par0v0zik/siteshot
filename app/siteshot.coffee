class SiteShot
  constructor: ->
    @fs = require 'fs'

    # Check for config param in arguments
    if process.argv.indexOf 'config' != -1
      @config()
    else
      @config = require 'siteshot.json'

  # Generate config file
  config: ->
    example =
      snapshotDir: 'snapshots'
      sitemap: 'sitemap.xml'
      opts:
        cutImg: yes
        cutJs: yes
        cutCss: yes
    @fs.writeFileSync 'siteshot.json', JSON.stringify example

module.exports = SiteShot
new SiteShot
