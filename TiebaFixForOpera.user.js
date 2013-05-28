// ==UserScript==
// @name	Tieba Fix for Opera
// @namespace	http://gera2ld.blog.163.com/
// @author	Gerald <gera2ld@163.com>
// @icon	http://s.gravatar.com/avatar/a0ad718d86d21262ccd6ff271ece08a3?s=80
// @version	1.0.5
// @description	Opera贴吧修复 - Gerald倾情打造
// @homepage	http://userscripts.org/scripts/show/153687
// @downloadURL	https://userscripts.org/scripts/source/153687.user.js
// @updateURL	https://userscripts.org/scripts/source/153687.meta.js
// @include	http://tieba.baidu.com/*
// @exclude	http://tieba.baidu.com/tb/*
// @require	https://raw.github.com/gera2ld/UserJS/master/lib/TiebaCommon.min.user.js
// ==/UserScript==

// 公共函数
function hook(o,n,a) {
	var f=o[n];
	if(!f.hooked) {
		o[n]=function() {
			var t=this,a=arguments,f=a.callee,r=null,_r,i,stop=false;
			f.hookStop=function(){stop=true;};
			for(i=0;i<f.hook_before.length;i++){
				r=f.hook_before[i].apply(t,[f,a]);
				if(stop) return r;
			}
			r=f.hook_func.apply(t,a);
			for(i=0;i<f.hook_after.length;i++){
				_r=f.hook_after[i].apply(t,[f,r,a]);
				if(_r!==undefined) r=_r;
				if(stop) return r;
			}
			return r;
		};
		o[n].hook_func=f;
		f=o[n];
		f.hooked=true;
		f.hook_after=[];
		f.hook_before=[];
	}
	o=f.hook_after;
	if(n=a.after) {
		if(n.concat) f.hook_after=o.concat(n);
		else o.push(n);
	}
	o=f.hook_before;
	if(n=a.before) {
		if(n.concat) f.hook_before=o.concat(n);
		else o.push(n);
	}
}
if(typeof utils=='object') hook=utils.hook;
function mousePress(o,m) {(o.mousedown||o.mouseup).call(o,m);}	// Compatible with Dragging fix

// 修复光标
function initCursorFix() {
	hook(TED.EditorCore.prototype,'focus',{after:function(e){this.editArea.scrollIntoView();this.resumeRange();}});
	hook(TED.EditorCore.prototype,'getRange',{before:function(e){
		var s=window.getSelection();
		if(!s.rangeCount){
			var r=document.createRange();
			r.setStartBefore(this.editArea.lastChild);
			s.addRange(r);
		}
	}});
}
// 修复Opera红字切换
function initFontRed() {
	function switchColor(cr,cs) {
		document.execCommand('forecolor',false,document.queryCommandValue('forecolor').replace(/\s/g,'')==cr?'#333333':cs);
	}
	mousePress($('div.tb-editor-toolbar .font_color').unbind(),function(e){switchColor('rgb(225,6,2)','#e10602');});
}
// 修复换行问题
function initNewLineFix() {
	function fixNewLine(o) {
		o.innerHTML=o.innerHTML.replace(/<p>(.*?)(<br>)?<\/p>/gi,'$1<br>').replace(/<br>$/,'');
	}
	hook(TED.EditorCore.prototype,'getHtml',{before:function() {fixNewLine(this.editArea);}});
}
// 修复Opera发布大图时的未知错误
function initImageFix() {
	hook(rich_postor._editor,'reLayout',{after:function(){
		$(this.editArea).find('img').each(function(i,e) {if(i=e.height) e.height=Math.round(i);});
	}});
}

if(window.rich_postor&&rich_postor._editor&&window.PageData&&PageData.user.is_login) {
	initCursorFix();		// 修复光标
	initFontRed();			// 修复Opera红字切换
	initNewLineFix();		// 换行修复
	initImageFix();			// 修复发布大图时的未知错误
}
