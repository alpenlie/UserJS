// ==UserScript==
// @name	Weibo Fix for Opera
// @namespace	http://gera2ld.blog.163.com/
// @author	Gerald <gera2ld@163.com>
// @icon	https://s.gravatar.com/avatar/a0ad718d86d21262ccd6ff271ece08a3?s=80
// @version	1.0
// @description	Opera微博修复 - Gerald倾情打造
// @updateURL	https://userscripts.org/scripts/source/166458.meta.js
// @downloadURL	https://userscripts.org/scripts/source/166458.user.js
// @match	http://*.weibo.com/*
// ==/UserScript==
var e=HTMLElement.prototype.insertAdjacentHTML;HTMLElement.prototype.insertAdjacentHTML=function(t,i){e.call(this,t,"<div id=ge_weibo_fix></div>");var n=document.getElementById("ge_weibo_fix");n.outerHTML=i};