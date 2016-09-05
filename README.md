# [Tiled](http://www.mapeditor.org/) for [Brunch](http://brunch.io/)

Tiled integration for Brunch.

## Get it like this:

    npm install --save-dev tiled-brunch

## Usage

Any TMX files found in your assets folder will be converted into JSON files.

## Configuration

`config.plugins.tiled.tiledBin` (default: `'tiled'`): This is your Tiled executable. By default, assumes that you can invoke Tiled in your shell with `tiled`.

`config.plugins.tiled.targetFormat` (default: `'json'`): This is the target format that will be created by Tiled. Most of the export formats for Tiled don't work. JSON is pretty much it, so I would leave this alone unless you just wrote a Tiled plugin for your own game engine and you are prepared to deal with it or something.

## Note

This will make temporary export files next to your map, as Tiled can't export maps to stdout.
