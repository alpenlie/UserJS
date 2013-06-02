// ==UserScript==
// @name	Tieba Imagizer
// @namespace	http://gera2ld.blog.163.com/
// @author	Gerald <gera2ld@163.com>
// @icon	http://s.gravatar.com/avatar/a0ad718d86d21262ccd6ff271ece08a3?s=80
// @version	1.0.5
// @description	贴吧图化 - Gerald倾情打造
// @homepage	http://userscripts.org/scripts/show/156579
// @downloadURL	https://userscripts.org/scripts/source/156579.user.js
// @updateURL	https://userscripts.org/scripts/source/156579.meta.js
// @include	http://tieba.baidu.com/*
// @exclude	http://tieba.baidu.com/tb/*
// @require	https://raw.github.com/gera2ld/UserJS/master/lib/TiebaCommon.min.user.js
// ==/UserScript==

// 初始化图片上传功能
var loadingURL='http://imgsrc.baidu.com/forum/pic/item/93ac22d7912397dd818c85fc5982b2b7d2a287e1.jpg';
function initImageLoader(callback) {
	var fil='http://static.tieba.baidu.com/tb/static-frs/component/sign_shai/flash_image_loader.js';
	if(!unsafeWindow.FlashImageLoader) $.getScript(fil,callback); else callback();
}
// 初始化颜色选择面板
function initColorPanel() {
	if(utils.colorInput) return;
	if(navigator.userAgent.indexOf('Firefox')<0)
		return utils.colorInput=function(id,key,def,func){
			return utils.bindProp($('<input type=color id='+id+' class=ge_rsep>'),'value',key,def,func,['change','keyup']);
		};
	utils.addStyle('\
#colors{display:none;position:absolute;background:white;border:2px ridge;padding:10px;cursor:default;}\
#colors .colors{width:261px;cursor:pointer;margin:2px;border-collapse:separate;border-spacing:1px;background:black;}\
#colors .colors td{display:table-cell !important;width:12px;height:12px;border:none;emptycells:show;}\
.colorbox{width:12px;height:12px;border:1px solid;display:inline-block;position:relative;top:3px;}\
');
	var cp=$('<div id=colors>').click(function(e){e.stopPropagation();}),r,c,t;
	r=function(e){
		var d=$(e.target).attr('data');
		if(d) {
			if(e.type=='mouseover') {
				if(c) c.css('outline','none');
				c=$(e.target).css('outline','1px outset yellow');
				$('#ge_vcolor').val(d);
			} else cp.owner.setColor(d);
		}
	};
	t=$('<table class=colors>').appendTo(cp).mouseover(r).click(r);
	var k=['00','33','66','99','cc','ff'],p=['#ffffff','#ff0000','#00ff00','#0000ff','#ffff00','#00ffff','#ff00ff'];
	for(var i=0;i<12;i++) {
		r=$('<tr>').appendTo(t);
		if(i<6) c='#'+k[i]+k[i]+k[i]; else c=p[i-6];
		$('<td>').appendTo(r).css({background:c}).attr('data',c);
		if(!i) $('<td rowspan=12 style="background:white;">').appendTo(r);
		for(var j=0;j<18;j++) {
			c='#'+k[Math.floor(i/6)*3+Math.floor(j/6)]+k[j%6]+k[i%6];
			$('<td>').appendTo(r).css({background:c}).attr('data',c);
		}
	}
	t=$('<form>').appendTo(cp);
	$('<span id=ge_scolor class="ge_rsep colorbox">').appendTo(t);
	r=function(){$('#ge_scolor').css('background',this.value);};
	$('<input type=text id=ge_vcolor style="width:60px" class=ge_rsep>').appendTo(t).change(r).keyup(r);
	r=function(e){e.preventDefault();cp.owner.setColor($('#ge_scolor').css('background-color'));};
	$('<span class=ge_sbtn>OK</span>').appendTo(t).click(r);t.submit(r);
	c=null;
	utils.colorInput=function(id,key,def,func){
		var o=$('<span id='+id+' class=colorbox>'),c=utils.getObj(key,def);
		o.css({border:'1px outset white',cursor:'pointer',background:c}).attr('data',c).click(function(e){
			if(cp.owner!=o) {
				cp.owner=o;cp.appendTo(o).css({top:'auto',bottom:'auto'}).show();
				if(cp.offset().top+cp.height()>pageYOffset+innerHeight) cp.css('bottom','14px');
				else cp.css('top','14px');
				$('#ge_scolor').css('background',e=o.attr('data'));
				$('#ge_vcolor').val(e);
			} else {cp.owner=null;cp.hide();}
		});
		o.setColor=function(v){
			v=v.replace(/rgb\((\d+),\s?(\d+),\s?(\d+)\)/i,function(v,g1,g2,g3){
				v=[g1,g2,g3];for(g1 in v) {v[g1]=parseInt(v[g1]).toString(16);if(v[g1].length<2) v[g1]='0'+v[g1];}
				return '#'+v.join('');
			});
			o.attr('data',v).css('background',v);
			utils.setObj(key,v);
			cp.owner=null;cp.hide();func();
		};
		o[0].val=function(){return o.attr('data');};
		return o[0];
	};
}
if(PageData&&PageData.user&&PageData.user.is_login&&unsafeWindow.rich_postor) {
	var st=utils.addStyle(),undo=null,op=utils.addPopup($('#edit_parent'),utils.addSButton('图化')).panel;
	function getStyle() {
		var s={},t=[];
		if($('#w2iitalic').prop('checked')) t.push('italic');
		if($('#w2ibold').prop('checked')) t.push('bold');
		t.push($('#w2isize').val()+'px');
		if(f.val()) t.push(f.val());
		s.font=t.join(' ');
		s.color=cf.val();
		s.background=$('#w2iabgclr').prop('checked')?cb.val():'transparent';
		return s;
	}
	function init(){
		initImageLoader(function(){
			utils.uploadImage=function(data,node) {
				function uploaded(a,d) {
					var c=JSON.parse(d);
					if(c.error_code) alert('图片上传错误！'); else {
						var e='http://imgsrc.baidu.com/forum/pic/item/'+c.info.pic_id_encode+'.png';
						$(node).replaceWith('<image pic_type="5" class="BDE_Image" src="'+e+'">');
					}
					unsafeWindow.FlashImageLoader.unbind('uploadComplete', uploaded);
				}
				$.get('/dc/common/imgtbs',function(r) {
					unsafeWindow.FlashImageLoader.bind('uploadComplete', uploaded);
					unsafeWindow.FlashImageLoader.uploadBase64('http://upload.tieba.baidu.com/upload/pic',data.replace(/^data:.*?;base64,/,''),{tbs:r.data.tbs});
				},'json');
			};
			u.removeClass('ge_disabled').text('开始图化').unbind('click').click(word2Image);
			$.get(loadingURL);
		});
	}
	var u=$('<div class="ge_sbtn ge_disabled" style="margin:0 0 2px;">图化组件初始化失败，点击重试</div>').appendTo(op).click(init);
	init();
	function innerText(o) {
		return $('<div>').append(o.childNodes).html(function(i,h){return h.replace(/<br>(<\/p>)?|<\/p>/gi,'\n');}).text().replace(/\s+$/,'');
	}
	function word2Image(){
		undo=unsafeWindow.rich_postor._editor.editArea.innerHTML;
		bUndo.removeClass('ge_disabled');
		var fz=parseInt($('#w2isize').val()),r=unsafeWindow.rich_postor._editor.savedRange,s,loading=$('<img title="双击撤销">').attr('src',loadingURL);
		if(r&&r.toString()) {
			s=innerText(r.extractContents());
			if(!/\S/.test(s)) return;
			r.insertNode(loading[0]);
		} else {
			r=unsafeWindow.rich_postor._editor.editArea;
			s=innerText(r);
			if(!/\S/.test(s)) return;
			$(r).html(loading);
		}
		var lines=s.split('\n'),w=0;
		var c=document.createElement('canvas');
		var d=c.getContext('2d');
		var lh=Math.round(1.5*fz),data=[];
		s=getStyle();
		d.font=s.font;
		lines.forEach(function(line){
			line=line.replace(/\s+$/,'');
			do {
				for(var l=0,j=0;j<line.length;j++) {
					l+=d.measureText(line[j]).width;
					if(l>560) break; else if(w<l) w=l;
				}
				data.push(line.substr(0,j));
				line=line.substr(j);
			} while(line);
		});
		c.height=lh*data.length;
		c.width=w;
		if($('#w2ishadow').prop('checked')) {
			d.shadowColor='gray';
			d.shadowBlur=d.shadowOffsetY=d.shadowOffsetX=Math.ceil(fz/25);
		}
		if($('#w2iabgclr').prop('checked')) {
			d.fillStyle=s.background;
			d.fillRect(0,0,w,c.height);
		}
		d.font=s.font;
		d.fillStyle=d.strokeStyle=s.color;
		e=$('#w2istroke').prop('checked')?d.strokeText:d.fillText;
		i=0;data.forEach(function(j){e.call(d,j,0,fz+lh*(i++));});
		utils.uploadImage(c.toDataURL(),loading);
	}
	function checkFont(e) {
		e=getStyle();var i,s='';
		for(i in e) e[i]+=' !important';
		if($('#w2ipreview').prop('checked')) st.html('#edit_parent .tb-editor-editarea{font:'+e.font+';color:'+e.color+';background:'+e.background+'}');
		else st.html('');
		for(i in e) s+=i+':'+e[i]+';';
		f.css('cssText',s);
	}
	utils.addStyle('#w2iface{max-width:800px;max-height:400px;}');
	var ff=utils.list('w2ifaces','w2ifaceid',null,['微软雅黑']).load();
	var f=$('<select id=w2iface>').appendTo($('<label>字体：</label>').appendTo(op)).change(function(e){ff.load(f.prop('selectedIndex'));checkFont();});
	ff.list.forEach(function(i){$('<option>'+i+'</option>').appendTo(f);});f.prop('selectedIndex',ff.last);
	$('<span class=ge_sbtn>+</span>').appendTo(op).click(function(e){
		e=prompt('请输入字体名称：');
		if(!e) return;
		ff.load(ff.push(e));
		$('<option>').text(e).appendTo(f);
		f.val(e);checkFont();
	});
	$('<span class=ge_sbtn>-</span>').appendTo(op).click(function(e){
		e=f.prop('selectedIndex');
		f.children(':eq('+e+')').remove();
		ff.pop(e);ff.load(f.prop('selectedIndex'));checkFont();
	});
	initColorPanel();
	var cf,cb;
	utils.bindProp($('<input type=checkbox id=w2ipreview>').appendTo(op),'checked','w2ipreview',false,checkFont);
	$('<label for=w2ipreview>预览</label><br><label for=w2icolor>颜色：</label>').appendTo(op);
	$(cf=utils.colorInput('w2icolor','w2icolor','#2222ff',checkFont)).appendTo(op).addClass('ge_rsep');
	$('<label for=w2isize>大小：</label>').appendTo(op);
	utils.bindProp($('<input type=number id=w2isize min=9 class=ge_rsep style="height:18px;width:40px;">').appendTo(op),'value','w2isize',22,checkFont);
	utils.bindProp($('<input type=checkbox id=w2iabgclr>').appendTo(op),'checked','w2iabgclr',false,checkFont);
	$('<label for=w2iabgclr>背景色：</label>').appendTo(op);
	$(cb=utils.colorInput('w2ibgclr','w2ibgclr','#efe4b0',checkFont)).appendTo(op);
	$('<br>').appendTo(op);
	utils.bindProp($('<input type=checkbox id=w2ibold>').appendTo(op),'checked','w2ibold',false,checkFont);
	$('<label for=w2ibold class=ge_rsep>加粗</label>').appendTo(op);
	utils.bindProp($('<input type=checkbox id=w2iitalic>').appendTo(op),'checked','w2iitalic',false,checkFont);
	$('<label for=w2iitalic class=ge_rsep>倾斜</label>').appendTo(op);
	utils.bindProp($('<input type=checkbox id=w2ishadow>').appendTo(op),'checked','w2ishadow',false,checkFont);
	$('<label for=w2ishadow class=ge_rsep>阴影</label>').appendTo(op);
	utils.bindProp($('<input type=checkbox id=w2istroke>').appendTo(op),'checked','w2istroke',false,checkFont);
	$('<label for=w2istroke class=ge_rsep>镂空</label>').appendTo(op);
	var bUndo=$('<span class="ge_sbtn ge_disabled" title="回到最后一次图化前的状态">撤销图化</span>').appendTo(op).click(function(e){
		if(!undo) return;
		unsafeWindow.rich_postor._editor.editArea.innerHTML=undo;undo=null;
		bUndo.addClass('ge_disabled');
	});
	f.prop('selectedIndex',ff.last);checkFont();
}
