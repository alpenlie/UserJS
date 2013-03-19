// ==UserScript==
// @name	Baidu Multiuser
// @namespace	http://gera2ld.blog.163.com/
// @author	Gerald <gera2ld@163.com>
// @icon	https://s.gravatar.com/avatar/a0ad718d86d21262ccd6ff271ece08a3?s=80
// @version	1.2
// @description	百度马甲切换
// @homepage	https://userscripts.org/scripts/show/160577
// @downloadURL	https://userscripts.org/scripts/source/160577.user.js
// @updateURL	https://userscripts.org/scripts/source/160577.meta.js
// @match	*://*.baidu.com/*
// @include	*://*.baidu.com/*
// @grant	GM_getValue
// @grant	GM_setValue
// @grant	GM_addStyle
// @grant	GM_openInTab
// ==/UserScript==

function notice(cur,msg){
	var n=GM_getValue('notice')||0;
	if(n<cur){alert(msg);GM_setValue('notice',cur);}
}
function switchUser(s,p){
	var d=new Date();if(s) d.setTime(16094e8); else s='';
	document.cookie='BDUSS='+s+';domain=baidu.com;path=/;expires='+d.toGMTString();
	if(typeof p=='function') p();
	else if(typeof p=='string') location.replace(p);
	else location.reload();
}
function initLoc(){
		gu.right=gu._right=gu.parentNode.offsetWidth-gu.offsetWidth-gu.offsetLeft;
		gu.top=gu._top=gu.offsetTop;
}
function saveUsers(){GM_setValue('ge_users',JSON.stringify(users));}
function saveLoc(){GM_setValue('ge_users_loc',JSON.stringify({right:gu.right,top:gu.top}));}
function userManage(e,p,o){
	e.preventDefault();
	o=e.target;
	if(o.tagName=='A') {
		o=o.parentNode;p=o.parentNode;
		if(o==p.firstChild) switchUser();
		else if(o==p.lastChild) GM_openInTab('https://passport.baidu.com/v2/?login&tpl=mn&u='+encodeURIComponent('http://www.baidu.com/'));	// 方便处理
		else {
			o=o.firstChild;
			switchUser(users[o.innerText||o.textContent],/^\/i\//.test(location.pathname)&&'/');
		}
	} else if(o.tagName=='SPAN') {
		p=o.previousSibling;delete users[p.innerText||p.textContent];
		setTimeout(saveUsers,0);p=p.parentNode;p.parentNode.removeChild(p);
	}
}
function locate(l){
	if(l) {
		gu.right=l&&!isNaN(l.right)?l.right:100;
		gu.top=l&&!isNaN(l.top)?l.top:100;
	}
	gu.style.right=gu.right+'px';
	gu.style.top=gu.top+'px';
}
function mousemove(e){
	e.preventDefault();e.stopPropagation();
	var l={right:gu._right+gu.x-e.pageX,top:gu._top+e.pageY-gu.y};
	locate(l);
}
function pinUpdate(){
	symbol.innerHTML=gu.pin?'●':'○';
	symbol.setAttribute('title',gu.pin?'固定在页面上':'固定在屏幕上');
	gu.style.position=gu.pin?'absolute':'';
}
function pin(){
	initLoc();
	if(gu.pin)	// fixed => absolute
		gu.top+=window.pageYOffset;
	else	// absolute => fixed
		gu.top-=window.pageYOffset;
	pinUpdate();
	locate();
	saveLoc();
}
function showFloat(){
	gu.style.display=gu.style.display==''?'none':'';
	GM_setValue('float',gu.style.display);
}
function buildMenu(d){
	GM_addStyle('\
#ge_users{display:block;position:fixed;padding:10px;text-align:left;}\
#ge_users,.ge_users{z-index:10006;font:normal normal 400 12px/18px 宋体;}\
#ge_users>span{background:white;color:blue;border-radius:3px;border:1px solid #c0c0c0;padding:2px;cursor:pointer;}\
#ge_users>div{position:relative;margin-top:3px;}\
ul.ge_users{display:none;position:absolute;width:120px;background:white;border:1px solid silver;max-height:400px;overflow-x:hidden;overflow-y:auto;}\
ul.ge_users>li{position:relative;display:block;padding:2px 20px 4px 6px;}\
ul.ge_users>li:hover{background:lightgray;}\
ul.ge_users a{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}\
ul.ge_users span{position:absolute;top:0;right:0;color:white;background:#77f;border-radius:3px;margin:2px;cursor:pointer;padding:2px;}\
ul.ge_menu{position:fixed;box-shadow:5px 5px 7px #333;}\
');
	gu=document.createElement('div');gu.id='ge_users';
	gu.innerHTML='<span>马甲<span></span></span><div><ul class=ge_users></ul></div>';
	gu.style.display=GM_getValue('float')||'';
	ul=gu.querySelector('ul');ul.onclick=userManage;
	symbol=gu.firstChild.lastChild;
	gu.pin=!!GM_getValue('ge_pin');pinUpdate();
	symbol.onclick=function(){GM_setValue('ge_pin',gu.pin=!gu.pin);pin();};
	gu.onmouseover=function(e){
		if(this.contains(e.relatedTarget)) return;
		ul.style.display='block';
		if(gu.offsetLeft+gu.firstChild.offsetLeft+ul.offsetWidth<=document.body.offsetWidth) ul.style.pixelLeft=0;
		else ul.style.pixelLeft=document.body.offsetWidth-gu.offsetLeft-gu.firstChild.offsetLeft-ul.offsetWidth;
	};gu.onmouseout=function(e){if(!this.contains(e.relatedTarget)) ul.style.display='';};
	try{d=JSON.parse(GM_getValue('ge_users_loc'));}catch(e){d={};}
	document.body.appendChild(gu);locate(d);gu.moving=false;
	gu.firstChild.onmousedown=function(e){
		e.preventDefault();e.stopPropagation();
		if(e.target!=gu.firstChild||gu.moving) return;gu.moving=true;
		initLoc();
		gu.x=e.pageX;
		gu.y=e.pageY;
		document.addEventListener('mousemove',mousemove,false);
	};
	gu.onmouseup=function(e){
		if(!gu.moving) return;gu.moving=false;
		e.preventDefault();e.stopPropagation();
		document.removeEventListener('mousemove',mousemove,false);
		saveLoc();
	};
	d=['<li><a href=#>未登录状态</a></li>'];
	for(var i in users) {
		if(!i) {delete users[i];continue;}
		d.push('<li><a href=#>'+i.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</a><span>删</span></li>');
	}
	d.push('<li><a href=#>添加马甲</a></li>');
	ul.innerHTML=d.join('');
	menu=document.createElement('ul');
	menu.className='ge_users ge_menu';
	menu.onclick=userManage;
	document.body.appendChild(menu);
}
function hideMenu(e){
	if(menu.contains(e.target)) return;
	menu.style.display='';
	document.removeEventListener('mousedown',hideMenu,false);
}
function showMenu(){
	menu.innerHTML=ul.innerHTML;
	menu.style.display='block';
	menu.style.top=(innerHeight-menu.offsetHeight)/2+'px';
	menu.style.left=(innerWidth-menu.offsetWidth)/2+'px';
	document.addEventListener('mousedown',hideMenu,false);
}
function updateData(d,m){
	if((d=unsafeWindow.PageData)&&d.user&&d.user.is_login&&d.user.name) d=d.user.name;	// 贴吧
	else if(d=document.getElementById('s_username_top')) d=d.innerText||d.textContent;	// 百度首页
	if(d) {
		m=document.cookie.match(/BDUSS=(.*?)(;|$)/);
		if(m) {users[d]=m[1];saveUsers();}
	}
}
if(window.top===window){
	var menu,users,gu,ul,symbol;
	users=GM_getValue('ge_users');if(users) users=JSON.parse(users); else users={};
	updateData();
	buildMenu();
	GM_registerMenuCommand('显示/隐藏马甲悬浮图标',showFloat);
	GM_registerMenuCommand('切换马甲（Shift+M）',showMenu);
	window.addEventListener('keydown',function(e){
		if(e.target==document.body){
			if(e.shiftKey&&e.keyCode==77) showMenu();
			else return;
			e.preventDefault();
		}
	},false);
	notice(1,'\
欢迎使用百度马甲切换脚本！\n\
功能特点：\n\
1. “马甲”可以拖动。\n\
2. 切换固定方式：固定在页面（可随页面滚动）或固定在屏幕。\n\
3. 扩展菜单中选择显示或隐藏“马甲”悬浮图标。\n\
4. 扩展菜单中呼出或使用快捷键Shift+M呼出马甲切换面板。\n\
　　　　　　　　　　　--Gerald <gera2ld@163.com>');
}
