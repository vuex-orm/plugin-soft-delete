function Model(context, model) {
    /**
     * Soft delete model(s) matching a condition.
     */
    model.softDelete = function (payload) {
        return this.dispatch('softDelete', payload);
    };
    /**
     * Soft delete a model instance.
     */
    model.prototype.$softDelete = async function (hydrate) {
        const model = await this.$dispatch('softDelete', this.$self().getIdFromRecord(this));
        if (hydrate) {
            this.$fill(model.$getAttributes());
            return this;
        }
        const { key, flagName } = context.createConfig(this.$self().softDeleteConfig);
        this[key] = model[key];
        this[flagName] = model[flagName];
        return model;
    };
    /**
     * Restore a model instance.
     */
    model.prototype.$restore = async function (hydrate) {
        const { key, flagName } = context.createConfig(this.$self().softDeleteConfig);
        const model = await this.$dispatch('update', {
            where: this.$self().getIdFromRecord(this),
            data: {
                [key]: null,
                [flagName]: false
            }
        });
        if (hydrate) {
            this.$fill(model.$getAttributes());
            return this;
        }
        this[key] = model[key];
        this[flagName] = model[flagName];
        return this;
    };
    /**
     * Determine if the model instance has been soft deleted.
     */
    model.prototype.$trashed = function () {
        const { flagName } = context.createConfig(this.$self().softDeleteConfig);
        return this[flagName] === true;
    };
    /**
     * Soft-delete a model instance.
     * This method is deprecated and will warn users until retired.
     * @deprecated since v1.2.0
     */
    model.prototype.softDelete = function (hydrate) {
        /* istanbul ignore next */
        if (process.env.NODE_ENV !== 'production') {
            console.warn('The `softDelete` instance method has been deprecated. Please use `$softDelete`.');
        }
        return this.$softDelete(hydrate);
    };
    /**
     * Add supporting attributes to model.
     */
    const $fields = model.prototype.$fields;
    model.prototype.$fields = function () {
        const fields = $fields.call(this);
        const { key, flagName } = context.createConfig(this.$self().softDeleteConfig);
        return Object.assign({}, fields, {
            [key]: this.$self().attr(null),
            [flagName]: this.$self().attr(false)
        });
    };
    /**
     * Flags are visible by default during model serialization. They can be hidden
     * by setting `exposeFlagsExternally` to false.
     */
    const $toJson = model.prototype.$toJson;
    model.prototype.$toJson = function () {
        const toJson = $toJson.call(this);
        const config = context.createConfig(this.$self().softDeleteConfig);
        if (config.exposeFlagsExternally !== true) {
            /* istanbul ignore next */
            const { [config.key]: k, [config.flagName]: fn, ...json } = toJson;
            return json;
        }
        return toJson;
    };
}

function Query(context, query) {
    /**
     * Determine if soft deleted models should be filtered exclusively.
     *   true  = only soft deletes
     *   false = include soft deletes
     *   null  = exclude soft deletes
     */
    query.prototype.softDeleteSelectFilter = null;
    /**
     * Constraint includes soft deleted models.
     */
    query.prototype.withTrashed = function () {
        this.softDeleteSelectFilter = false;
        return this;
    };
    /**
     * Constraint restricts to only soft deleted models.
     */
    query.prototype.onlyTrashed = function () {
        this.softDeleteSelectFilter = true;
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
    /**
     * Process the model(s) to be soft deleted.
     */
    query.prototype.softDelete = function (condition) {
        const { key, flagName, mutator } = context.createConfig(this.model.softDeleteConfig);
        let value = Date.now();
        value = typeof mutator === 'function' ? mutator(value) : value;
        const data = {
            [key]: value,
            [flagName]: true
        };
        if (Array.isArray(condition)) {
            // Array of primary keys
            if (!this.model.isCompositePrimaryKey()) {
                return this.model.update({
                    data,
                    where: (record) => condition.includes(record[record.$primaryKey()])
                });
            }
            // Array of composite primary keys
            if (condition.some((value) => Array.isArray(value))) {
                const keys = condition
                    .map((key) => Array.isArray(key) && JSON.stringify(key))
                    .filter(Boolean);
                return this.model.update({
                    data,
                    where: (record) => keys.includes(record.$id)
                });
            }
        }
        return this.model.update({ data, where: condition });
    };
    /**
     * Fetch all soft deletes from the store.
     */
    query.prototype.allTrashed = function () {
        return this.newQuery()
            .onlyTrashed()
            .get();
    };
    /**
     * Patch any new queries so that sub queries, such as relation queries,
     * can respect top level modifiers. For many-to-many relations, due to core
     * API limitations, we're forced to pass-through intermediate models.
     */
    const newQuery = query.prototype.newQuery;
    query.prototype.newQuery = function (entity) {
        const patchedQuery = newQuery.call(this, entity);
        // Only patch queries that are loading relations.
        const loadables = Object.keys(this.load);
        if (loadables.length > 0) {
            patchedQuery.softDeleteSelectFilter = this.softDeleteSelectFilter;
            if (entity && entity !== this.entity && this.model.hasPivotFields()) {
                const fields = this.model.pivotFields().reduce((fields, field) => {
                    Object.keys(field)
                        .filter((entity) => loadables.includes(entity))
                        .forEach((entity) => {
                        fields.push(field[entity].pivot.entity);
                    });
                    return fields;
                }, []);
                // Release an entity that is an intermediate to a loadable relation.
                if (fields.includes(entity)) {
                    patchedQuery.softDeleteSelectFilter = false;
                }
            }
        }
        return patchedQuery;
    };
    /**
     * Fetch all soft deletes from the store and group by entity.
     */
    query.allTrashed = function (store) {
        const database = store.$db();
        const models = database.models();
        return Object.keys(models).reduce((collection, entity) => {
            collection[entity] = new this(store, entity).onlyTrashed().get();
            return collection;
        }, {});
    };
    /**
     * Global select hook prevents soft deleted models from being selected unless
     * queries are explicity chained with `withTrashed` or `onlyTrashed`.
     */
    query.on('beforeSelect', function (models) {
        return models.filter((model) => {
            // Only soft deletes
            if (this.softDeleteSelectFilter === true) {
                return model.$trashed();
            }
            // Include soft deletes
            if (this.softDeleteSelectFilter === false) {
                return models;
            }
            // Exclude soft deletes
            return !model.$trashed();
        });
    });
}

function Actions(_context, actions) {
    /**
     * Soft delete records and persist to the store.
     */
    actions.softDelete = async (context, payload) => {
        var _a;
        const state = context.state;
        const entity = state.$name;
        const where = (_a = payload.where) !== null && _a !== void 0 ? _a : payload;
        return context.dispatch(`${state.$connection}/softDelete`, { entity, where }, { root: true });
    };
}

function Getters(_context, getters) {
    /**
     * Get all trashed records from the store and group by entity.
     */
    getters.allTrashed = (state, _getters, _rootState, rootGetters) => () => {
        return rootGetters[`${state.$connection}/allTrashed`](state.$name);
    };
}

function RootActions(context, rootActions) {
    /**
     * Soft delete records and persist the store.
     */
    rootActions.softDelete = async function (_context, payload) {
        const { entity, where } = payload;
        return new context.query(this, entity).softDelete(where);
    };
}

function RootGetters(context, rootGetters) {
    /**
     * Get all trashed records belonging to an entity.
     */
    rootGetters.allTrashed = function (_state) {
        return (entity) => {
            if (entity) {
                return new context.query(this, entity).allTrashed();
            }
            return context.query.allTrashed(this);
        };
    };
}

const GlobalConfig = {
    key: 'deleted_at',
    flagName: '$isDeleted',
    exposeFlagsExternally: true,
    mutator: null
};

class VuexORMSoftDelete {
    /**
     * Create a new plugin instance.
     */
    constructor(components, config) {
        this.model = components.Model;
        this.query = components.Query;
        this.actions = components.Actions;
        this.getters = components.Getters;
        this.rootActions = components.RootActions;
        this.rootGetters = components.RootGetters;
        this.config = this.createConfig(config);
    }
    /**
     * Create a new config by merging with global user-defined config.
     * Allows for generating local configs such as on a per-model basis.
     */
    createConfig(config) {
        return {
            ...GlobalConfig,
            ...this.config,
            ...config
        };
    }
    /**
     * Plugin features.
     */
    plugin() {
        Model(this, this.model);
        Query(this, this.query);
        Actions(this, this.actions);
        Getters(this, this.getters);
        RootActions(this, this.rootActions);
        RootGetters(this, this.rootGetters);
    }
}

var index = {
    install(components, config) {
        new VuexORMSoftDelete(components, config).plugin();
    }
};

export default index;
