// ==UserScript==
// @name	Tieba Fix for Opera
// @namespace	http://gera2ld.blog.163.com/
// @author	Gerald <gera2ld@163.com>
// @icon	https://s.gravatar.com/avatar/a0ad718d86d21262ccd6ff271ece08a3?s=80
// @version	1.0.3
// @description	Opera贴吧修复 - Gerald倾情打造
// @homepage	https://userscripts.org/scripts/show/153687
// @downloadURL	https://userscripts.org/scripts/source/153687.user.js
// @updateURL	https://userscripts.org/scripts/source/153687.meta.js
// @include	http://tieba.baidu.com/*
// @exclude	http://tieba.baidu.com/tb/*
// ==/UserScript==
function o(o,e,t){var r=o[e];r.hooked||(o[e]=function(){var o,e,t=this,r=arguments,n=r.callee,i=null,a=!1;for(n.hookStop=function(){a=!0},e=0;e<n.hook_before.length;e++)if(n.hook_before[e].apply(t,[n,r]),a)return i;for(i=n.hook_func.apply(t,r),e=0;e<n.hook_after.length;e++)if(o=n.hook_after[e].apply(t,[n,i,r]),void 0!==o&&(i=o),a)return i;return i},o[e].hook_func=r,r=o[e],r.hooked=!0,r.hook_after=[],r.hook_before=[]),o=r.hook_after,(e=t.after)&&(e.concat?r.hook_after=o.concat(e):o.push(e)),o=r.hook_before,(e=t.before)&&(e.concat?r.hook_before=o.concat(e):o.push(e))}function e(o,e){(o.mousedown||o.mouseup).call(o,e)}function t(){o(TED.EditorCore.prototype,"focus",{after:function(){this.editArea.scrollIntoView(),this.resumeRange()}}),o(TED.EditorCore.prototype,"getRange",{before:function(){var o=window.getSelection();if(!o.rangeCount){var e=document.createRange();e.setStartBefore(this.editArea.lastChild),o.addRange(e)}}})}function r(){function o(o,e){document.execCommand("forecolor",!1,document.queryCommandValue("forecolor").replace(/\s/g,"")==o?"#333333":e)}e($("div.tb-editor-toolbar .font_color").unbind(),function(){o("rgb(225,6,2)","#e10602")})}function n(){function e(o){o.innerHTML=o.innerHTML.replace(/<p>(.*?)(<br>)?<\/p>/gi,"$1<br>").replace(/<br>$/,"")}o(rich_postor._editor,"getHtml",{before:function(){e(this.editArea)}})}function i(){o(rich_postor._editor,"reLayout",{after:function(){$(this.editArea).find("img").each(function(o,e){(o=e.height)&&(e.height=Math.round(o))})}})}window.rich_postor&&rich_postor._editor&&window.PageData&&PageData.user.is_login&&(t(),r(),n(),i());