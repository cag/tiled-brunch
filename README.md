# Tiled for Brunch

Tiled integration for Brunch.

## Get it like this:

    npm install --save-dev tiled-brunch

## Configuration

`config.plugins.tiled.tiledBin` (default: `'tiled'`): This is your Tiled executable. By default, assumes that you can invoke Tiled in your shell with `tiled`.

`config.plugins.tiled.targetFormat` (default: `'json'`): This is the target format that will be created by Tiled. Most of the export formats for Tiled don't work. JSON is pretty much it, so I would leave this alone.

## Warning

This is really early software. Brunch makes lots of tempfile copies while this is operating because Tiled can't export to stdout as of the time of this writing, and the files that are created use paths that are relative to the assets referred to by the original tmx files.
