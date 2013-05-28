// ==UserScript==
// @name	Opera Fix
// @namespace	http://gera2ld.blog.163.com/
// @author	Gerald <gera2ld@163.com>
// @icon	http://s.gravatar.com/avatar/a0ad718d86d21262ccd6ff271ece08a3?s=80
// @version	1.0
// @description	Opera功能修复
// @homepage	http://userscripts.org/scripts/show/166458
// @updateURL	https://userscripts.org/scripts/source/166458.meta.js
// @downloadURL	https://userscripts.org/scripts/source/166458.user.js
// @match	*://*/*
// @run-at	document-start
// ==/UserScript==

var insertAdjacentHTML=HTMLElement.prototype.insertAdjacentHTML;
HTMLElement.prototype.insertAdjacentHTML=function(a,b){
	insertAdjacentHTML.call(this,a,'<div id=ge_opera_fix></div>');
	var p=document.getElementById('ge_opera_fix');
	p.outerHTML=b;
};
