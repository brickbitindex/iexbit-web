var analysis = {
  toastio: {
    static: `
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-113346386-4"></script>
<script>
  if (location.host.indexOf('bitrabbit') > -1) {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-113346386-4');

    if (current_user) {
      gtag('set', {'user_id': current_user.id});
    }
  }
</script>
<script type='text/javascript'>
  if (location.host.indexOf('bitrabbit') > -1) {
    !function(e,t,n,g,i){e[i]=e[i]||function(){(e[i].q=e[i].q||[]).push(arguments)},n=t.createElement("script"),tag=t.getElementsByTagName("script")[0],n.async=1,n.src=('https:'==document.location.protocol?'https://':'http://')+g,tag.parentNode.insertBefore(n,tag)}(window,document,"script","assets.growingio.com/2.1/gio.js","gio");
    gio('init','a09c75ac8ddc1dc8', {});
    if (current_user) {
      var userid = current_user.id;
      userid ? gio('setUserId', userid) : gio('clearUserId');
    }
    gio('send');
  }
</script>
</head>`,
    erb: `
<%= csrf_meta_tags %>
<%= action_cable_meta_tag %>
<%= render 'shared/ga' %>

</head>`
  },
  forum: {
    static: `
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-113346386-3"></script>
<script>
  if (location.host.indexOf('bitrabbit') > -1) {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-113346386-3');

    if (current_user) {
      gtag('set', {'user_id': current_user.id});
    }
  }
</script>
<script type='text/javascript'>
  if (location.host.indexOf('bitrabbit') > -1) {
    !function(e,t,n,g,i){e[i]=e[i]||function(){(e[i].q=e[i].q||[]).push(arguments)},n=t.createElement("script"),tag=t.getElementsByTagName("script")[0],n.async=1,n.src=('https:'==document.location.protocol?'https://':'http://')+g,tag.parentNode.insertBefore(n,tag)}(window,document,"script","assets.growingio.com/2.1/gio.js","gio");
    gio('init','b37cf5d491e9e770', {});
    if (current_user) {
      var userid = current_user.id;
      userid ? gio('setUserId', userid) : gio('clearUserId');
    }
    gio('send');
  }
</script>
</head>`,
    erb: `
<%= render 'common/analysis' %>
</head>`
  }
}

module.exports = analysis;
