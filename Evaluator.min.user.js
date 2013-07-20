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
function n(n){var e=[];return n.forEach(function(n){e.push(escape(n[0])+"="+escape(n[1]))}),e.join("&")}function e(e,t){var i=new XMLHttpRequest;i.open("POST","student!insertPj.action"),i.onload=t,i.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),i.send(n(e))}var t=document.getElementById.bind(document),i=t("kcpjform").querySelectorAll("input[idvalue]"),o=document.createElement("button");t("Position").appendChild(o),i.length?(o.innerHTML="自动评优",o.onclick=function(){var n=0;o.disabled=!0,o.innerHTML="正在评优...",Array.prototype.forEach.call(i,function(t){function i(){t.innerHTML="("+ ++l+"/"+a+")",--n||(o.innerHTML="评优完成")}function r(n,e,t){return e.forEach(function(e){n.push(["ids","{'zbdm':'"+e+"','zbfz':'"+t+"'}"])}),n}var c=(0,eval)("("+t.getAttribute("idvalue")+")");t=t.parentNode.previousElementSibling,t.innerHTML+='<span style="color:red;margin-left:20px;"></span>',t=t.lastChild,c.SKJS=c.SKJS?c.SKJS.split(","):[],c.FDJS=c.FDJS?c.FDJS.split(","):[];var a=c.SKJS.length+c.FDJS.length,l=0,u=[["xkkh",c.XKKH],["kcdm",c.KCDM],["pyxx",""]];n+=a,c.SKJS.forEach(function(n){n=n.split("@"),n=u.concat([["zgh",n[0]],["fldm",1]]),e(r(n,["0101","0102","0103","0104","0105","0107","0201","0202","0301","0401"],6),i)}),c.FDJS.forEach(function(n){n=n.split("@"),n=u.concat([["zgh",n[0]],["fldm",2]]),e(r(n,["1101","1102","1103","1105","1201","1202","1301","1401"],6),i)})})}):(o.innerHTML="尚未开通",o.disabled=!0);