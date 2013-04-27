// ==UserScript==
// @name	Tieba Advanced
// @namespace	http://gera2ld.blog.163.com/
// @author	Gerald <gera2ld@163.com>
// @icon	https://s.gravatar.com/avatar/a0ad718d86d21262ccd6ff271ece08a3?s=80
// @version	2.5.9
// @description	贴吧增强 - Gerald倾情打造
// @homepage	https://userscripts.org/scripts/show/152918
// @updateURL	https://userscripts.org/scripts/source/152918.meta.js
// @downloadURL	https://userscripts.org/scripts/source/152918.user.js
// @include	http://tieba.baidu.com/*
// @exclude	http://tieba.baidu.com/tb/*
// @require	https://raw.github.com/gera2ld/UserJS/master/lib/TiebaCommon.min.user.js
// ==/UserScript==

// 提醒页面强制解码
function initNoticeDecode() {
	if(!/^\/i\/\d+/.test(location.pathname)) return;
	var s=document.evaluate('.//p/text()|.//a/text()|.//div/text()|.//span/text()',
			document.getElementById('content'),null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null),
		i,e,d=document.createElement('p');
	for(i=0;i<s.snapshotLength;i++){
		e=s.snapshotItem(i);
		if(e.data) {
			d.innerHTML=e.data.replace(/&\w*?\.\.\.$/,'...');
			e.data=d.innerText||d.textContent;
		}
	}
	delete d;
}

// 召唤列表
function callList() {
	return utils.list('calllist','calllast',function(){return {name:'新列表',data:[]};},true).load();
}

// DataPanel @列表
function initPanelCall() {
	if(!$('#concern_btn').css('float','right').length) return;
	function updateCSS(e) {$(e).css('background-position',j<0?'0 -20px':'0 -41px');}
	var o=callList(),u=PageData.itieba.creator.name,j=o.cur.data.indexOf(u);
	updateCSS($('<a href=# style="float:right;width:64px;height:21px;background:url('+utils.purl+') no-repeat scroll 0 -20px">').prependTo('#care_btn_wrap').click(function(){
		if(j<0) {j=o.cur.data.length;o.cur.data.push(u);}
		else {for(;j<o.cur.data.length-1;j++) o.cur.data[j]=o.cur.data[j+1];o.cur.data.pop();j=-1;}
		o.save();
		updateCSS(this);
	}));
}

var mask=$('<div class=ge_mask>').appendTo('body');	// Mask layer
// Arrays for Lzl initiation
var lzl_buttons=[],lzl_styles=[],lzl_filters=[],lzl_efilters=[],lzl_init=[],lzl_fix=[]; // 新增楼中楼按钮
utils.addPButton=function(o,c,m,a) {
	lzl_styles=lzl_styles.concat(c);o.addClass(c[0]);
	if(!a) a={};if(!a.after) a.after='.lzl_panel_submit';
	lzl_buttons.push([o,m,a]);
	return o;
};

// 初始化贴子管理面板
function initPostManager() {
	if(utils.postManager) return;
	utils.addStyle('.tmedit{border:1px solid;overflow:auto;background:transparent;}.fleft{float:left;}.fright{float:right;}');
	var tm=$('<div style="position:fixed;display:none;left:100px;right:100px;background:lightgray;color:#333;padding:20px;border:2px solid #ccc;border-radius:20px;shadow:0 1px 5px #333;z-index:999;}">').appendTo('body');
	tm.listItems=function(t,e,x,s){
		var d=[];
		if(x) d.push('<option>'+x+'</option>');
		t.list.forEach(function(i){d.push('<option>'+i.name+'</option>');});
		e.html(d.join(''));
		if(s) {x=x?1:0;t.load(s-x);e.prop('selectedIndex',t.last+x);}
	};
	tm.newItem=function(e,d) {
		tm.list.load(tm.list.length-1);
		if(!tm.list.cur||tm.list.cur.data) {
			tm.list.load(tm.list.push(d));
			$('<option>').appendTo(ti).text(tm.list.cur.name);
		} else {
			tm.list.cur.type=d.type;
			tm.list.cur.data=d.data;
		}
		$(ti).prop('selectedIndex',tm.list.last);
		editItem();
	};
	function text(o,t){
		if(o[0]) o=o[0];
		var k='innerText' in o?'innerText':'textContent';
		if(typeof t=='string') o[k]=t;
		else return o[k];
	}
	var p=document.createElement('p');
	function editItem(e) {
		if(e) tm.list.load(ti.prop('selectedIndex'),1);
		var t=tm.list.cur;
		tc.prop('disabled',!t);
		if(!t) t={type:'s',data:''};
		tt.val(t.type);
		if(t.type=='j'||t.type=='h') tc.val(t.data);
		else {p.innerHTML=t.data;tc.val(text(p));}
		liveShow();
	}
	function saveItem(e) {
		var t=tm.list.cur;if(!t) return;
		switch(t.type=tt.val()) {
			case 'j':try{eval(t.data=tc.val());}catch(e){return;}break;
			case 's':text(p,tc.val());t.data=p.innerHTML;break;
			case 'H':t.data=tc.val();break;
			default:tv.find('img').each(function(i,e){
								if(e.width) e.setAttribute('width',e.width);
								if(e.height) e.setAttribute('height',e.height);
							});
							tc.val(t.data=tv.html());
		}
	}
	function liveShow(e) {
		var t=tt.val(),s;
		if(t=='j') try{s=eval(tc.val());}catch(e){s='<font color=red>JS代码有误！</font>';}
		else s=tc.val();
		if(t=='s') text(tv,s); else {
			if(t=='H') s=s.split('\n').shift();
			tv.html(s);
		}
	}
	tm.loadPanel=function(t,n,c) {
		tm.list=t;tn.text(n);tm.callback=c;
		tm.listItems(t,ti);editItem(1);
		mask.fadeIn('fast',function() {
			tm.css({top:innerHeight+'px',display:'block'}).animate({top:'100px',bottom:'20px'},300,function(){
				$('.tmedit').height($(this).height()-60).width($(this).width()/2-20);
			});
		});
	};
	var tl=$('<div class=fleft>').appendTo(tm),
			tn=$('<strong class=ge_rsep>').appendTo(tl),
			ti=$('<select>').appendTo(tl).change(editItem);
	$('<span class="ge_sbtn ge_rsep">改名</span>').appendTo(tl).click(function(e) {
		if(!tm.list.cur) return;
		var t=prompt('修改名称：',tm.list.cur.name);
		if(t) {tm.list.cur.name=t;ti.children('option:eq('+tm.list.last+')').text(t);}
	});
	var tt=$('<select>').appendTo($('<label>类型：</label>').appendTo(tl)).html('<option value="s" checked>普通字串</option><option value="h">HTML代码</option><option value="H">HTML随机</option><option value="j">JS代码</option>').change(function(){liveShow();saveItem();});
	$('<a href=http://gera2ld.blog.163.com/blog/static/18801729620132293204924/ target=_blank title="帮助">(?)</a>').appendTo(tl);
	var tr=$('<div class=fright></div>').appendTo(tm);
	$('<span class=ge_sbtn>添加</span>').appendTo(tr).click(tm.newItem);
	$('<span class=ge_sbtn>删除</span>').appendTo(tr).click(function() {
		var l=tm.list.last;tm.list.pop(l);ti.children().eq(l).remove();editItem(1);
	});
	$('<span class=ge_sbtn>关闭</span>').appendTo(tr).click(function() {
		tm.list.save();if(tm.callback) tm.callback();
		tm.animate({top:innerHeight+'px'},300,function() {$(this).hide();mask.fadeOut('fast');});
	});
	$('<div class=x></div><div><label class=fleft>编辑框</label><label class=fright>预览框</label></div><div class=x></div>').appendTo(tm);
	var tc=$('<textarea class="tmedit fleft">').appendTo(tm).blur(saveItem).keyup(liveShow).mouseup(liveShow);
	var tv=$('<div class="tmedit fright">').appendTo(tm);
	$('<div class=x>').appendTo(tm);
	utils.postManager=tm;
}
// 灌水：原尾巴功能
function initAddWater() {
	initPostManager();
	var tails=utils.list('tails',null,function(){return {type:'s',data:'',name:'新尾巴'};},[
		{type:'j',name:'UA',data:'"——我喂自己袋盐<br>&gt;&gt;"+navigator.userAgent'},
		{type:'h',name:'求妹纸',data:'<img changedsize="true" pic_type="0" class="BDE_Image" src="http://imgsrc.baidu.com/forum/w%3D580/sign=6ca77dcee5dde711e7d243fe97edcef4/b03533fa828ba61e111605e44134970a314e5905.jpg" width="560" height="11"><br><img unselectable="on" pic_type="" class="BDE_Smiley" src="http://static.tieba.baidu.com/tb/editor/images/jd/j_0010.gif" width="40" height="40">求妹纸~'},
	]).load(),water=utils.list('water',null,function(){return {type:'s',data:'',name:'新水贴'};},[
		{type:'s',name:'打酱油',data:'我是打酱油的~'},
	]).load();
	function initTails(){utils.postManager.listItems(tails,ti,'随机',utils.getObj('tailindex',1));}
	function initWater(){utils.postManager.listItems(water,wi,'随机',utils.getObj('waterindex',0));}
	function getItem(t,s){
		var l=s.prop('selectedIndex'),L=t.length;if(!L) return;
		if(!l) l=Math.floor(Math.random()*L); else l--;
		t=t.list[l];var d=t.data;
		if(t.type=='j') d=eval(d);
		else if(t.type=='H') {d=d.split('\n');d=d[Math.floor(Math.random()*d.length)];}
		return d;
	}
	var op=utils.addPopup($('#edit_parent'),utils.addSButton('灌水')).panel;
	$('<div class=ge_sbtn style="cursor:default">智能灌水</div>').appendTo(op);
	var ti=$('<select class=ge_rsep>').appendTo($('<label>尾巴：</label>').appendTo(op)).change(function(e){utils.setObj('tailindex',this.selectedIndex);});
	$('<span class=ge_sbtn>管理</span>').appendTo(op).click(function(e){utils.postManager.loadPanel(tails,'尾巴管理',initTails);});
	$('<br>').appendTo(op);
	var tail=utils.bindProp($('<input type=checkbox>').prependTo($('<label class=ge_rsep>自动附加尾巴</label>').appendTo(op)),'checked','usetail',true);
	$('<br>').appendTo(op);
	$('<span class=ge_sbtn>').html('存为新尾巴').appendTo(op).click(function(e){
		utils.postManager.loadPanel(tails,'尾巴管理',initTails);
		utils.postManager.newItem(e,{type:'h',name:'新尾巴',data:unsafeWindow.rich_postor._editor.editArea.innerHTML});
	});
	$('<hr>').appendTo(op);
	var wi=$('<select class=ge_rsep>').appendTo($('<label>水贴：</label>').appendTo(op)).change(function(e){utils.setObj('waterindex',this.selectedIndex);});
	$('<span class=ge_sbtn>管理</span>').appendTo(op).click(function(e){utils.postManager.loadPanel(water,'水贴管理',initWater);});
	$('<br>').appendTo(op);
	$('<span class=ge_sbtn>').html('存为新水贴').appendTo(op).click(function(e){
		utils.postManager.loadPanel(water,'水贴管理',initWater);
		utils.postManager.newItem(e,{type:'h',name:'新水贴',data:unsafeWindow.rich_postor._editor.editArea.innerHTML});
	});
	$('<span class=ge_sbtn>').html('载入').appendTo(op).click(function(e){
		unsafeWindow.rich_postor._editor.execCommand('inserthtml',getItem(water,wi));
	});
	$('<span class=ge_sbtn>').html('发表').appendTo(op).click(function(e){
		unsafeWindow.rich_postor._editor.editArea.innerHTML=getItem(water,wi);
		unsafeWindow.rich_postor._submit();
	});
	var tailed=false;
	utils.hook(unsafeWindow.rich_postor._editor,'filteSubmitHTML',function(){
		var e=this.editArea,t=getItem(tails,ti);
		if(!tail.prop('checked')||!t||tailed) return;
		$(e).append('<br><br>'+t);tailed=true;
	});
	initTails();initWater();
}
// 保留开头和末尾的空格
function initSpaceKeep() {
	function fixSpace(c) {return c.replace(/^&nbsp;/,'　').replace(/&nbsp;$/,' 　');}
	// 主编辑框
	utils.hook(unsafeWindow.rich_postor._editor,'getHtml',null,fixSpace);
	// 楼中楼
	lzl_filters.push(fixSpace);
}
// 空格强制显示
function initSpaceFix() {
	// 强制显示空格
	$('div.d_post_content').each(function(i,e) {
		var s=document.evaluate('.//text()',e,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
		for(i=0;i<s.snapshotLength;i++){
			e=s.snapshotItem(i);
			if(e.data) e.data=e.data.replace(/  /g,'\xa0 ').replace(/  /g,'\xa0 ').replace(/^ (.)/,'\xa0$1');
		}
	});
}
// 召唤术增强
function initCall() {
	var c=callList(),pl,sl,be,bs,E=$('#edit_parent');
	utils.addStyle('\
#callList{border:1px solid;height:125px;overflow:auto;background:white;width:380px;margin:0 auto;}\
#callList a{padding:2px;border-radius:2px;margin:2px;display:inline-block;}\
#callList a.selected{background:limegreen;color:white}\
.tb-editor-toolbar .call_list,.lzl_panel_call{background:url("'+utils.purl+'") no-repeat scroll transparent -66px -20px;height:20px;width:22px;}\
.tb-editor-toolbar .call_list{margin-left:3px;margin-top:12px;padding-left:0;}\
');
	function newList(e) {
		c.load(c.push());$('<option>').appendTo(sl).text(c.cur.name);
		sl.prop('selectedIndex',c.last);
		editList(e);
	}
	function editList(e) {
		if(e) c.load(sl.prop('selectedIndex')); else sl.prop('selectedIndex',c.last);
		pl.empty();
		c.cur.data.forEach(function(i){$('<a href=#>').html(i).appendTo(pl);});
		pl.prop('contenteditable',false);
	}
	function loadLists(p) {
		var op=p.panel;
		c.load();op.empty();
		$('<div class=ge_sbtn style="cursor:default">超级召唤</div>').appendTo(op);
		sl=$('<select>').appendTo($('<label>选择名单：</label>').appendTo(op)).change(editList);
		$('<span class="ge_sbtn ge_rsep">改名</span>').appendTo(op).click(function(e) {
			e.preventDefault();
			var t=prompt('列表名称：',c.cur.name);
			if(t) {sl.children(':eq('+c.last+')').text(t);c.cur.name=t;c.save();}
		});
		$('<span class=ge_sbtn>新建列表</span>').appendTo(op).click(newList);
		$('<span class="ge_sbtn ge_rsep">删除列表</span>').appendTo(op).click(function(e){
			e.preventDefault();
			var l=c.last;c.pop(l);editList();sl.children().eq(l).remove();
		});
		pl=$('<div id=callList>').appendTo(op).click(function(e){
			e.preventDefault();
			e=e.target;if(e.tagName=='A') $(e).toggleClass('selected');
		}).dblclick(function(e){
			e.stopPropagation();
			var s=window.getSelection();
			if(!s.rangeCount) return;
			var r=s.getRangeAt(0),c=r.startContainer,k=r.startOffset;
			var i=c.data.substr(0,k).search(/\s\S*$/),j=c.data.substr(k).search(/\s/);
			r.setStart(c,i+1);r.setEnd(c,j<0?c.data.length:k+j);
			s.removeAllRanges();s.addRange(r);	// Compatible with Chrome
		});
		$('<label>名单管理：</label>').appendTo(op);
		be=$('<span>').appendTo(op);
		$('<span class=ge_sbtn>编辑</span>').appendTo(be).click(function(e){
			bs.show();be.hide();
			pl.prop('contenteditable',true);
			pl.text(c.cur.data.join(' '));
		});
		$('<span class=ge_sbtn>全选/不选</span>').appendTo(be).click(function(e){
			e.preventDefault();
			var a=pl.children('a:not(.selected)');
			if(a.length) a.addClass('selected'); else pl.children('a').removeClass('selected');
		});
		bs=$('<span>').appendTo(op).hide();
		$('<span class=ge_sbtn>去重</span>').appendTo(bs).click(function(e){
			var d=pl.text().replace(/^\s+|\s+$/,'').split(/\s+/),h={};
			d.forEach(function(i){h[i]=0;});
			pl.text(Object.getOwnPropertyNames(h).join(' '));
		});
		$('<span class="ge_sbtn ge_rsep">完成</span>').appendTo(bs).click(function(e){
			c.cur.data=pl.text().replace(/^\s+|\s+$/,'').split(/\s+/);
			c.save();editList(e);be.show();bs.hide();
		});
		$('<span>空格隔开，双击选中一个名字</span>').appendTo(bs);
		var b=$('<div style="float:right">').appendTo(op);be=be.add(b);
		$('<span class=ge_sbtn title="普通召唤，超过十个ID将会失败">召唤</span>').appendTo(b).click(function(e){
			var se=p.holder==E?unsafeWindow.rich_postor._editor:unsafeWindow.LzlEditor._s_p._se;
			pl.children('a.selected').each(function(i,e){se.execCommand('inserthtml','@'+e.innerHTML+'&nbsp;');});
			p.onclose();
		});
		$('<span class=ge_sbtn title="插入一个占位符，将自动替换成召唤名单">自动召唤</span>').appendTo(b).click(function(e){
			e=[];pl.children('a.selected').each(function(){e.push(this.innerHTML);});
			p.onclose();
			if(e.length) {
				p.holder.names=e;
				e=p.holder==E?unsafeWindow.rich_postor._editor:unsafeWindow.LzlEditor._s_p._se;
				e.execCommand('inserthtml','<img class=BDE_Smiley title="将在此自动插入召唤名单" alt="召唤列表" height=18>');
			}
		});
		c.list.forEach(function(i){$('<option>').text(i.name).appendTo(sl);});
		editList();
	}
	var l=/<img [^>]*?alt="召唤列表"[^>]*>/;
	function addNames(e,n){
		if(n.splice) n='@'+n.splice(0,10).join(' @')+' ';
		return e.replace(l,n).replace(/ $/,' 　');
	}
	// 主编辑框
	utils.addPopup(E,utils.addTButton($('<span class="call_list" title="召唤" unselectable="on">')),loadLists);
	var _post=unsafeWindow.PostHandler.post;
	unsafeWindow.PostHandler.post=function(a,b,c,d){
		function post(){
			if(E.names) {
				b.content=addNames(e,E.names);
				if(!E.names.length) delete E.names;
			}
			_post.call(unsafeWindow.PostHandler,a,b,E.names?delay:c,d);
		}
		function delay(m){
			setTimeout(post,1000);
		}
		var e=b.content;
		if(E.names&&e.search(l)<0) delete E.names;
		post();
	};
	// 楼中楼
	function submitData(a,e,b){
		function post(){
			b.content=addNames(e,j.names);
			if(!j.names.length) delete j.names;
			$.tb.post(FORUM_POST_URL.postAdd,b,delay);
		}
		function delay(m){
			if(j.names) setTimeout(post,1000);
			else setTimeout(function(){location.reload();},0);
		}
		a=this;
		if(j.names&&a._se.editArea.innerHTML.search(l)>=0) {
			b=a._getData();e=b.content;post();
		} else _submitData.call(a);
	}
	var _submitData;
	lzl_init.push(function(){
		_submitData=unsafeWindow.SimplePostor.prototype._submitData;
		unsafeWindow.SimplePostor.prototype._submitData=submitData;
	});
	lzl_fix.push(function(){
		unsafeWindow.LzlEditor._s_p._submitData=submitData;
	});
	var o=$('<span title="召唤" unselectable="on"></span>'),j=$('#j_p_postlist');
	utils.addPButton(o,['lzl_panel_call'],utils.addPopup(j,null,loadLists).ontoggle,{keys:['click']});
}

// 字体颜色初始化
function initForeColors() {
	utils.colors={red:'#e10602'};
	utils.switchColor=function(cr,cs) {
		document.execCommand('forecolor',false,document.queryCommandValue('forecolor').replace(/\s/g,'')==cr?'#333333':cs);
	}
	function fix() {
		$(this.editArea).find('font[color]').each(function(i,e){
			e=$(e);i=e.html();
			switch(e.prop('color')){
				case utils.colors.red:
					e.replaceWith('<span class="edit_font_color">'+i+'</span>');
					break;
			}
		});
	}
	unsafeWindow.TED.EditorCore.prototype.submitValidHTML.push('span');	// allow font in Lzl
	utils.hook(unsafeWindow.rich_postor._editor,'filteSubmitHTML',fix);
	lzl_efilters.push(fix);
}

// 修复楼中楼定位翻页
function initLzlFix() {
	$('li.lzl_li_pager').each(function(i,e){
		if((e=$(e)).children('.lzl_more:hidden').length) e.children('.j_pager:hidden').show();
	});
}
// 优化弹窗
function initOverlay() {
	var t=utils.addStyle();
	function fixLocation(H) {
		var f=H.offset(),h=H.height();
		if(f.top+h>pageYOffset+innerHeight) {	// 向上弹出
			H.css({top:'auto',bottom:H.parent().height()-H.position().top+40});
			t.html('.tb-editor-overlay .arrow{top:auto !important;bottom:-8px !important;transform:scale(-1);-webkit-transform:scale(-1);}');
			return true;
		} else t.html('');
	}
	// 普通弹窗
	//utils.hook(unsafeWindow.TED.Overlay.prototype,'open',null,function(){		// 所有弹窗：包括楼中楼
	utils.hook(unsafeWindow.rich_postor._editor.overlay,'open',null,function(){		// 仅主输入框的弹窗
		if(this.isOpen) fixLocation($(this.holder));
	});
	utils.hook(unsafeWindow.TED.Overlay.prototype,'close',null,function(){t.html('');});
	// 涂鸦窗口
	utils.hook(unsafeWindow.TED.Editor.prototype,'toolbarcmd_picasso',null,function(){
		if(this.overlay.isOpen) {
			fixLocation($(this.overlay.holder));
			this.overlay.picassoPanel.sketchpad.refreshPosition();
		}
	});
	// 附件窗口
	var o=unsafeWindow.rich_postor._editor.editorPlugins.idisk;
	if(o) {
		o=o.overlay;
		o.$holder.css('display','none');
		utils.hook(unsafeWindow.rich_postor._editor,'toolbarcmd_idisk',null,function(r,m){
			if(o.isOpen) {
				o.$holder.css({display:'block',top:m[0].offsetTop+32,bottom:'auto',left:m[0].offsetLeft-350});
				fixLocation(o.$holder);
			}
		});
		utils.hook(o,'close',function(){this.$holder.css('display','none');});
	}
}
// 楼中楼初始化
function initLzL() {
	// 倒序添加按钮
	var t=$('#edit_parent .tb-editor-toolbar');
	if(t.children('.font_color').length)
		utils.addPButton($('<span title="红字" unselectable="on"></span>'),['font_color'],
				function(e){utils.switchColor('rgb(225,6,2)',utils.colors.red);},{before:'.lzl_panel_smile'});
	if(t.children('.font_strong').length)
		utils.addPButton($('<span title="加粗" unselectable="on"></span>'),['font_strong'],
				function(e){document.execCommand('bold',false,'');},{before:'.lzl_panel_smile'});
	// 楼中楼初始化
	function fixLzl() {
		var p=$('div.lzl_panel_btn');p.parent().css('width','50%').prev().css('width','50%');
		lzl_buttons.forEach(function(i){utils.addButton(p,i[0],i[1],i[2]);});
	}
	t='.font_strong,.font_color{background:url("http://tb2.bdstatic.com/tb/editor/v2/font_style.png") no-repeat transparent;height:20px;width:22px;}.font_color{background-position:0 -20px;}';
	if(lzl_styles.length) t+='.'+lzl_styles.join(',.')+'{margin:2px 1px;float:right;}';
	utils.addStyle(t);
	if(unsafeWindow.LzlEditor._s_p) {
		fixLzl();lzl_fix.forEach(function(i){i();});
	}
	lzl_init.forEach(function(i){i();});
	utils.hook(unsafeWindow.SimplePostor.prototype,'_buildNormalEditor',null,fixLzl);
	utils.hook(unsafeWindow.TED.SimpleEditor.prototype,'filteSubmitHTML',lzl_efilters);
	utils.hook(unsafeWindow.SimplePostor.prototype,'_getData',null,function(d){
		d=this._data;lzl_filters.forEach(function(f){d.content=f(d.content);});
	});
}

// 以下为模块调用，可将不需要的模块注释，不要改变顺序
if($&&PageData&&PageData.user) utils.fixer(function(){	// 出错反馈按钮
	// 以下模块无需登录
	if(PageData.thread) {	// 以下模块仅在帖子浏览页面加载
		initSpaceFix();			// 空格显示修复
		initLzlFix();			// 修复楼中楼定位翻页
	}
	//以下模块仅在登录时加载
	if(PageData.user.is_login) {
		initNoticeDecode();		// 提醒页面强制解码
		initPanelCall();		// 用户卡片上添加到当前@列表功能支持
		if(unsafeWindow.rich_postor&&unsafeWindow.rich_postor._editor) {
			// 以下模块仅在有输入框且允许发言时加载
			initSpaceKeep();		// 空格显示修复
			initAddWater();			// 灌水+尾巴
			initCall();			// 召唤增强，召唤列表
			initForeColors();		//初始化：字体颜色
			initOverlay();			// 优化弹窗
			//utils.notice(4,'Unicode编码和蓝字被屏蔽得妥妥的，暂时不能用了。。。\n　　　　——Gerald <gera2ld@163.com>');
		}
		if(unsafeWindow.LzlEditor) {	// 最后初始化楼中楼，使楼中楼支持以上功能
			initLzL();		//初始化：支持已加载的功能
		}
	}
});
