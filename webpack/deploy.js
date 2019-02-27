var fs = require('fs');
var routers = require('./routers.deploy.json').routers;

var files = fs.readdirSync('./dist/assets');

var reg = /.+\.html/;
var analysis = require('./analysis');

files.forEach(function(file) {
  if (reg.test(file)) {
    var fileRouter = routers.find(r => r.filename === file);
    var contents = analysis[fileRouter.base || 'toastio'];
    var replaceContent = fileRouter.erb ? contents.erb : contents.static;

    var content = fs.readFileSync('./dist/assets/' + file).toString();
    content = content.replace('</head>', replaceContent);
    fs.writeFileSync('./dist/assets/' + file, content);
    fs.renameSync('./dist/assets/' + file, './dist/' + file);
  }
})
