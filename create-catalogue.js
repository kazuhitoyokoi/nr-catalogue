var child_process = require('child_process');
var modules = require('./' + process.argv[2]).modules;
var newModules = [];
var fs = require('fs-extra');
fs.mkdirSync('./tmp');

for (var i = 0; i < modules.length; i++) {
    var filename = './' + process.platform + '/' + modules[i].id.replaceAll('/', '_')+ '@' + modules[i].version;
    if(fs.existsSync(filename)){
        newModules.push(modules[i]);
    } else {
        var cmd = 'npm install ' + modules[i].id + '@' + modules[i].version;
        console.log(cmd);
        try {
            var spawn = child_process.spawnSync(cmd, { cwd: './tmp', shell: true });
            fs.removeSync('./tmp/node_modules');
            fs.removeSync('./tmp/package.json');
            fs.removeSync('./tmp/package-lock.json');
            fs.writeFileSync(filename, spawn.stderr.toString() + '\n----\n' + spawn.stdout.toString());
            child_process.execSync('git add ' + filename);
            child_process.execSync('git commit -m "Update cache"');
            child_process.execSync('git push');
            newModules.push(modules[i]);
        } catch (e) { console.log(e); }
    }
}

console.log(JSON.strigify({
    name: "Catalogue for " + process.platform,
    updated_at: new Date(),
    modules: newModules
}, null, 4));
