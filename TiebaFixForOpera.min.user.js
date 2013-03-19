// ==UserScript==
// @name	Tieba Fix for Opera
// @namespace	http://gera2ld.blog.163.com/
// @author	Gerald <gera2ld@163.com>
// @icon	http://s.gravatar.com/avatar/a0ad718d86d21262ccd6ff271ece08a3?s=80
// @version	1.0.2
// @description	Opera贴吧修复 - Gerald倾情打造
// @homepage	https://userscripts.org/scripts/show/153687
// @downloadURL	https://userscripts.org/scripts/source/153687.user.js
// @updateURL	https://userscripts.org/scripts/source/153687.meta.js
// @include	http://tieba.baidu.com/*
// @exclude	http://tieba.baidu.com/tb/*
// ==/UserScript==
function o(o,e,t,n){if(typeof o[e]!="function")return!1;if(!o[e].hooked){var r=o[e];o[e]=function(){var o,e=this,t=arguments,n=t.callee;return n.hook_before.forEach(function(o){o.apply(e,t)}),o=n.hook_func.apply(e,t),n.hook_after.forEach(function(n){o=n.apply(e,[o,t])||o}),o},o[e].hooked=!0,o[e].hook_after=[],o[e].hook_before=[],o[e].hook_func=r}n&&("function"==typeof n&&(n=[n]),n.forEach(function(t){o[e].hook_after.push(t)})),t&&("function"==typeof t&&(t=[t]),t.forEach(function(t){o[e].hook_before.push(t)}))}function e(o,e){(o.mousedown||o.mouseup).call(o,e)}function t(){o(TED.EditorCore.prototype,"focus",null,function(){this.editArea.scrollIntoView(),this.resumeRange()}),o(TED.EditorCore.prototype,"getRange",function(){var o=window.getSelection();if(!o.rangeCount){var e=document.createRange();e.setStartBefore(this.editArea.lastChild),o.addRange(e)}})}function n(){function o(o,e){document.execCommand("forecolor",!1,document.queryCommandValue("forecolor").replace(/\s/g,"")==o?"#333333":e)}e($("div.tb-editor-toolbar .font_color").unbind(),function(){o("rgb(225,6,2)","#e10602")})}function r(){function e(o){o.innerHTML=o.innerHTML.replace(/<p>(.*?)(<br>)?<\/p>/gi,"$1<br>").replace(/<br>$/,"")}o(rich_postor._editor,"getHtml",function(){e(this.editArea)})}function i(){o(rich_postor._editor,"reLayout",null,function(){$(this.editArea).find("img").each(function(o,e){(o=e.height)&&(e.height=Math.round(o))})})}window.rich_postor&&rich_postor._editor&&window.PageData&&PageData.user.is_login&&(t(),n(),r(),i());