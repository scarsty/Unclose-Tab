
historyTabRemove = new Array();
historyTab = new Array();

chrome.tabs.onCreated.addListener(function (tab) {
	historyTab.push(new Array(tab.id, tab.url));
	if (historyTab.length > 100)
		historyTab.shift();
	if (localStorage["CST"] == "true") {
		var i = historyTabRemove.length - 1;
		if (i >= 0) {
			if (tab.url == historyTabRemove[i])
				historyTabRemove.splice(i, 1);
		}
	}
});

chrome.tabs.onUpdated.addListener(function (tabId, props) {
	if (!props.url)
		return;
	var Exist = false;
	var i = historyTab.length - 1;
	while (historyTab[i]) {
		if (historyTab[i][0] == tabId) {
			historyTab.splice(i, 1, new Array(tabId, props.url));
			Exist = true;
			break;
		}
		i--;
	}
	if (!Exist) {
		historyTab.push(new Array(tabId, props.url));
		if (historyTab.length > 100)
			historyTab.shift();
	}
});

chrome.tabs.onRemoved.addListener(function (tabId) {
	var i = historyTab.length - 1
	while (historyTab[i]) {
		deta = historyTab[i];
		if (deta[0] == tabId) {
			historyTabRemove.push(deta[1]);
			if (historyTabRemove.length > 60)
				historyTabRemove.shift();
			break;
		}
		i--;
	}
});


chrome.browserAction.onClicked.addListener(function (tab) {
	if (historyTabRemove.length > 0) {
		var i = historyTabRemove.length - 1;
		while (historyTabRemove[i]) {
			if (historyTabRemove[i].length == 0) historyTabRemove[i] = "chrome://newtab/";
			var text = historyTabRemove[i].substring(0, 6);
			if (text != "chrome" || localStorage["ignore_chrome"] != "true") {
				newTab = { 'url': historyTabRemove[i], 'selected': false };
				historyTabRemove.splice(i, 1);
				if (localStorage["position"] == "fore") newTab.selected = true;
				chrome.tabs.create(newTab);
				break;
			}
			i--;
		}
	}
});

