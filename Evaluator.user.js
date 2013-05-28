// ==UserScript==
// @name	正方教务系统教学评估
// @namespace	http://gera2ld.blog.163.com/
// @author	Gerald <gera2ld@163.com>
// @version	1.0
// @updateURL	https://raw.github.com/gera2ld/UserJS/master/Evaluator.min.user.js
// @downloadURL	https://raw.github.com/gera2ld/UserJS/master/Evaluator.min.user.js
// @include	http://*/student!queryPjkc.action
// ==/UserScript==

/* @preserve
 * 如果你使用了此脚本，表示你同意以下内容：
 *  Fuck PUMC.
 *  这么丑陋的代码还用jQuery简直是对技术的玷污。
 *  没有技术也就算了，还这么丑。
 *  鄙视这个网站，鄙视杭州正方软件公司这个山寨玩意儿。
 */

function $(i){return document.getElementById(i);}
function URLEncode(o){
	var d=[];
	o.forEach(function(i){d.push(escape(i[0])+'='+escape(i[1]));});
	return d.join('&');
}
function postData(data,callback){
	var xhr=new XMLHttpRequest();
	xhr.open('POST','student!insertPj.action');
	xhr.onload=callback;
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.send(URLEncode(data));
}
var all=$('kcpjform').querySelectorAll('input[idvalue]');
var b=document.createElement('button');
$('Position').appendChild(b);
if(!all.length){
	b.innerHTML='尚未开通';
	b.disabled=true;
} else {
	b.innerHTML='自动评优';
	b.onclick=function(){
		var count=0;b.disabled=true;b.innerHTML='正在评优...';
		Array.prototype.forEach.call(all,function(obj){
			var i=(0,eval)('('+obj.getAttribute('idvalue')+')');
			obj=obj.parentNode.previousElementSibling;
			obj.innerHTML+='<span style="color:red;margin-left:20px;"></span>';
			obj=obj.lastChild;
			i.SKJS=i.SKJS?i.SKJS.split(','):[];
			i.FDJS=i.FDJS?i.FDJS.split(','):[];
			count+=i.SKJS.length+i.FDJS.length;
			var n=i.SKJS.length+i.FDJS.length,f=0;
			function callback(){
				obj.innerHTML='('+(++f)+'/'+n+')';
				if(!--count) b.innerHTML='评优完成';
			}
			function pushData(d,l,s){
				l.forEach(function(i){d.push(['ids',"{'zbdm':'"+i+"','zbfz':'"+s+"'}"]);});
				return d;
			}
			var data=[['xkkh',i.XKKH],['kcdm',i.KCDM],['pyxx','']];
			i.SKJS.forEach(function(j){
				j=j.split('@');
				j=data.concat([['zgh',j[0]],['fldm',1]]);
				postData(pushData(j,['0101','0102','0103','0104','0105','0107','0201','0202','0301','0401'],6),callback);
			});
			i.FDJS.forEach(function(j){
				j=j.split('@');
				j=data.concat([['zgh',j[0]],['fldm',2]]);
				postData(pushData(j,['1101','1102','1103','1105','1201','1202','1301','1401'],6),callback);
			});
		});
	};
}
