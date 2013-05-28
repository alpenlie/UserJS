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

function switchUser(s,p){
	var d=new Date();if(s) d.setTime(16094e8); else s='';
	document.cookie='BDUSS='+s+';domain=baidu.com;path=/;expires='+d.toGMTString();
	if(typeof p=='function') p();
	else if(typeof p=='string') location.replace(p);
	else location.reload();
}
function save(){GM_setValue('ge_users',JSON.stringify(users));}
function work(e){if(e.target.parentNode.id=='com_userbar') initTieba(e.target);}
function init(){
	var d=GM_getValue('ge_users');
	if(!d){
		d=localStorage.getItem('ge_users');
		if(d) localStorage.removeItem('ge_users');
	}
	if(d) users=JSON.parse(d); else users={};
	var p=unsafeWindow.PageData;
	if(p.user&&p.user.is_login&&p.user.name) {
		var c=document.cookie.match(/BDUSS=(.*?)(;|$)/);
		if(c) {users[p.user.name]=c[1];save();}
	}
	GM_addStyle('\
#ge_users>li{position:relative;cursor:pointer;}\
#ge_users span{background:#77f;color:white;border-radius:3px;border:1px solid;border:none;margin:2px;cursor:pointer;text-align:center;padding:0 2px;}\
');
	document.body.addEventListener('DOMNodeInserted',work,true);
}
function userClick(e){
	e.preventDefault();
	e=e.target;var p;
	if(e.tagName=='A') {
		p=null;
		if(/^\/i\//.test(location.pathname)) p='/';
		if(e.nextSibling) switchUser(users[e.innerText||e.textContent],p);
		else if(e.innerHTML=='未登录状态') switchUser();
		else if(e.innerHTML=='添加马甲') unsafeWindow.TbCom.process("User", "buildLoginFrame");
	} else if(e.tagName=='SPAN') {
		p=e.previousSibling;
		delete users[p.innerText||p.textContent];
		setTimeout(save,0);(p=p.parentNode).parentNode.removeChild(p);
	}
}
function initTieba(c){
	document.body.removeEventListener('DOMNodeInserted',work,true);
	var b=document.createElement('li');c.insertBefore(b,c.firstChild);b.className='split';
	var a=document.createElement('li');c.insertBefore(a,b);a.innerHTML='<a href=# class=u_arrow>马甲</a>';
	a.onmouseover=function(){b.style.display='block';};a.onmouseout=function(){b.style.display='none';};
	b=document.createElement('div');a.appendChild(b);b.className='u_ddl';b.setAttribute('style','display:none;width:40px;top:-2px;');
	c=document.createElement('div');b.appendChild(c);c.className='u_ddl_con u_ddl_con_top';
	var ul=document.createElement('ul');c.appendChild(ul);
	ul.id='ge_users';ul.onclick=userClick;
	c=document.createElement('li');c.innerHTML='<a href=#>未登录状态</a>';ul.appendChild(c);
	for(var i in users) {
		if(!i) {delete users[i];continue;}
		c=document.createElement('li');
		c.innerHTML='<a href=#>'+i.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</a><span style="position:absolute;right:0;top:0;">删除</span>';
		ul.appendChild(c);
	}
	c=document.createElement('li');c.innerHTML='<a href=#>添加马甲</a>';ul.appendChild(c);
}
var users;
if(document.querySelector('a[param=word]')) init();
