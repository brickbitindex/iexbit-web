var fs = require('fs');

var files = fs.readdirSync('./dist/assets');

var reg = /.+\.html/;

files.forEach(function(file) {
  if (reg.test(file)) {
    var content = fs.readFileSync('./dist/assets/' + file).toString();
    content = content.replace('</head>', `
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-113346386-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-113346386-1');
</script>
</head>`);
    fs.writeFileSync('./dist/assets/' + file, content);
    fs.renameSync('./dist/assets/' + file, './dist/' + file);
  }
})
