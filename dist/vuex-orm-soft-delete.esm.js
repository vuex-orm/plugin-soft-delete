/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function Model(context, model) {
    /**
     * Flags are visible by default during model serialization.
     * They can be hidden by setting `exposeFlagsExternally` to false.
     */
    var $fields = model.prototype.$fields;
    model.prototype.$fields = function () {
        var _a;
        var fields = $fields.call(this);
        var _b = context.createConfig(this.$self().softDeleteConfig), key = _b.key, flagName = _b.flagName;
        return Object.assign({}, fields, (_a = {},
            _a[key] = this.$self().attr(null),
            _a[flagName] = this.$self().attr(false),
            _a));
    };
    /**
     * Flags are visible by default during model serialization.
     * They can be hidden by setting `exposeFlagsExternally` to false.
     */
    var $toJson = model.prototype.$toJson;
    model.prototype.$toJson = function () {
        var toJson = $toJson.call(this);
        var config = context.createConfig(this.$self().softDeleteConfig);
        if (config.exposeFlagsExternally !== true) {
            /* istanbul ignore next */
            var _a = toJson, _b = config.key, k = _a[_b], _c = config.flagName, fn = _a[_c], json = __rest(_a, [typeof _b === "symbol" ? _b : _b + "", typeof _c === "symbol" ? _c : _c + ""]);
            return json;
        }
        return toJson;
    };
    /**
     * ...
     */
    var $fill = model.prototype.$fill;
    model.prototype.$fill = function (record) {
        var _a, _b;
        $fill.call(this, record);
        if (record) {
            var _c = context.createConfig(this.$self().softDeleteConfig), key = _c.key, flagName = _c.flagName;
            this[key] = (_a = record[key]) !== null && _a !== void 0 ? _a : null;
            this[flagName] = (_b = record[flagName]) !== null && _b !== void 0 ? _b : false;
        }
    };
    /**
     * Soft delete the record on a model instance.
     */
    model.prototype.$softDelete = function () {
        return __awaiter(this, void 0, void 0, function () {
            var record, _a, key, flagName;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.$dispatch('softDelete', this.$self().getIdFromRecord(this))];
                    case 1:
                        record = _b.sent();
                        _a = context.createConfig(this.$self().softDeleteConfig), key = _a.key, flagName = _a.flagName;
                        this[key] = record[key];
                        this[flagName] = record[flagName];
                        return [2 /*return*/, record];
                }
            });
        });
    };
    /**
     * Soft delete the record on a model instance.
     * This method is deprecated and will continue to warn dev environments of
     * this deprecation until completely removed.
     * @deprecated since v1.2.0
     */
    model.prototype.softDelete = function () {
        /* istanbul ignore next */
        if (process.env.NODE_ENV !== 'production') {
            console.warn('The `softDelete` instance method has been deprecated. Please use `$softDelete`.');
        }
        return this.$softDelete();
    };
    /**
     * Determine if the instance has been soft deleted.
     */
    model.prototype.trashed = function () {
        var flagName = context.createConfig(this.$self().softDeleteConfig).flagName;
        return this[flagName] === true;
    };
    /**
     * Soft delete record(s) matching a condition.
     */
    model.softDelete = function (payload) {
        return this.dispatch('softDelete', payload);
    };
}

function Query(context, query) {
    /**
     * Determine if soft deletes should be filtered exclusively.
     *   true  = only soft deletes
     *   false = include soft deletes
     *   null  = exclude soft deletes
     */
    query.prototype.softDeletesFilter = null;
    /**
     * Constraint includes soft deletes.
     */
    query.prototype.withTrashed = function () {
        this.softDeletesFilter = false;
        return this;
    };
    /**
     * Constraint restricts to only soft deletes.
     */
    query.prototype.onlyTrashed = function () {
        this.softDeletesFilter = true;
        return this;
    };
    /**
     * Deprecated alias method for `onlyTrashed`.
     * @deprecated since v1.2.0
     */
    query.prototype.trashed = function () {
        /* istanbul ignore next */
        if (process.env.NODE_ENV !== 'production') {
            console.warn('The `trashed` method has been deprecated. Please use `onlyTrashed`.');
        }
        return this.onlyTrashed();
    };
    query.prototype.softDelete = function (condition) {
        var _a;
        var config = context.createConfig(this.model.softDeleteConfig);
        var value = Date.now();
        value = typeof config.mutator === 'function' ? config.mutator(value) : value;
        var data = (_a = {},
            _a[config.key] = value,
            _a[config.flagName] = true,
            _a);
        if (Array.isArray(condition)) {
            // Array of primary keys
            if (!this.model.isCompositePrimaryKey()) {
                return this.model.update({
                    data: data,
                    where: function (r) { return condition.includes(r[r.$primaryKey()]); }
                });
            }
            // Array of composite primary keys
            if (condition.some(function (value) { return Array.isArray(value); })) {
                var keys_1 = condition
                    .map(function (key) { return Array.isArray(key) && JSON.stringify(key); })
                    .filter(Boolean);
                return this.model.update({
                    data: data,
                    where: function (record) { return keys_1.includes(record.$id); }
                });
            }
        }
        return this.model.update({
            data: data,
            where: condition
        });
    };
    /**
     * Fetch all soft deletes from the store
     */
    query.prototype.allTrashed = function () {
        return this.onlyTrashed().get();
    };
    /**
     * Fetch all soft deletes from the store and group them by entity.
     */
    query.allTrashed = function (store) {
        var _this = this;
        var database = store.$db();
        var models = database.models();
        return Object.keys(models).reduce(function (collection, entity) {
            collection[entity] = new _this(store, entity).onlyTrashed().get();
            return collection;
        }, {});
    };
    /**
     * Global select hook prevents soft deletes being selected unless queries are
     * explicity used with `withTrashed` or `onlyTrashed`.
     */
    query.on('beforeSelect', function (models) {
        var _this = this;
        return models.filter(function (model) {
            // Only soft deletes.
            if (_this.softDeletesFilter === true) {
                return model.trashed();
            }
            // Include soft deletes.
            if (_this.softDeletesFilter === false) {
                return models;
            }
            // Exclude soft deletes.
            return !model.trashed();
        });
    });
}

function Modules(context, modules) {
    var _this = this;
    /**
     * Soft delete records from the store.
     */
    modules.actions.softDelete = function (context, payload) { return __awaiter(_this, void 0, void 0, function () {
        var state, entity, where;
        var _a;
        return __generator(this, function (_b) {
            state = context.state;
            entity = state.$name;
            where = (_a = payload.where) !== null && _a !== void 0 ? _a : payload;
            return [2 /*return*/, context.dispatch(state.$connection + "/softDelete", { entity: entity, where: where }, { root: true })];
        });
    }); };
    /**
     * Soft delete records from the store.
     */
    modules.rootActions.softDelete = function (_context, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var entity, where;
            return __generator(this, function (_a) {
                entity = payload.entity, where = payload.where;
                return [2 /*return*/, new context.query(this, entity).softDelete(where)];
            });
        });
    };
    /**
     * Get all soft deletes keyed by entity.
     */
    modules.getters.allTrashed = function (state, _getters, _rootState, rootGetters) { return function () {
        return rootGetters[state.$connection + "/allTrashed"](state.$name);
    }; };
    /**
     * Get all soft deletes of given entity.
     */
    modules.rootGetters.allTrashed = function (_state) {
        var _this = this;
        return function (entity) {
            if (entity) {
                return new context.query(_this, entity).allTrashed();
            }
            return context.query.allTrashed(_this);
        };
    };
}

var GlobalConfig = {
    key: 'deleted_at',
    flagName: '$isDeleted',
    exposeFlagsExternally: true,
    mutator: null
};

var VuexORMSoftDelete = /** @class */ (function () {
    /**
     * Create a new plugin instance.
     */
    function VuexORMSoftDelete(components, config) {
        this.model = components.Model;
        this.query = components.Query;
        this.modules = {
            actions: components.Actions,
            getters: components.Getters,
            rootGetters: components.RootGetters,
            rootActions: components.RootActions
        };
        this.config = this.createConfig(config);
    }
    /**
     * Create a new config by merging with global user-defined config.
     * Allows for generating local configs such as on a per-model basis.
     */
    VuexORMSoftDelete.prototype.createConfig = function (config) {
        return __assign(__assign(__assign({}, GlobalConfig), this.config), config);
    };
    /**
     * Plugin features.
     */
    VuexORMSoftDelete.prototype.plugin = function () {
        Model(this, this.model);
        Query(this, this.query);
        Modules(this, this.modules);
    };
    return VuexORMSoftDelete;
}());

var index = {
    install: function (components, config) {
        new VuexORMSoftDelete(components, config).plugin();
    }
};

export default index;
