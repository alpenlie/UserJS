// ==UserScript==
// @name	Tieba Common
// @namespace	http://gera2ld.blog.163.com/
// @author	Gerald <gera2ld@163.com>
// @description	百度贴吧用户脚本公共库 - Gerald倾情打造
// ==/UserScript==

var $=unsafeWindow.$,PageData=unsafeWindow.PageData,utils;
if(!unsafeWindow.__ge_obj) {
	utils={
		delay:2000,		// 发贴间隔时间
		purl: 'http://imgsrc.baidu.com/forum/pic/item/438dd519ebc4b745241c6ae8cffc1e1788821598.jpg',
		hook: function(o,n,a) {
			var f=o[n];
			if(!f.hooked) {
				o[n]=function() {
					var t=this,a=arguments,f=a.callee,r=undefined,_r,i,stop=false;
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
		},
		addStyle: function(css) {
			var s=document.createElement('style');s.innerHTML=css||'';
			document.head.appendChild(s);if($) s=$(s);return s;
		},
		getObj: function(k,d) {
			var r=localStorage.getItem('ge_'+k),u=undefined,v=u;
			if(r) try{v=JSON.parse(r);}catch(e){}
			if(v==u&&d!=u) v=utils.setObj(k,d);
			return v;
		},
		setObj: function(k,v) {localStorage.setItem('ge_'+k,JSON.stringify(v));return v;},
		addButton: function(t,o,m,a) {	// Base Function
			if(!a) a={};
			if(m) {
				var i,k=a.keys;
				if(!k||!k.length) k=['mousedown','mouseup'];
				for(i=0;i<k.length;i++) if(o[k[i]]) {o[k[i]].call(o,m);break;}
			}
			t=$(t);
			if(a.after) o.insertAfter(t.children(a.after));
			else if(a.before) o.insertBefore(t.children(a.before));
			else o.appendTo(t);
			return o;
		},
		addTButton: function(o,m) {	// Add Toolbar Button
			var tb=$('div.tb-editor-toolbar'),l=tb.children(':last');
			if(l.position().left+l.outerWidth()>605) $('<div class=x>').appendTo(tb);
			return utils.addButton(tb,o,m);
		},
		addSButton: function(v) {	// Add Big Button [class=subbtn_bg]
			var b=$('<input type=button>').appendTo('.pt_submit').addClass('subbtn_bg');
			if(v) b.val(v);return b;
		},
		addPopup: function(E,b,i) {
			var p=$('<div class=ge_panel_p title="">').appendTo(E).click(function(e){
				e.stopPropagation();
				if(['A','BUTTON'].indexOf(e.target.tagName)>=0) e.preventDefault();
			}).hide();
			p.holder=E;
			p.arrow=$('<div class=ge_arrow>').appendTo(p).html('<span>◆</span><span>◆</span>');
			p.panel=$('<div class=ge_panel>').appendTo(p);
			p.onclose=function(){p.hide();$(document).unbind('click',p.onclose);};
			p.onopen=function(o1,o2,l){
				o1=E.offset();o2=p.button.offset();
				p.show();$(document).click(p.onclose);if(i) i(p);
				l=Math.min(o2.left-o1.left-50,$(document.body).innerWidth()-o1.left-p.panel.outerWidth()-20);
				p.css({left:l,bottom:E.innerHeight()-o2.top+o1.top});
				p.arrow.css({left:o2.left-o1.left-l});
			};
			p.ontoggle=function(e){
				e.preventDefault();p.button=$(e.target);
				if(p.is(':visible')) p.onclose(); else setTimeout(p.onopen,0);
			};
			if(b) b.click(p.ontoggle);
			return p;
		},
		bindProp: function(obj,prop,key,def,func,evt) {
			obj.prop(prop,utils.getObj(key,def));
			if(!evt) evt=['change'];
			evt.forEach(function(i){obj.bind(i,function(e){utils.setObj(key,this[prop]);if(func) obj.each(function(i,o){func.call(o,e);});});});
			return obj;
		},
		list: function(lkey,ikey,dnew,def) {	// def===true: not null
			var t={};t.last=0;
			t.load=function(i,nosave){
				if(i==undefined) i=ikey?utils.getObj(ikey,0):0;
				if(i<0||!t.length) i=0; else if(i>=t.length) i=t.length-1;
				if(ikey&&!nosave) utils.setObj(ikey,i);
				t.cur=t.list[t.last=i];
				return t;
			};
			t.push=function(d){if(!d) d=dnew();t.list.push(d);t.save();return t.length-1;};
			t.pop=function(i){var o=t.list.splice(i,1)[0];t.save();t.load(i);return o;}
			t.save=function(){if(lkey) utils.setObj(lkey,t.list);if(ikey) utils.setObj(ikey,t.last);};
			t.list=lkey?utils.getObj(lkey,[]):[];
			t.__defineGetter__('length',function(){return t.list.length;});
			if(!t.length&&def) {if(def.concat) {t.list=def.concat();t.save();} else t.push();}
			return t;
		},
	};
	function ge_popup(){
		var t=this;t.dialog=document.createElement('div');
		t.dialog.id='ge_popup';document.body.appendChild(t.dialog);
		t.callback=function(){t.hide();};
		t.dialog.addEventListener('click',function(e){e.stopPropagation();},false);
	}
	ge_popup.prototype={
		show:function(o){
			var d=this.dialog;this.obj=o;
			d.className=o.className||'';
			d.innerHTML=o.html;
			if(o.init) o.init(d);
			d.style.display='block';
			d.style.top=(innerHeight-d.offsetHeight)/2+'px';
			d.style.left=(innerWidth-d.offsetWidth)/2+'px';
			document.addEventListener('click',this.callback,false);
		},
		hide:function(){
			var o=this.obj,d=this.dialog;
			if(o.dispose) o.dispose(d);
			d.style.display='none';
			document.removeEventListener('click',this.callback,false);
		},
	};
	utils.popup=new ge_popup();
	unsafeWindow.__ge_obj={
		utils:utils,
	};
	utils.addStyle('\
.x{clear:both}\
#ge_popup{z-index:10006;font:normal normal 400 12px/18px 宋体;position:fixed;background:white;border:1px solid silver;box-shadow:5px 5px 7px #333;text-align:left;}\
.ge_mask{background:#000;opacity:0.6;position:fixed;top:0;bottom:0;left:0;right:0;z-index:999;display:none;}\
.ge_panel_p{position:relative;z-index:888;height:1px;}\
.ge_panel{position:absolute;background:#eee;border:1px solid black;padding:10px;border-radius:10px;z-index:888;bottom:0;}\
.ge_arrow{position:relative;}\
.ge_arrow>span{position:absolute;line-height:1;bottom:-0.5em;}\
.ge_arrow>span:last-child{color:#eee;bottom:-0.4em;z-index:999;}\
.ge_sbtn{background:#77f;color:white;border-radius:3px;border:1px solid;border:none;margin:2px;cursor:pointer;text-align:center;}\
span.ge_sbtn{padding:2px 3px;}\
.ge_disabled{background:gray;cursor:default;}\
.ge_rsep{margin-right:10px;}\
.ge_opt{padding:20px;border-radius:5px;}\
.ge_opt fieldset{border:1px solid silver;border-radius:5px;padding:5px;}\
.ge_opt textarea{min-height:100px;}\
');
	if($) $('.tb-editor-editarea-wrapper').addClass('x');
} else utils=unsafeWindow.__ge_obj.utils;

function notice(cur,msg){
	if(GM_getValue('notice',0)<cur){alert(msg);GM_setValue('notice',cur);}
}
