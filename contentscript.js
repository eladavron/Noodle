var courseList = document.getElementsByClassName("panel panel-default coursebox");
if (courseList != null)
{	
	var i;
	for (i=0; i < courseList.length; i++)
	{		
		var a = courseList[i].getElementsByTagName("a");
		if (a)
		{
			var u = a[0].getAttribute("href");
			if (u != null)
			{
				var id = u.split("?id=");
				chrome.runtime.sendMessage({type: "course", courseID: id[1], title: a[0].innerText}, function(response) {
					console.log("Content: Recieved response: " + response);
				});
				courseList[i].setAttribute("id",id[1]);
				console.log("Content: Added attribute ID to " + id[1]);				
				chrome.runtime.sendMessage({type: "getLocalStorage", requestCid: id[1]}, function(response) {
					var isChecked = response.checked;
					var cid = response.chkCid;
					console.log("Content: Response for " + cid + " is " + isChecked);					
					if (isChecked)
					{
						document.getElementById(cid).style.display = "none";
						console.log("Content: Setting " + cid + " as hidden");					
					}
					else
					{
						document.getElementById(cid).style.display = "";
						console.log("Content: Setting " + cid + " as visible!");
					}
				});				
			}
		}
	}
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.type == "toggle")
		{
			console.log("Content: Received toggle request for " + request.id);
			console.log("Content: Newstate is " + request.newStats);
			var element = document.getElementById(request.id);
			element.setAttribute("style",request.newStats ? "display: none;" : "");
		}
	}
);