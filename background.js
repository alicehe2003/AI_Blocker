// Background service worker for the extension 
// Hanfles extension lifecycle events 

chrome.runtime.onInstalled.addListener(() => {
    console.log("Word censorship extension installed."); 
}); 

// Listen for tab updates to ensure content script runs on navigation
chroms.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        // Content script will automatically run due to manifest configuration 
        console.log(`Page loaded: ${tab.url}`); 
        console.log("Enjoy browsing without seeing any AI! (In the literal sense...)"); 
    }
}); 
