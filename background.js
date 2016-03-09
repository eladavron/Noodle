var list = [];

chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        urlMatches: '^http://moodle.haifa.ac.il/$'
                    }
                })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.type == "course")
		{
			console.log("Background: Recieved " + request.courseID + ": " + request.title);
			if (list)
				list.push({id: request.courseID, title: request.title});
		}
		else if (request.type == "getList")
		{
			console.log("Background: Intercepted \"getList\" request!");
			sendResponse({type: "getList"});
		} 
		else if (request.type == "getLocalStorage")
		{
			var cid = request.requestCid;
			console.log("Background: Getting storage settings for " + cid);
			var storageSetting = localStorage.getItem(cid);
			console.log("Background: Setting retrieved: " + storageSetting);
			var savedChecked = (storageSetting == "true" ? true : false);
			console.log("Background: Setting for " + cid + " is " + savedChecked);
			sendResponse({checked: savedChecked, chkCid: cid});
		} 
		else if (request.type == "saveCheckedStatus")
		{
			var cid = request.targetCid;
			var newStatus = request.status;
			console.log("Background: Saving setting " + newStatus + " for " + cid);
			localStorage.setItem(cid, newStatus);
		}
	}
 );
