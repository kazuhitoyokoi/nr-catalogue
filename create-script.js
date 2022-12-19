var child_process = require('child_process');
var fs = require('fs');
var modules = require('./' + process.argv[2]).modules;
var newModules = [];
for (var i = 0; i < modules.length; i++) {
    var filename = './' + process.platform + '/' + modules[i].id.replaceAll('/', '_')+ '@' + modules[i].version;
    var cmd = 'npm install ' + modules[i].id + '@' + modules[i].version;
    console.log(cmd);
    try {
        child_process.execSync(cmd);
        newModules.push(modules[i]);
        if (process.platform === 'win32') {
            child_process.execSync('del /S /Q node_modules package.json package-lock.json');
        } else {
            child_process.execSync('rm -fr node_modules package.json package-lock.json');
        }
        fs.writeFileSync(filename, modules[i]);
        child_process.execSync('git add ' + filename);
        child_process.execSync('git commit -m "Update cache"');
        child_process.execSync('git push');
    } catch (e) { console.log(e); }
}
console.log(newModules);
