// ==UserScript==
// @name	Tieba Float Movable
// @namespace	http://gera2ld.blog.163.com/
// @author	Gerald <gera2ld@163.com>
// @icon	http://s.gravatar.com/avatar/a0ad718d86d21262ccd6ff271ece08a3?s=80
// @version	1.1.2
// @description	贴吧可移动悬浮窗
// @homepage	http://userscripts.org/scripts/show/156576
// @downloadURL	https://userscripts.org/scripts/source/156576.user.js
// @updateURL	https://userscripts.org/scripts/source/156576.meta.js
// @include	http://tieba.baidu.com/*
// @exclude	http://tieba.baidu.com/tb/*
// @require	https://raw.github.com/gera2ld/UserJS/master/lib/TiebaCommon.min.user.js
// @grant	GM_getValue
// @grant	GM_setValue
// @grant	GM_registerMenuCommand
// ==/UserScript==

function locate(m,css) {
	var c={};
	args.forEach(function(i){c[i]=/^-?\d+px/.test(css[i])?css[i]:'20px';});
	m.css(c);
}
function movable(o,name) {
	var m=$(o);
	if(!m.mousedown) return;
	o.moving=false;args=['right','bottom'];
	m.mousedown(function(e) {
		if(['DIV','TD'].indexOf(e.target.tagName)<0||e.target.contentEditable=='true') return;
		e.preventDefault();e.stopPropagation();
		o.x=e.pageX;
		if(args.indexOf('left')>=0) o.x-=parseInt(m.css('left'));
		else o.x+=parseInt(m.css('right'));
		o.y=e.pageY;
		if(args.indexOf('top')>=0) o.y-=parseInt(m.css('top'));
		else o.y+=parseInt(m.css('bottom'));
		if(!o.moving) $(document).mousemove(function(e) {
			if(o.moving) {
				var css={};
				for(var i in args) {
					var arg=args[i];
					if(arg=='left') css[arg]=e.pageX-o.x;
					else if(arg=='right') css[arg]=o.x-e.pageX;
					else if(arg=='top') css[arg]=e.pageY-o.y;
					else if(arg=='bottom') css[arg]=o.y-e.pageY;
					else continue;
					css[arg]+='px';
				}
				locate(m,css);
			}
			e.preventDefault();
		}).mouseup(function(e) {
			if(o.moving) {
				o.moving=false;
				var css={};
				for(var i in args) {
					var arg=args[i];
					css[arg]=m.css(arg);
				}
				utils.setObj('mcss_'+name,css);
				$(document).unbind('mousemove').unbind('mouseup');
			}
		});
		o.moving=true;
	});
	locate(m,utils.getObj('mcss_'+name,{}));
}
function unmovable(o) {$(o).unbind('mousedown').css({left:'',right:'',top:'',bottom:''});}
function unminify(){mn.hide();ep.show();}
function minify(){ep.hide();mn.show();}
function switchFloat(e) {
	if(e) {
		if(e.type=='dblclick') {
			sta=sta=='open'?'close':'open';
		} else sta=sta=='normal'?'open':'normal';
		utils.setObj('float',sta);
	}
	if(!e||e.type=='click') {
		if(sta=='normal') {
			styleEditor.html('');styleFloat.html('');buttonFloat.val('悬浮');ep.unbind('dblclick');
			unmovable(ep[0]);ep.prop('title','');ea.attr('style',sea);mx.hide();
		} else {
			styleEditor.html(s);buttonFloat.val('停靠');ep.dblclick(switchFloat);
			movable(ep[0],'float');ea.prop('style','');
			if(allowMinify) {minify();mx.show();} else {unminify();mx.hide();}
		}
	}
	if(!allowSimple||sta=='open') {
		styleFloat.html('\
#edit_parent{width:635px;}\
#edit_parent *{max-width:635px;}\
.tb-editor-editarea{min-height:50px !important;}\
.editor_tip_show{top:50px !important}\
');
		if(allowSimple) ep.attr('title','双击精简');
	} else if(sta=='close') {
		styleFloat.html('\
#edit_parent{width:360px;}\
#edit_parent *{max-width:360px;}\
.tb-editor-toolbar,#signNameWrapper,.pt_submit,.editor_users{display:none;}\
.tb-editor-wrapper{margin:0 !important}\
.tb-editor-editarea{min-height:24px !important;}\
.editor_tip_show{top:0 !important;left:60px !important;}\
.edit_title_field{padding:0 !important;}\
');
		ep.attr('title','双击展开');
	}
}
function showOptions(){
	utils.popup.show({
		html:'<h3>贴吧悬浮窗脚本设置</h3><label><input type=checkbox id=allowMinify>自动隐藏悬浮窗口到右下角</label><label><br><input type=checkbox id=allowSimple>双击悬浮窗口使其精简或展开</label><br><button id=btReset>重置悬浮窗位置</button>',
		className:'ge_opt',
		init:function(d){
			d.querySelector('#btReset').onclick=function(){locate(ep,{});};
			var a=d.querySelector('#allowMinify');
			a.checked=allowMinify;
			a.onchange=function(){utils.setObj('allowMinify',allowMinify=this.checked);};
			a=d.querySelector('#allowSimple');
			a.checked=allowSimple;
			a.onchange=function(){utils.setObj('allowSimple',allowSimple=this.checked);};
		},
		dispose:function(d){
			switchFloat();
		},
	});
}

if(PageData&&PageData.user&&unsafeWindow.rich_postor) {
	var s='\
#signNameWrapper{margin:0 !important;}\
#edit_parent{border:3px double grey;position:fixed !important;z-index:998;background-color:#E7EAEB;}\
#edit_parent>table td:first-child,.new_tiezi_tip{display:none;}\
.editor_users{padding:0 !important;}\
.subTip,.e_inter_wrapper{display:none;}\
.edit_title_field{margin:0 0 -5px !important;}\
.tb-editor-editarea{max-height:266px !important;}\
',styleFloat=utils.addStyle(),styleEditor=utils.addStyle(),sta=utils.getObj('float','normal'),
	ea=$(unsafeWindow.rich_postor._editor.editArea),ep=$('#edit_parent'),sea=ea.attr('style'),
	buttonFloat=utils.addSButton().click(switchFloat),
	allowMinify=utils.getObj('allowMinify',true),allowSimple=utils.getObj('allowSimple',true),args,
	mn=$('<div style="position:fixed;bottom:0;right:0;background:white;padding-top:40px;">◀</div>').appendTo(document.body).hide().mouseover(unminify),
	mx=$('<div style="position:absolute;top:0;background:inherit;border:1px solid gray;padding-bottom:40px;cursor:pointer;" title="最小化">▶</div>').appendTo(ep).hide().click(minify);
	mx.css('left',-mx.outerWidth());
	switchFloat();
	GM_registerMenuCommand('悬浮窗设置',showOptions);
	notice(1,'欢迎使用贴吧悬浮窗脚本！\n功能简介：\n1. 可悬浮编辑窗，悬浮后可移动；\n2. 双击悬浮窗口框架可展开或精简编辑框；\n3. 悬浮窗口支持自动隐藏到右下角，鼠标移至右下角即可呼出。');
}
