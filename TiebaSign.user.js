// ==UserScript==
// @name	Tieba Sign
// @namespace	http://gera2ld.blog.163.com/
// @author	Gerald <gera2ld@163.com>
// @icon	http://s.gravatar.com/avatar/a0ad718d86d21262ccd6ff271ece08a3?s=80
// @version	1.2
// @description	贴吧签到
// @homepage	http://userscripts.org/scripts/show/154159
// @downloadURL	https://userscripts.org/scripts/source/154159.user.js
// @updateURL	https://userscripts.org/scripts/source/154159.meta.js
// @include	http://tieba.baidu.com/*
// @exclude	http://tieba.baidu.com/tb/*
// @grant GM_getValue
// @grant GM_setValue
// @grant	GM_xmlhttpRequest
// ==/UserScript==

// 公共函数
function bindProp(obj,prop,key) {
	function setValue(){GM_setValue(key,obj.prop(prop));}
	obj.prop(prop,GM_getValue(key));
	obj.bind('change',function(e){setTimeout(setValue,0);});
	return obj;
}
function initSetting(key,def) {
	if(GM_getValue(key)==undefined) {
		var v=localStorage.getItem('ge_sign_'+key);
		if(v) {localStorage.removeItem('ge_sign_'+key);try{v=JSON.parse(v);}catch(e){v=null;}}
		if(!v) v=def; GM_setValue(key,v);
	}
}
var $=unsafeWindow.$,PageData=unsafeWindow.PageData;

// 模拟WAP签到
function wapSign(name,callback){
	/*
	 * -1: 未知错误
	 *  0: 签到成功
	 *  1: 未开通签到
	 *  2: 网络错误
	 */
	var base='http://wapp.baidu.com',R={err:-1};
	function neterr(r){R.err=2;R.msg='网络错误';callback(R);}
	GM_xmlhttpRequest({
		method:'GET',
		url:base+'/f?kw='+name,
		onload:function(r){
			var m,s;
			if(s=r.responseText.match(/<(\w+) style="text-align:right;">(.*?)<\/\1>/)) {
				if(s=s[2]) {
					if(m=s.match(/<a href="(.*?)">签到<\/a>/)) return GM_xmlhttpRequest({
						method:'GET',
						url:base+m[1].replace(/&amp;/g,'&'),
						onload:function(r){
							r=r.responseText.match(/<span class="light">(.*?)<div/);
							if(r) {
								R.msg=r[1].replace(/<[^>]*>/g,'');
								if(/^签到成功/.test(R.msg)) R.err=0;
							}
							callback(R);
						},
						onerror:neterr
					});
					if(m=s.match(/<span >已签到<\/span>/)) {R.err=0;R.msg='已签到';}
				} else R.err=1;
			}
			callback(R);
		},
		onerror:neterr
	});
}
var j;
if(PageData&&PageData.user&&PageData.user.is_login) {
	initSetting('sign',true);initSetting('wap',true);
	if(GM_getValue('sign')&&!PageData.user.is_black&&(j=$('#sign_mod .j_cansign')).length) visitSign();
	if(unsafeWindow.oftenForum) iSign();
}
// 访问时自动签到
function visitSign(){
	if(GM_getValue('wap')&&!$('#balv_dolike').length)	// “喜欢”才使用WAP签到
		wapSign(PageData.forum.name,function(d){
			if(d.err) return;
			j.removeClass('j_cansign signstar_btn').addClass('signstar_signed').html('<span class="sign_keep_span">WAP签到成功</span>');
			$('#signstar_wrapper').addClass('signstar_wrapper_signed');
		});
	else {
		var Sign_rank=unsafeWindow.Sign_rank;
		$.tb.post(Sign_rank.sign_url,{kw:PageData.forum.name,tbs:PageData.tbs,ie:'utf-8'},function(d){
			if(d&&d.no==0) {
				$('.j_today_signnum').html(d.data.finfo.current_rank_info.sign_count);
				var f=PageData.forum.version>=2?2:1,b=new Date(d.data.uinfo.sign_time);
				Sign_rank.sign_year=Sign_rank.orign_year=b.getFullYear();
				Sign_rank.sign_month=Sign_rank.orign_month=b.getMonth()+1;
				Sign_rank.sign_load_month(1);
			}
		},'json');
	}
}
// 从i贴吧页面自动签到所有爱逛的贴吧
function iSign(){
	var d=$('#jsaddlike');if(!d.length) return;
	d.html(function(i,h){
		return h.replace(/(自定义添加<\/a>)/,'$1<span class=add_like_sep> </span><a href=# class="j_tab add_like_tab" id=import_like>导入“我喜欢的贴吧”</a>');
	});
	var bindEventToFloatlayer=unsafeWindow.oftenForum.bindEventToFloatlayer;
	unsafeWindow.oftenForum.bindEventToFloatlayer=function(){
		var r=bindEventToFloatlayer.apply(this,arguments);
		$('#import_like').click(function(e){
			e.preventDefault();
			$(this).replaceWith('<span class="j_tab add_like_tab" style="color:red">已添加 <span id=imported>0</span> 个贴吧</span> <a href=# onclick="location.reload();">刷新</a>');
			var f=true,t=0;
			function add(d){
				var a,reg=new RegExp('<a href="/f\\?kw=[^>]*?>(.*?)</a>','g');
				while(a=reg.exec(d)) $.post('/i/submit/add_user_favoforum',{ie:'utf-8',kw:a[1],tbs:PageData.tbs},function(d){
					if(d.is_done) $('#imported').html(++t);
				},'json');
				if(f) {
					f=false;
					d.match(/\/f\/like\/mylike\?&pn=\d+">\d/g).forEach(function(i){$.get(i.slice(0,-3),add);});
				}
			}
			$.get('/f/like/mylike',add);
		});
		return r;
	};
	var s=$('<span id=signing style="color:red;margin:0 20px;display:none">正在签到...</span>').appendTo('span.head_title');
	var l=$('<li>').addClass('nav_item').appendTo('ul.nav_bar').hover(function(){j.toggle();});
	$('<a href=# title="自动签到“我爱逛的贴吧”。如有需要，可在通过下面的“添加”导入所有“我喜欢的贴吧”~">自动签到</a>').appendTo(l).click(sign);
	$('<style>.nav_bar{background-color:#d0dbed;}</style>').appendTo(l);	// 设置默认背景色
	j=$('<div class=nav_bar style="padding:10px;display:none;z-index:10;position:absolute;max-width:80px;background-image:none;">').appendTo(l);
	bindProp($('<input type=checkbox>').prependTo($('<label title="自动签到和访问时模拟WAP签到">模拟WAP</label>').appendTo(j)),'checked','wap');
	$('<br>').appendTo(j);
	bindProp($('<input type=checkbox>').prependTo($('<label title="访问贴吧时自动签到">访问时签到</label>').appendTo(j)),'checked','sign');
	function signOne() {
		var e=d.first(),a=e.children('.j_ba_link');d=d.not(e);
		function mark(r) {
			if(r.err) {
				if(r.err==1) {r.color='blue';r.msg='未开通签到';r.text='未开通';}
				else {r.color='red';r.msg=r.msg||'未知错误';r.text='出错';}
				h=$('<span style="color:'+r.color+'" title="'+r.msg+'">'+r.text+'<span>');
			} else h=$('<div class="forum_sign" title="'+r.msg+'" style="display: block;"> </div>');
			h.insertBefore(e.children('.always_go_manage'));
		}
		if(GM_getValue('wap')&&a.attr('forum-like')=='1')	// 模拟WAP签到
			wapSign(a.attr('forum'),function(r){mark(r);sign();});
		else $.get(a.attr('href'),function(d){		// 正常签到
			var r=d.match(/"is_sign_in":(\d+),"user_sign_rank":(\d+),/);
			if(r&&r[1]=='1') mark({err:0,msg:'签到成功，排名'+r[2]});
			else if(r=d.match(/PageData\.tbs = "(.*?)";/))
				return $.post('/sign/add',{ie:'utf-8',kw:a.html(),tbs:r[1]},function(r) {
					if(!r.no) mark({err:0,msg:'签到成功，排名'+r.data.uinfo.user_sign_rank});
					else mark({err:-1,msg:r.no+': '+r.error});sign();
				},'json');
			else mark({err:-1});
			sign();
		}).error(function(e,s,t){mark({err:-1,msg:t});sign();});
	}
	function sign(e) {
		if(e) {
			if(s.is(':visible')) return;s.show();
			d=$('#always_go_list>ul>li:has(a.j_ba_link):not(:has(.forum_sign))');
			d.children('span').remove();
		}
		if(d.length) setTimeout(signOne,e?0:2000); else s.hide();
	}
}
