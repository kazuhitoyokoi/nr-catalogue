var path = require('path');
var fs = require('fs');

var modules = JSON.parse(fs.readFileSync(path.join('docs', 'docker.json'))).modules;
var modulesWindows = JSON.parse(fs.readFileSync(path.join('docs', 'win32.json'))).modules;
var modulesMac = JSON.parse(fs.readFileSync(path.join('docs', 'darwin.json'))).modules;
var newModules = [];

for (var i = 0; i < modules.length; i++) {
    var flagWindows = modulesWindows.find(v => v.id == modules[i].id);
    var flagMac = modulesMac.find(v => v.id == modules[i].id);
    if(flagWindows && flagMac) {
        newModules.push(modules[i]);
    }
}

try { fs.mkdirSync('docs'); } catch (e) {}
var catalogue = JSON.stringify({ name: "Catalogue for verified nodes", updated_at: new Date(), modules: newModules }, null, 2);
fs.writeFileSync(path.join('docs', 'all.json'), catalogue);
