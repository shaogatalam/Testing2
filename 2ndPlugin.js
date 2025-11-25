export class PageTrackerPlugin {
    constructor(api, storage) {
        this.api = api;
        this.storage = storage;
    }

    init() {
        const url = window.location.href;
        this.api.log("[PAGE TRACKER] Page loaded:", url);

        const prev = this.storage.get("visited_pages") || [];
        prev.push({ url, ts: Date.now() });

        this.storage.set("visited_pages", prev);
    }

    destroy() {
        this.api.log("[PAGE TRACKER] Plugin destroyed");
    }
}
