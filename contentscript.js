var courseList = document.getElementsByClassName("coursebox");
if (courseList != null)
{	
	var i;
	for (i=0; i < courseList.length; i++)
	{		
		var a = courseList[i].getElementsByTagName("a");
		var courseTitle = courseList[i].getElementsByClassName("coursename")[0].innerText;
		if (a)
		{
			var u = a[0].getAttribute("href");
			if (u != null)
			{
				var id = u.split("?id=");
				chrome.runtime.sendMessage({type: "course", courseID: id[1], title: courseTitle}, function(response) {
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
			if (courseList != null)
				{	
					var i;
					for (i=0; i < courseList.length; i++)						
							if (courseList[i].getAttribute("data-courseid") == request.id)
								courseList[i].setAttribute("style",request.newStats ? "display: none;" : "");
		
				}
		}
	}
);