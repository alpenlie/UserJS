// ==UserScript==
// @name	Tieba Image Rotator
// @namespace	http://gera2ld.blog.163.com/
// @author	Gerald <gera2ld@163.com>
// @icon	http://s.gravatar.com/avatar/a0ad718d86d21262ccd6ff271ece08a3?s=80
// @version	0.2
// @description	贴吧图片旋转功能
// @include	http://tieba.baidu.com/*
// @exclude	http://tieba.baidu.com/tb/*
// @grant	none
// ==/UserScript==

(function() {
	if(typeof unsafeWindow=='undefined') unsafeWindow=window; else $=unsafeWindow.$;
	if(!unsafeWindow.favConfig) return;
	$('<style>').html('.fav-toolbar .turnleft,.fav-toolbar .turnright{background:url("http://tb2.bdstatic.com/tb/static-frs/img/v2/tb_icon.png") no-repeat white;border:1px solid #ccc;margin-right:6px;}.fav-toolbar .turnleft{background-position:4px -992px;}.fav-toolbar .turnright{background-position:4px -1026px;}').appendTo('head');
	var g,t=$('div.fav-toolbar'),x=parseInt(t.css('padding-left'));
	function rotate(e) {
		e.preventDefault();e=e.target;
		var r=g.attr('rad');
		if(!r) {
			g.next('.replace_tip').click();
			g.parent('.replace_div').css('overflow','visible');
		}
		r=parseInt(r)||0;
		if(e.className=='turnright') r+=90; else r-=90;
		g.attr('rad',r=r%360).css('transform','rotate('+r+'deg)');
	}
	$('<a href=# class=turnleft></a><a href=# class=turnright></a>').appendTo(t).click(rotate);
	var f=unsafeWindow.favConfig.setLikeButtonPosition;
	unsafeWindow.favConfig.setLikeButtonPosition=function(m,n){
		var r=f.apply(this,arguments);g=$(m);
		if(r&&g.attr('rad')%180) {
			var w=g.outerWidth(),h=g.outerHeight(),o=g.offset();
			t.css('left',o.left+h-x);
		}
		return r;
	};
})();
