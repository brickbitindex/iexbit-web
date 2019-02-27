var fs = require('fs');

var files = fs.readdirSync('./dist/assets');

var reg = /.+\.html/;


const replaceContent = `
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-113346386-4"></script>
<script>
  if (location.host.indexOf('bitrabbit') > -1) {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-113346386-4');
  }
</script>
<script type='text/javascript'>
  if (location.host.indexOf('bitrabbit') > -1) {
    !function(e,t,n,g,i){e[i]=e[i]||function(){(e[i].q=e[i].q||[]).push(arguments)},n=t.createElement("script"),tag=t.getElementsByTagName("script")[0],n.async=1,n.src=('https:'==document.location.protocol?'https://':'http://')+g,tag.parentNode.insertBefore(n,tag)}(window,document,"script","assets.growingio.com/2.1/gio.js","gio");
    gio('init','a09c75ac8ddc1dc8', {});
    gio('send');
  }
</script>
<script>
window.gagioUser = function(userid) {
  if (location.host.indexOf('bitrabbit') === -1) return;
  if (userid) {
    gtag('set', {'user_id': userid});
    gio('setUserId', userid);
    gio('send');
  } else {
    gio('clearUserId');
    gio('send');
  }
}
</script>
</head>`

files.forEach(function(file) {
  if (reg.test(file)) {
    var content = fs.readFileSync('./dist/assets/' + file).toString();
    content = content.replace('</head>', replaceContent);
    fs.writeFileSync('./dist/assets/' + file, content);
    fs.renameSync('./dist/assets/' + file, './dist/' + file);
  }
})
