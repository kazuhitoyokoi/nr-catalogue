var child_process = require('child_process');
var path = require('path');
var fs = require('fs-extra');

var platform = process.argv[3] || process.platform;
try { fs.mkdirSync(platform); } catch (e) {}
var modules = JSON.parse(fs.readFileSync(process.argv[2])).modules;
var newModules = [];

for (var i = 0; i < modules.length; i++) {
    var filename = path.join(platform, modules[i].id.replaceAll('/', '_')+ '@' + modules[i].version);
    if(fs.existsSync(filename)){
        newModules.push(modules[i]);
    } else {
        var cmd = 'npm install ' + modules[i].id + '@' + modules[i].version;
        console.log(cmd);
        try {
            var spawn;
            if (platform === 'docker') {
                fs.writeFileSync('Dockerfile', 'FROM nodered/node-red\nRUN npm install ' + cmd);
                spawn = child_process.spawnSync('docker build -t tmp .', { shell: true });
                child_process.spawnSync('docker rmi tmp', { shell: true });
            } else {
                fs.mkdirSync('tmp');
                spawn = child_process.spawnSync(cmd, { cwd: 'tmp', shell: true });
                fs.removeSync('tmp');
            }
            if (spawn.status == 0) {
                fs.writeFileSync(filename, spawn.stderr.toString() + '\n----\n' + spawn.stdout.toString());
                child_process.execSync('git add ' + filename);
                child_process.execSync('git commit -m "Update cache"');
                child_process.execSync('git push');
                newModules.push(modules[i]);
            }
        } catch (e) { console.log(e); }
    }
}

var catalogue = JSON.stringify({
    name: "Catalogue for " + platform,
    updated_at: new Date(),
    modules: newModules
}, null, 2);
try { fs.mkdirSync('docs'); } catch (e) {}
fs.writeFileSync(path.join('docs', process.platform + '.json'), catalogue);
