// ==UserScript==
// @name	Tieba Quotor
// @namespace	http://gera2ld.blog.163.com/
// @author	Gerald <gera2ld@163.com>
// @icon	http://s.gravatar.com/avatar/a0ad718d86d21262ccd6ff271ece08a3?s=80
// @version	1.3
// @description	贴吧引用
// @homepage	http://userscripts.org/scripts/show/157071
// @downloadURL	https://userscripts.org/scripts/source/157071.user.js
// @updateURL	https://userscripts.org/scripts/source/157071.meta.js
// @include	http://tieba.baidu.com/*
// @exclude	http://tieba.baidu.com/tb/*
// @require	https://raw.github.com/gera2ld/UserJS/master/lib/TiebaCommon.min.user.js
// ==/UserScript==

var lzl_update=[];
function initQuotation() {
	// 增加引用按钮
	function quote(e) {
		e.preventDefault();
		var m=$(this).parent().hasClass('p_mtail'),o=e.target,p=$(o).parents('.l_post'),l=m?p:$(o).parents('.lzl_single_post'),
			info=JSON.parse(p.attr('data-field')),u=m?info.author.name:JSON.parse(l.attr('data-field')).user_name;
		p=[];
		o=l.find(m?'div.d_post_content':'span.lzl_content_main').contents(':not(blockquote)').each(function(i,e){p.push(e);});
		while(p.length)	// 去掉开头空行
			if(p[0].tagName=='BR'||!/\S/.test(p[0])) p.shift(); else break;
		for(l=p.length-1,o=[];l>=0&&p.length;l--) {	// 屏蔽尾巴，去掉末尾空行
			if(p[l].tagName=='BR') {
				if(/^\s*($|——|>>)/.test(o.join(''))) {p.splice(l);o.splice(0);}
				else break;
			} else o.unshift(p[l].innerText||p[l].textContent||p[l].data);	// return undefined for IMG
		}
		o=[];p.forEach(function(i){o.push(i.outerHTML||i.data||'');});
		o=o.join('')
			.replace(/^\s+|\s+$/gi,'')	// 去掉开头和末尾的空白
			.replace(/\s?<a [^>]*>@(.*?)<\/a>\s?/gi,' $1 ')	// 屏蔽点名
			.replace(/<a [^>]*?href="(.*?)"[^>]*>(.*?)<\/a>/,function(v,g1,g2){	// 保留蓝字，屏蔽链接
				return g1==g2?g2:'<font color="#261cdc">'+g2+'</font>';
			});
		o='引用 @'+u+' ('+info.content.floor+'楼'+(m?'':'之楼中楼')+')<br>'+o+'<br>————————————————————————————————<br><br>';
		unsafeWindow.rich_postor._editor.focus();
		unsafeWindow.rich_postor._editor.execCommand('inserthtml',o);
	}
	// 主楼层
	$('<a href=#>引用</a>').css({'float':'right','margin-left':'5px'}).appendTo('.p_mtail').click(quote);
	// 楼中楼
	lzl_update.push(function(p){
		$('<a href=#>引用</a>').css('margin-right','10px').insertBefore(p.find('span.lzl_time')).click(quote);
	});
}
function initQuotationFormat() {
	// 增加直达链接
	var an=$('ul.p_tail').get();
	function getAnchor(i,h){
		return '<a href="/f?ct=335675392&sc='+i+'&z='+PageData.thread.id+'#'+i+'" title="精确定位链接">'+h+'</a>';
	}
	function anchor(){
		for(var i=0,j=0;i<an.length;i++) {
			var e=$(an[i]).children().children();
			if(!e.length) {an[j++]=an[i];continue;}
			var p=e.parents('.l_post').children('a').attr('name');
			if(e[0]) e[0].outerHTML='<a href=#'+p+' title="楼层定位链接">'+e[0].innerHTML+'</a>';
			if(e[1]) e[1].outerHTML=getAnchor(p,e[1].innerHTML);
		}
		an.splice(j);
		if(an.length) setTimeout(anchor,500);
	}
	anchor();
	lzl_update.push(function(p){
		p.find('span.lzl_time').html(function(i,h) {
			return getAnchor($(this).parents('.lzl_single_post').children('a').attr('name'),h);
		});
	});
	// 修改引用文字格式
	utils.addStyle('fieldset .BDE_Image{height:auto !important; width:auto !important; max-height:200px; max-width:560px !important;}');
	$('div.d_post_content').each(function(i,e) {
		var c=-1,n=$(e).contents(),j,f;
		for(j=0;j<n.length;j++) {
			f=n[j];
			if(c>=0&&f.nodeName=='#text'&&/^\s*—{27,36}\s*$/.test(f.data)) {
				n.slice(c,c+3).wrapAll('<legend>').parent().add(n.slice(c+4,j).wrapAll('<p class=quote_content>').parent()).wrapAll('<blockquote class=d_quote>').wrapAll('<fieldset>');
				$(f).add(n[c+3]).remove();
				if((f=n[j+1])&&f.nodeName=='BR') {$(f).remove();j++;}
				c=-1;
			} else if(f.nodeName=='#text'&&/^引用(\s|&nbsp;?)$/.test(f.data)
				&&n[j+1]&&n[j+1].nodeName=='A'&&n[j+1].innerHTML[0]=='@'
				&&n[j+2]&&n[j+2].nodeName=='#text'&&/^\s\(.*?楼\)$/.test(n[j+2].data)
				&&n[j+3].nodeName=='BR') {
				c=j;j+=3;
			}
		}
	});
}
// 楼中楼初始化
function initLzL() {
	function updateLzl(p) {
		var t=this;
		t.update=function(){
			var j=p.find('p.j_pager');
			if(j.attr('clicked')=='1') return t.delay();
			lzl_update.forEach(function(i){i(p);});
			j.click(function(e){
				if(e.target.tagName=='A') {
					$(this).attr('clicked','1');
					e=new updateLzl($(this).parents('ul.j_lzl_m_w'));
					e.delay();
				}
			});
		};
		t.delay=function(){setTimeout(t.update,200);};
	}
	var p=new updateLzl($('ul.j_lzl_m_w'));p.update();
}
if(PageData&&PageData.user){
	if(PageData.thread) initQuotationFormat();		// 引用格式
	if(PageData.user.is_login) {
		if(unsafeWindow.rich_postor) initQuotation();		// 引用功能
		if(unsafeWindow.LzlEditor) initLzL();		//初始化：支持已加载的功能
	}
}
