var child_process = require('child_process')
var modules = require('./' + process.argv[2]).modules;
var newModules = [];
for (var i = 0; i < modules.length; i++) {
    try {
        var cmd = 'npm install ' + modules[i].id + '@' + modules[i].version;
        console.log(cmd);
        child_process.execSync(cmd);
        newModudles.push(modules[i]);
        if (process.platform === 'win32') {
            child_process.execSync('del /S /Q node_modules package.json package-lock.json');
        } else {
            child_process.execSync('rm -fr node_modules package.json package-lock.json');
        }
    } catch (e) {}
}
console.log(newModules);
