var courseList = document.getElementsByClassName("coursebox");
if (courseList != null) {
	var i;
	for (i = 0; i < courseList.length; i++) {
		var courseBox = courseList[i];
		var title = courseBox.getElementsByClassName("coursename")[0].innerText;
		var id = courseBox.getAttribute("data-courseid");
		if (!courseBox.hasAttribute("id"))
			courseBox.setAttribute("id", id); //Add the ID attribute for better control
		chrome.runtime.sendMessage({ type: "course", courseID: id, courseTitle: title }, function (response) {
			console.log("Content: Recieved response: " + response);
		});
		chrome.runtime.sendMessage({ type: "getLocalStorage", requestCid: id }, function (response) {
			var isChecked = response.checked;
			var cid = response.chkCid;
			console.log("Content: Response for " + cid + " is " + isChecked);
			if (isChecked) {
				document.getElementById(cid).style.display = "none";
				console.log("Content: Setting " + cid + " as hidden");
			}
			else {
				document.getElementById(cid).style.display = "";
				console.log("Content: Setting " + cid + " as visible!");
			}
		});
	}
}

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.type == "toggle")
			document.getElementById(request.id).setAttribute("style", request.newStats ? "display: none;" : "");
	}
);