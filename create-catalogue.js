var child_process = require('child_process');
var fs = require('fs-extra')
var modules = require('./' + process.argv[2]).modules;
var newModules = [];
for (var i = 0; i < modules.length; i++) {
    var filename = './' + process.platform + '/' + modules[i].id.replaceAll('/', '_')+ '@' + modules[i].version;
    if(fs.existsSync(filename)){
        newModules.push(modules[i]);
    } else {
        var cmd = 'npm install ' + modules[i].id + '@' + modules[i].version;
        console.log(cmd);
        try {
            var spawn = child_process.spawnSync(cmd, { shell: true });
            fs.removeSync('node_modules');
            fs.removeSync('package.json');
            fs.removeSync('package-lock.json');
            fs.writeFileSync(filename, spawn.stderr.toString() + '\n----\n' + spawn.stdout.toString());
            child_process.execSync('git add ' + filename);
            child_process.execSync('git commit -m "Update cache"');
            child_process.execSync('git push');
            newModules.push(modules[i]);
        } catch (e) { console.log(e); }
    }
}
console.log(newModules);
