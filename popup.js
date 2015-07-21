console.log("Popup: Loaded!");
Background = chrome.extension.getBackgroundPage();
chrome.runtime.sendMessage({type: "getList"},function(response) {
    if (response.type == "getList")
	{
		if (!Background)
		{
			Background = chrome.extension.getBackgroundPage();			
			console.log("Popup: Re-aquired Background instance!");
			if (!Background)
			{
				console.log("Popup: Couldn't get background page instance!");
				return;
			}
		}
		var list = Background.list;
		if (!list)
		{
			console.log("Popup: Couldn't get ilst from Background page!");
			return;	
		}
		var i = 0;
		for (i=0;i<list.length;i++)
		{		
			var tr = document.createElement("tr");
			var td = document.createElement("td");
			console.log("Popup: Adding " + list[i].id + ": " + list[i].title);	
			var checkbox = document.createElement("input");
			checkbox.setAttribute("type","checkbox");
			checkbox.setAttribute("id",list[i].id);	
			var cid = list[i].id;
			var chkChecked = false;
			chrome.runtime.sendMessage({type: "getLocalStorage", requestCid: cid}, function(response) {
				console.log("Popup: Got response from storage for " + response.chkCid + " and it is " + response.checked);
				chkChecked = response.checked;				
				document.getElementById(response.chkCid).checked = chkChecked;
			});
			console.log("Popup: Checked status for " + cid + " is " + chkChecked);
			if (chkChecked)
				newStatuscheckbox.setAttribute("checked");						
			checkbox.addEventListener('change', function (){
				sendToggle(this.getAttribute("id"),this.checked);
			});	
			td.appendChild(checkbox);
			var textnode = document.createTextNode(list[i].title);
			var label = document.createElement("label");
			label.setAttribute("for",cid);		
			label.appendChild(textnode);		
			td.appendChild(label);		
			tr.appendChild(td);
			document.getElementById("formTable").appendChild(tr);
		}						
	}
	else
	{
		console.log("Popup: Request type unknown: " + request.type);
	}
  });
  
chrome.runtime.onMessage.addListener(function (request) { 	
	console.log("Popup: Intercepted request!");
	
});

function sendToggle(cid, newStatus)
{
	console.log("Popup: Toggling " + cid + " to " + newStatus);
	chrome.runtime.sendMessage({type: "saveCheckedStatus", targetCid: cid, status: newStatus});
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {type: "toggle", id: cid, newStats: newStatus}, function(response) {});
	});
}