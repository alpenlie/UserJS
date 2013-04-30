// ==UserScript==
// @name OpenGG
// @namespace http://gera2ld.blog.163.com/
// @author Gerald
// @description 在线视频去广告
// @version 1.0
// @match *://*/*
// @run-at	document-start
// ==/UserScript==

/*
 * === 说明 ===
 * 本脚本参考http://bbs.kafan.cn/thread-1514537-1-1.html 感谢卡饭大神
 * Chrome用户也可以使用Adkill and Media download这个扩展
 * 此脚本设计修改人员OpenGG  Harv  xplsy  15536900  yndoc  KawaiiUshio
 * Bilibili黑科技由FireAway提供      参考：http://userscripts.org/scripts/show/165424
 * In God，We Turst.
 * THX
 * 
 * 此为Gerald修改版，原作地址：http://userscripts.org/scripts/show/162286
 * 感谢原作者，一切版权归原作者所有。
 */

(function(document) {
    var loader = 'http://lovejiani.cdn.duapp.com/kafan/loader.swf';
    var ku6 = 'http://lovejiani.cdn.duapp.com/kafan/ku6.swf';
    var iqiyi = 'http://lovejiani.cdn.duapp.com/kafan/iqiyi.swf';
    var iqiyi5 = 'http://lovejiani.cdn.duapp.com/kafan/iqiyi5.swf';
    var tudou = 'http://lovejiani.cdn.duapp.com/kafan/tudou.swf';
    var letv = 'http://lovejiani.cdn.duapp.com/kafan/letv.swf';
    var players = {
        'youku': {
            find: /http:\/\/static\.youku\.com(\/v[\d\.]+)?\/v\/swf\/(loader|q?player[^\.]*)\.swf/i,
	        replace: loader
        },
        'youku_out': {
            find: /http:\/\/player\.youku\.com\/player\.php\/.*sid\/([\w=]+).*\.swf/i,      
	        replace: loader + '?showAd=0&VideoIDS=$1'
        },
        'ku6': {
            find: /http:\/\/player\.ku6cdn\.com\/default\/.*\/\d+\/player\.swf/i,
            replace: ku6
        },
	    'ku6_out': {
            find: /http:\/\/player\.ku6\.com\/(inside|refer)\/([^\/]+)\/v\.swf.*/i,
            replace: ku6 + '?vid=$2'
        },
        'letv1': {
            find: /http:\/\/.*letv[\w]*\.com\/[^\.]*\/.*player\/((?!Live).*)Player[^\.]*\.swf/i,
            replace: letv
        },
        'letv2': {
            find: /http:\/\/.*letv[\w]*\.com\/.*player[^\.]*\.swf\?v_list=[\d]/i,
            replace: letv
        },
        'letv3': {
            find: /http:\/\/.*letv[\w]*\.com\/.*\/v_list=[\d]*\/*\.swf/i,
            replace: letv
        },
        'tudou': {
            find: /http:\/\/js\.tudouui\.com\/.*player[^\.]*\.swf/i,
            replace: tudou
        },
        'tudou_out': {
            find: /http:\/\/www\.tudou\.com\/v\/\w+\/v\.swf|http:\/\/www\.tudou\.com\/[a-z]\/.*resourceId=(\w+)\/v\.swf/i,
            replace: tudou + '?tvcCode=-1&autostart=false'
			//replace: tudou + '?tvcCode=-1'
        },
        'iqiyi': {
            find: /http:\/\/www\.iqiyi\.com\/player\/\d+\/Player\.swf/i,
            replace: iqiyi
        },
        'iqiyi_out': {
            //find: /http:\/\/player\.video\.i?qiyi\.com\/([^\/]*)\/.*/,
	        find: /http:\/\/(player|dispatcher)\.video\.i?qiyi\.com\/(.*[\?&]vid=)?([^\/&]+).*/i,
            replace: iqiyi5 + '?vid=$3'
        }
    };

    function replace(elem) {
        var player = elem.data || elem.src;
        if(!player) return;

        var i, find, replace, isReplacing = false;
        for(i in players) {
            find = players[i].find;
            if(find.test(player)) {
                replace = players[i].replace;
                
                preHandle();

                if(!isReplacing) {
                    reallyReplace();
                }
                break;
            }
        }

        function preHandle() {
            if(i == 'iqiyi' && document.querySelector('span[data-flashplayerparam-flashurl]')) {
                replace = iqiyi5;
            } else if(i == 'tudou_out') {
                var match = player.match(/(iid|youkuId)=[^\/]+/i);
                if(match) {
                     replace += '&' + match[0];
                } else {
                    isReplacing = true;
                    var icode = player.match(/\/([^\/]{11})\/.*v\.swf/i);
                    if(icode) {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: 'http://api.tudou.com/v3/gw?method=item.info.get&appKey=myKey&format=json&itemCodes=' + icode[1],
                            onload: function(response) {
                                var obj = eval('(' + response.responseText + ')');
                                if(obj) {
                                    replace += '&iid=' + obj['multiResult']['results'][0]['itemId'];
                                    reallyReplace();
                                }
                            }
                        });
                    }
                }
            }
        }

        function reallyReplace() {
            elem.data && (elem.data = elem.data.replace(find, replace)) || elem.src && ((elem.src = elem.src.replace(find, replace)) && (elem.style.display = 'block'));
        }
    }
		document.addEventListener('DOMNodeInserted',function(e){
			var o=e.currentTarget;
			if(o.querySelectorAll) Array.prototype.forEach.call(o.querySelectorAll('object,embed'),replace);
		},false);
})(window.document);

(function(a){
	if(!a) return;
	var ua = navigator.userAgent.toLowerCase();
	var url = 'http://api.bilibili.tv/view?type=json&id=' + a[1] + '&page=' + (a[2] || 1);
	var vURL = 'http://interface.bilibili.tv/playurl?otype=JSON&type=FLV&cid='
	var list = document.createElement("select");
	list.type = "select";
	list.id = "list";
	list.add(new Option("比利海灵顿祈祷中……", "比利海灵顿祈祷中……"));

	function getCid(id) {
			var changeCidB = document.createElement('button');
			changeCidB.id = "B";
			changeCidB.type = "button";
			changeCidB.appendChild(document.createTextNode('更换视频CID'));
			changeCidB.setAttribute("onclick",
															"replaceByCid(list.options[list.selectedIndex].value);");
			
			var Burl = 'https://secure.bilibili.tv/secure,cid=';
			
			var button = document.createElement('button');
			button.appendChild(document.createTextNode('黑科技按钮！'));
			button.addEventListener('click', function () {
					window.open(Burl+list.options[list.selectedIndex].value)
			}, false);
			
			
			var div = document.createElement('div');
			div.innerHTML = "跟随王的选择！El Psy Congroo！如果没有王的选择……那么请等待下个版本吧！"
			
			var scr = document.createElement('script');
			scr.setAttribute("language", "JavaScript");
			scr.innerHTML = "function replaceByCid(cid){var B = document.getElementById('B'); var bilibili = document.createElement('embed');var list =document.getElementById('list'); var path = 'cid='+cid;player = document.getElementById('bofqi');bilibili.type = 'application/x-shockwave-flash';bilibili.width = 950;bilibili.height = 482;bilibili.src = 'https://static-s.bilibili.tv/play.swf';bilibili.setAttribute('flashvars', path);bilibili.setAttribute('quality', 'high');bilibili.setAttribute('allowfullscreen', 'true');bilibili.setAttribute('allowscriptaccess', 'always');bilibili.setAttribute('rel', 'noreferrer');player.innerHTML = bilibili.outerHTML;player.appendChild(B);player.appendChild(list);};";
			
			var user = document.getElementById("r-info-rank").childNodes[1].innerHTML;
			
			var name = document.getElementsByTagName("h2")[0].innerHTML;
			
			var start = parseInt(id) - 1;
			var end = parseInt(id) + 1;
			
			var player = document.getElementById('bofqi');
			player.innerHTML = changeCidB.outerHTML;
			player.appendChild(list);
			player.appendChild(div);
			player.appendChild(scr);
			player.appendChild(button);
			
			getS2E(start,-1);
			getS2E(end,1);
	}

	function getInfo(url) {
			GM_xmlhttpRequest( {
					method : "GET",
					url : url,
					headers : {
							"User-Agent" : "Mozilla/5.0",
							"Cache-Control" : "max-age=0",
							"Origin" : "http://www.bilibili.tv",
							"Cookie" : document.cookies
					},
					onload : function(response) {
							var cid;
							if (response.status == 200){
									if (response.responseText.indexOf("no such page") > -1) {
											getCid(a[1]);
									} else {
											cid = /cid":(\d+),"/g.exec(response.responseText)[1];
									} 
									
									
									var path = "cid=" + cid;
									replace(path);
									
							}else{
									alert("你的网速不稳定 请刷新试试！如果多次刷新（10次）无果……则可能是服务器出了问题（或者被限制了）");
							}
							
					}
			});
	};

	function replace(path) {
			var int=self.setInterval(
					function(){
							if(document.getElementById("bofqi")){
									var Burl = 'https://secure.bilibili.tv/secure,' + path;
									var button = document.createElement('button');
									button.appendChild(document.createTextNode('黑科技按钮！'));
									button.addEventListener('click', function () {
											window.open(Burl)
									}, false);
									var bilibili = document.createElement("embed");
									bilibili.type = "application/x-shockwave-flash";
									bilibili.width = 950;
									bilibili.height = 482;
									bilibili.src = "https://static-s.bilibili.tv/play.swf";
									bilibili.setAttribute("flashvars", path);
									bilibili.setAttribute("quality", "high");
									bilibili.setAttribute("allowfullscreen", "true");
									bilibili.setAttribute("allowscriptaccess", "always");
									bilibili.setAttribute("rel", "noreferrer");
									var player = document.getElementById("bofqi");
									
									var isAiqiyi = false;
									var isSouhu = false;
									
									var str = player.innerHTML;
									
									if (str.indexOf("iqiyi") > -1) {
											isAiqiyi = true;
									} else if (str.indexOf("sohu") > -1) {
											isSouhu = true;
									}
									//alert(player | isAiqiyi | isSouhu);
									if(player | isAiqiyi | isSouhu){
											player.innerHTML = bilibili.outerHTML;
											player.appendChild(button);
											window.clearInterval(int);
									}
							}
					}
					,1000);
	};
	var index =0;
	function getS2E(id,flag) {
			var s;
			var e;
			var c;
			var king;
			var u = 'http://api.bilibili.tv/view?type=json&id='+id;
			GM_xmlhttpRequest( {
					method : "GET",
					url : u,
					headers : {
							"User-Agent" : "Mozilla/5.0",
							"Cache-Control" : "max-age=0",
							"Origin" : "http://www.bilibili.tv",
							"Cookie" : document.cookies
					},
					onload : function(response) {
							c = JSON.parse(response.responseText).cid;
							//alert(id +"&" +c);
							if(c){
									list.add(new Option(c, c));
							}else{
									s = id+flag;
									index+=flag;
									getS2E(s,flag);
							}
							if (list.options.length >= 3) {
									s = parseInt(list.options[1].value);
									e = parseInt(list.options[2].value);
									list.remove(1);
									list.remove(1);
									//alert(index);
									if (s > e) {
											for ( var i = e + 1; i < s; i++) {
													list.add(new Option("王的选择" + i, i));
											}
											king = parseInt(s)+index;
									}else{
											for ( var i = s + 1; i < e; i++) {
													list.add(new Option("王的选择" + i, i));
											}
											king = parseInt(e-1)-index;
									}
									list.options[0].innerHTML = "比利海灵顿祈祷终了– ( ゜- ゜)つロ 乾杯~ – bilibili.tv";
									list.options[0].value = king;
									list.add(new Option("真♂王♀的选择！和我签订契约吧！" + king, king),list.options[1]);
									index = 0;
							}
					}
			});
	};

	//document.addEventListener(“DOMContentLoaded”, getInfo, false);
	window.onload = getInfo(url);
})(/\/video\/av(\d+)(?:\/index_(\d+))?/.exec(location.pathname));
