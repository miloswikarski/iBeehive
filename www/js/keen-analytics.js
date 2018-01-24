!function(name,path,ctx){
  var latest,prev=name!=='Keen'&&window.Keen?window.Keen:false;ctx[name]=ctx[name]||{ready:function(fn){var h=document.getElementsByTagName('head')[0],s=document.createElement('script'),w=window,loaded;s.onload=s.onerror=s.onreadystatechange=function(){if((s.readyState&&!(/^c|loade/.test(s.readyState)))||loaded){return}s.onload=s.onreadystatechange=null;loaded=1;latest=w.Keen;if(prev){w.Keen=prev}else{try{delete w.Keen}catch(e){w.Keen=void 0}}ctx[name]=latest;ctx[name].ready(fn)};s.async=1;s.src=path;h.parentNode.insertBefore(s,h)}}
}('KeenTracking','https://d26b395fwzu5fz.cloudfront.net/keen-tracking-1.1.4.min.js',this);

KeenTracking.ready(function() {

  var meta = new KeenTracking({
      projectId: '5a66354f46e0fb000143d6e2',
      writeKey: 'AAE14671951B8AF332D6B7E4CF9C8AB4D629FF64AE12526A2648FECBDB203BA82F7C8E32E87EE21611815753433CAD8A2CD8D862F1128EF7EA7813EE320A58F8FF18CD411E11BE364009EB12217B6A3938FCEB564E9891BD7ECF109A8892E9C0'
  });
  meta.recordEvent('visits', {
    page: {
      title: document.title,
      host: document.location.host,
      href: document.location.href,
      path: document.location.pathname,
      protocol: document.location.protocol.replace(/:/g, ''),
      query: document.location.search
    },
    visitor: {
      referrer: document.referrer,
      ip_address: '${keen.ip}',
      // tech: {} //^ created by ip_to_geo add-on
      user_agent: '${keen.user_agent}'
      // visitor: {} //^ created by ua_parser add-on
    },
    keen: {
      timestamp: new Date().toISOString(),
      addons: [
        { name:'keen:ip_to_geo', input: { ip:'visitor.ip_address' }, output:'visitor.geo' },
        { name:'keen:ua_parser', input: { ua_string:'visitor.user_agent' }, output:'visitor.tech' }
      ]
    }
  });
});
