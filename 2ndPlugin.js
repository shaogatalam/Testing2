export class PageTrackerPlugin {
    constructor(api, storage) {
        this.api = api;
        this.storage = storage;
    }
    init() {
        const url = window.location.href;
        console.log("[PAGE TRACKER] Page loaded:", url);
        const existing = sessionStorage.getItem("cf_visited_pages");
        let pages = [];
        if (existing) {
            try {
                pages = JSON.parse(existing);
            } catch (e) {
                console.warn("Failed to parse session storage.");
            }
        }
        pages.push({url,ts: Date.now()});
        sessionStorage.setItem("cf_visited_pages", JSON.stringify(pages));
        console.log("[PAGE TRACKER] Visited Pages:", pages);
    }
    destroy() {
        console.log("[PAGE TRACKER] Plugin destroyed");
    }
}
