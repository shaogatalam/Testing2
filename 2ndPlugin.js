export class PageTrackerPlugin {
    constructor(api, storage, meta) {
        this.api = api;
        this.meta = meta;
        this.storage = storage;
        this.originalPushState = history.pushState;
        this.originalReplaceState = history.replaceState;
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    init() {
        // Track initial load
        this.handlePageChange();

        // ----- Track back/forward -----
        window.addEventListener("popstate", this.handlePageChange);

        // ----- Track URL changes via pushState -----
        history.pushState = (...args) => {
            this.originalPushState.apply(history, args);
            this.handlePageChange();
        };

        // ----- Track URL changes via replaceState -----
        history.replaceState = (...args) => {
            this.originalReplaceState.apply(history, args);
            this.handlePageChange();
        };

        // ----- Track URL hash changes -----
        window.addEventListener("hashchange", this.handlePageChange);

        this.api.log("[PAGE TRACKER] Dynamic tracking enabled");
    }

    handlePageChange() {
        const url = window.location.href;
        const timestamp = Date.now();

        let pages = [];

        try {
            pages = JSON.parse(sessionStorage.getItem("cf_visited_pages")) || [];
        } catch (e) {
            pages = [];
        }

        // Avoid duplicating same page if instantly repeated
        const last = pages[pages.length - 1];
        if (!last || last.url !== url) {
            pages.push({ url, ts: timestamp });
            sessionStorage.setItem("cf_visited_pages", JSON.stringify(pages));

            this.api.log("[PAGE TRACKER] Page changed →", url);
        }
    }

    destroy() {
        window.removeEventListener("popstate", this.handlePageChange);
        window.removeEventListener("hashchange", this.handlePageChange);

        history.pushState = this.originalPushState;
        history.replaceState = this.originalReplaceState;

        this.api.log("[PAGE TRACKER] Plugin destroyed");
    }
}
