var child_process = require('child_process')
var modules = require('./' + process.argv[2]).modules;
for (var i = 0; i < modules.length; i++) {
    var cmd = 'npm install ' + modules[i].id + '@' + modules[i].version;
    console.log(cmd);
    try {
        console.log(child_process.execSync(cmd).toString());
    } catch (e) {
        console.log(e);
    }

    if (process.platform === 'win32') {
        child_process.execSync('del /S /Q node_modules package.json package-lock.json');
    } else {
        child_process.execSync('rm -fr node_modules package.json package-lock.json');
    }
}
