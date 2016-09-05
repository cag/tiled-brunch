"use strict";

const fs = require('fs'),
    tmp = require('tmp'),
    {dirname} = require('path'),
    {spawn, spawnSync} = require('child_process'),
    VERSION_RE = /Tiled (\d+\.\d+\.\d+)/;

tmp.setGracefulCleanup();

class TiledPlugin {
    constructor(config) {
        // Get our tiled version
        let tiledProc = spawnSync('tiled', ['-v'], {
            timeout: 10000,
            encoding: 'utf8'
        });

        if(tiledProc.error) throw tiledProc.error;

        let versionMatch = VERSION_RE.exec(tiledProc.stdout + tiledProc.stderr);
        if(versionMatch) {
            this.tiledVersion = versionMatch[1].split('.');
        } else {
            throw Error(`could not get tiled version running [${tiledProc.args}]`);
        }

        // Find out what formats we can export to
        tiledProc = spawnSync('tiled', ['--export-formats'], {
            timeout: 10000,
            encoding: 'utf8'
        });

        if(tiledProc.error) throw tiledProc.error;

        let output = tiledProc.stdout + tiledProc.stderr,
            formatData = output.substring(output.indexOf('Export formats:')),
            formatMap = {},
            formatRe = /"(.*?\.(\w*)\))"/g, match;

        while(match = formatRe.exec(formatData)) {
            formatMap[match[2]] = match[1];
        }
        this.formatMap = formatMap;

        // Tell brunch what we can do
        this.config = config && config.plugins && config.plugins.tiled;
        this.extension = 'tmx';
        this.staticTargetExtension = 'json';
    }

    compileStatic(file) {
        return new Promise((resolve, reject) => {
            tmp.file({
                postfix: `.${this.staticTargetExtension}`,
                dir: dirname(file.path)
            }, (err, path, fd, cleanupCallback) => {
                if(err) {
                    cleanupCallback();
                    return reject(err);
                }

                let tiledProc = spawn('tiled', [
                    '--export-map',
                    this.formatMap[this.staticTargetExtension],
                    file.path,
                    path
                ]);

                tiledProc.on('close', (code) => {
                    if(code === 0) {
                        // Tiled says everything is ok
                        fs.readFile(path, {encoding: 'utf8'}, (err, data) => {
                            if(err) {
                                cleanupCallback();
                                return reject(err);
                            }
                            file.data = data;
                            cleanupCallback();
                            return resolve(file);
                        });
                    } else {
                        cleanupCallback();
                        return reject(Error(`[${tiledProc.args}] exited with error code ${code}`));
                    }
                });
            });
        });
    }
};

TiledPlugin.prototype.brunchPlugin = true;
module.exports = TiledPlugin;
