$(document).ready(function() {
	$(".various").adsenseIframe({closeClick : false, openEffect : 'none', closeEffect : 'none', hideOnOverlayClick:false, hideOnContentClick:false}).trigger("click");
});
//
function disableselect(e)
{
    return false
}
function reEnable()
{
    return true
}
document.onselectstart = new Function ("return false")
if (window.sidebar)
{
    document.onmousedown = disableselect
    document.onclick = reEnable
}
//desabilita menu de opções após clicar no botão direito
function desabilitaMenu(e)
{
if (window.Event)
{
if (e.which == 2 || e.which == 3)
return false;
}
else
{
event.cancelBubble = true
event.returnValue = false;
return false;
}
}
//desabilita botão direito
function desabilitaBotaoDireito(e)
{
if (window.Event)
{
if (e.which == 2 || e.which == 3)
return false;
}
else
if (event.button == 2 || event.button == 3)
{
event.cancelBubble = true
event.returnValue = false;
return false;
}
}
//desabilita botão direito do mouse
if ( window.Event )
document.captureEvents(Event.MOUSEUP);
if ( document.layers )
document.captureEvents(Event.MOUSEDOWN);
document.oncontextmenu = desabilitaMenu;
document.onmousedown = desabilitaBotaoDireito;
document.onmouseup = desabilitaBotaoDireito;