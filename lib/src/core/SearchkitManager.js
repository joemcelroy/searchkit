var query_1 = require("./query");
var accessors_1 = require("./accessors");
var AccessorManager_1 = require("./AccessorManager");
var history_1 = require("./history");
var transport_1 = require("./transport");
var SearchRequest_1 = require("./SearchRequest");
var support_1 = require("./support");
var SearchkitVersion_1 = require("./SearchkitVersion");
var defaults = require("lodash/defaults");
var constant = require("lodash/constant");
var isEqual = require("lodash/isEqual");
var get = require("lodash/get");
require('es6-promise').polyfill();
var SearchkitManager = (function () {
    function SearchkitManager(host, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.VERSION = SearchkitVersion_1.VERSION;
        this.options = defaults(options, {
            useHistory: true,
            httpHeaders: {}
        });
        this.host = host;
        this.transport = this.options.transport || new transport_1.AxiosESTransport(host, {
            headers: this.options.httpHeaders,
            basicAuth: this.options.basicAuth
        });
        this.accessors = new AccessorManager_1.AccessorManager();
        this.registrationCompleted = new Promise(function (resolve) {
            _this.completeRegistration = resolve;
        });
        this.translateFunction = constant(undefined);
        // this.primarySearcher = this.createSearcher()
        this.query = new query_1.ImmutableQuery();
        this.emitter = new support_1.EventEmitter();
        this.initialLoading = true;
        if (this.options.useHistory) {
            this.history = history_1.createHistory();
            this.listenToHistory();
        }
    }
    SearchkitManager.mock = function () {
        return new SearchkitManager("/", {
            useHistory: false,
            transport: new transport_1.MockESTransport()
        });
    };
    SearchkitManager.prototype.addAccessor = function (accessor) {
        accessor.setSearchkitManager(this);
        return this.accessors.add(accessor);
    };
    SearchkitManager.prototype.addDefaultQuery = function (fn) {
        return this.addAccessor(new accessors_1.AnonymousAccessor(fn));
    };
    SearchkitManager.prototype.translate = function (key) {
        return this.translateFunction(key);
    };
    SearchkitManager.prototype.buildQuery = function () {
        return this.accessors.buildQuery();
    };
    SearchkitManager.prototype.resetState = function () {
        this.accessors.resetState();
    };
    SearchkitManager.prototype.unlistenHistory = function () {
        if (this.options.useHistory && this._unlistenHistory) {
            this._unlistenHistory();
        }
    };
    SearchkitManager.prototype.listenToHistory = function () {
        var _this = this;
        this._unlistenHistory = this.history.listen(function (location) {
            //action is POP when the browser modified
            if (location.action === "POP") {
                _this.registrationCompleted.then(function () {
                    _this.searchFromUrlQuery(location.query);
                }).catch(function (e) {
                    console.error(e.stack);
                });
            }
        });
    };
    SearchkitManager.prototype.searchFromUrlQuery = function (query) {
        this.accessors.setState(query);
        this._search();
    };
    SearchkitManager.prototype.performSearch = function (replaceState) {
        if (replaceState === void 0) { replaceState = false; }
        if (!isEqual(this.accessors.getState(), this.state)) {
            this.accessors.notifyStateChange(this.state);
        }
        this._search();
        if (this.options.useHistory) {
            var historyMethod = (replaceState) ?
                this.history.replaceState : this.history.pushState;
            historyMethod(null, window.location.pathname, this.state);
        }
    };
    SearchkitManager.prototype.search = function (replaceState) {
        if (replaceState === void 0) { replaceState = false; }
        this.performSearch(replaceState);
    };
    SearchkitManager.prototype._search = function () {
        this.state = this.accessors.getState();
        this.query = this.buildQuery();
        this.loading = true;
        this.emitter.trigger();
        this.currentSearchRequest && this.currentSearchRequest.deactivate();
        this.currentSearchRequest = new SearchRequest_1.SearchRequest(this.transport, this.query, this);
        this.currentSearchRequest.run();
    };
    SearchkitManager.prototype.setResults = function (results) {
        this.results = results;
        this.error = null;
        this.accessors.setResults(results);
        this.onResponseChange();
    };
    SearchkitManager.prototype.getHits = function () {
        return get(this.results, ["hits", "hits"], []);
    };
    SearchkitManager.prototype.getHitsCount = function () {
        return get(this.results, ["hits", "total"], 0);
    };
    SearchkitManager.prototype.getSuggestions = function () {
        return get(this.results, ["suggest", "suggestions"], {});
    };
    SearchkitManager.prototype.getQueryAccessor = function () {
        return this.accessors.queryAccessor;
    };
    SearchkitManager.prototype.hasHits = function () {
        return this.getHitsCount() > 0;
    };
    SearchkitManager.prototype.setError = function (error) {
        this.error = error;
        this.onResponseChange();
    };
    SearchkitManager.prototype.onResponseChange = function () {
        this.loading = false;
        this.initialLoading = false;
        this.emitter.trigger();
    };
    SearchkitManager.VERSION = SearchkitVersion_1.VERSION;
    return SearchkitManager;
})();
exports.SearchkitManager = SearchkitManager;
//# sourceMappingURL=SearchkitManager.js.map