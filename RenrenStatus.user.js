// ==UserScript==
// @name	人人网状态导出
// @namespace	http://gera2ld.blog.163.com/
// @author	Gerald <gera2ld@163.com>
// @icon	http://s.gravatar.com/avatar/a0ad718d86d21262ccd6ff271ece08a3?s=80
// @version	1.0
// @homepage	https://userscripts.org/scripts/show/155376
// @downloadURL	https://userscripts.org/scripts/source/155376.user.js
// @updateURL	https://userscripts.org/scripts/source/155376.meta.js
// @include	http://www.renren.com/*
// @exclude	http://www.renren.com/ajaxproxy.htm
// @grant	GM_xmlhttpRequest
// ==/UserScript==

/**
* http://www.webtoolkit.info/javascript-utf8.html
*/
function utf8encode (string) {
	string = string.replace(/\r\n/g,"\n");
	var utftext = "";
	for (var n = 0; n < string.length; n++) {
		var c = string.charCodeAt(n);
		if (c < 128) {
			utftext += String.fromCharCode(c);
		} else if((c > 127) && (c < 2048)) {
			utftext += String.fromCharCode((c >> 6) | 192);
			utftext += String.fromCharCode((c & 63) | 128);
		} else {
			utftext += String.fromCharCode((c >> 12) | 224);
			utftext += String.fromCharCode(((c >> 6) & 63) | 128);
			utftext += String.fromCharCode((c & 63) | 128);
		}
	 }
	return utftext;
}

var d=document.querySelector('#navProfileDropMenu');
if(d) {
	var a=document.createElement('a');
	a.className='nav-drop-menu-item';
	a.href='#';
	a.innerHTML='<img class="icon" src="http://app.xnimg.cn/application/20090922/02/55/L937572594167SJS.gif"/> 导出状态';
	d.appendChild(a);
	d=document.createElement('div');
	d.style.cssText='position:fixed;top:40%;height:50px;background:white;border:2px solid blue;border-radius:10px;z-index:9999;width:300px;padding:15px;text-align:center;display:none;';
	d.innerHTML='<h1 align=center>导出状态</h1>';
	var m=document.createElement('div');
	d.appendChild(m);
	document.body.appendChild(d);
	a.onclick=function(e) {
		e.preventDefault();
		d.style.display='block';
		d.style.left=(window.innerWidth-d.offsetWidth)/2+'px';
		m.innerHTML='正在导出...';
		var s=[],p=0,XN=unsafeWindow.XN;
		function callback(d) {
			j=JSON.parse(d);
			s=s.concat(j.doingArray);m.innerHTML='正在导出...('+s.length+'/'+j.count+')';
			if(s.length<j.count) {p++;setTimeout(getData,1);} else finish();
		}
		function getData() {
			GM_xmlhttpRequest({
				url:'http://status.renren.com/GetSomeomeDoingList.do?curpage='+p,
				method:'GET',
				onload:function(e){callback(e.responseText);}
			});
		}
		function finish() {
			var u=decodeURIComponent(XN.user.name);
			m.innerHTML='导出完成！<a href=# data=open>打开</a> | <a href=# data=close>关闭</a>';
			m.onclick=function(e){
				if(e.target.tagName!='A') return;
				e.preventDefault();
				d.style.display='none';
				if(e.target.getAttribute('data')=='open') {
					var c=['<!doctype html><html><head><meta http-equiv="Content-Type" content="text/html;charset=utf-8"><title>'+u+'的状态</title><style>.footer{color:gray;font-style:italic;font-size:80%;}</style></head><body><h1>'+u+'的状态</h1>'];
					while(s.length) {
						p=s.pop();
						c.push('<hr><p><em>'+p.dtime+'</em></p><p>'+p.content+'</p>');
					}
					c.push('<hr><div class=footer>来自 - <a href=http://userscripts.org/scripts/show/155376>人人网辅助脚本</a> - by <a href=http://gera2ld.blog.163.com/>Gerald</a> &copy; 2012</div></body></html>');
					c=btoa(utf8encode(c.join('')));
					open('data:text/html;charset=utf-8;base64,'+c);
					delete c;delete s;
				}
			}
		}
		getData();
	}
}
