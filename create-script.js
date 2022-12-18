var child_process = require('child_process')
var modules = require('./' + process.argv[2]).modules;
for (var i = 0; i < modules.length; i++) {
    console.log(child_process.execSync('npm install ' + modules[i].id + '@' + modules[i].version).toString());
    if (process.platform === 'win32') {
        console.log(child_process.execSync('del /S /Q node_modules package.json package-lock.json').toString());
    } else {
        console.log(child_process.execSync('rm -fr node_modules package.json package-lock.json').toString());
    }
}
