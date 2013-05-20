// ==UserScript==
// @name	Tieba Multiuser
// @namespace	http://gera2ld.blog.163.com/
// @author	Gerald <gera2ld@163.com>
// @icon	http://s.gravatar.com/avatar/a0ad718d86d21262ccd6ff271ece08a3?s=80
// @version	1.1.3
// @description	百度贴吧马甲切换
// @homepage	http://userscripts.org/scripts/show/154072
// @downloadURL	https://userscripts.org/scripts/source/154072.user.js
// @updateURL	https://userscripts.org/scripts/source/154072.meta.js
// @include	http://tieba.baidu.com/*
// @grant	GM_getValue
// @grant	GM_setValue
// @grant	GM_addStyle
// ==/UserScript==
function e(e,t){var n=new Date;e?n.setTime(16094e8):e="",document.cookie="BDUSS="+e+";domain=baidu.com;path=/;expires="+n.toGMTString(),"function"==typeof t?t():"string"==typeof t?location.replace(t):location.reload()}function t(){GM_setValue("ge_users",JSON.stringify(i))}function n(e){e.target.parentNode.id=="com_userbar"&&a(e.target)}function r(){var e=GM_getValue("ge_users");e||(e=localStorage.getItem("ge_users"),e&&localStorage.removeItem("ge_users")),i=e?JSON.parse(e):{};var r=unsafeWindow.PageData;if(r.user&&r.user.is_login&&r.user.name){var o=document.cookie.match(/BDUSS=(.*?)(;|$)/);o&&(i[r.user.name]=o[1],t())}GM_addStyle("#ge_users>li{position:relative;cursor:pointer;}#ge_users span{background:#77f;color:white;border-radius:3px;border:1px solid;border:none;margin:2px;cursor:pointer;text-align:center;padding:0 2px;}"),document.body.addEventListener("DOMNodeInserted",n,!0)}function o(n){n.preventDefault(),n=n.target;var r;n.tagName=="A"?(r=null,/^\/i\//.test(location.pathname)&&(r="/"),n.nextSibling?e(i[n.innerText||n.textContent],r):n.innerHTML=="未登录状态"?e():n.innerHTML=="添加马甲"&&unsafeWindow.TbCom.process("User","buildLoginFrame")):n.tagName=="SPAN"&&(r=n.previousSibling,delete i[r.innerText||r.textContent],setTimeout(t,0),(r=r.parentNode).parentNode.removeChild(r))}function a(e){document.body.removeEventListener("DOMNodeInserted",n,!0);var t=document.createElement("li");e.insertBefore(t,e.firstChild),t.className="split";var r=document.createElement("li");e.insertBefore(r,t),r.innerHTML="<a href=# class=u_arrow>马甲</a>",r.onmouseover=function(){t.style.display="block"},r.onmouseout=function(){t.style.display="none"},t=document.createElement("div"),r.appendChild(t),t.className="u_ddl",t.setAttribute("style","display:none;width:40px;top:-2px;"),e=document.createElement("div"),t.appendChild(e),e.className="u_ddl_con u_ddl_con_top";var a=document.createElement("ul");e.appendChild(a),a.id="ge_users",a.onclick=o,e=document.createElement("li"),e.innerHTML="<a href=#>未登录状态</a>",a.appendChild(e);for(var d in i)d?(e=document.createElement("li"),e.innerHTML="<a href=#>"+d.replace(/&/g,"&amp;").replace(/</g,"&lt;")+'</a><span style="position:absolute;right:0;top:0;">删除</span>',a.appendChild(e)):delete i[d];e=document.createElement("li"),e.innerHTML="<a href=#>添加马甲</a>",a.appendChild(e)}var i;document.querySelector("a[param=word]")&&r();