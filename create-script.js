var modules = require('./' + process.argv[2]).modules;
for (var i = 0; i < modules.length; i++) {
    console.log('npm install ' + modules[i].id + '@' + modules[i].version);
    if (process.platform === 'win32') {
        console.log('del /S /Q node_modules package.json package-lock.json');
    } else {
        console.log('rm -fr node_modules package.json package-lock.json');
        console.log('rm -fr node_modules package.json package-lock.json');
    }
}
