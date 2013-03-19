/* Author: Gerald <gera2ld@163.com>
 * For Opera (Presto) Only
 * works in UserJS directory only
 */

opera.addEventListener('BeforeScript',function(e){
	e.element.text=e.element.text.replace("instance.render($('#voteFlashPanel'));","\
var requestAuthorityData=instance._dm.requestAuthorityData;\
instance._dm.requestAuthorityData=function(){\
instance._dm._voteDetail.vote_properties.forum_name=_voteOptions.forum_name_u;\
requestAuthorityData.apply(this,arguments);\
};\
instance.render($('#voteFlashPanel'));");
},false);
