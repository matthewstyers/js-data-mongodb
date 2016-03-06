'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var mongodb = require('mongodb');
var bson = require('bson');
var jsData = require('js-data');
var Adapter = require('js-data-adapter');
var Adapter__default = _interopDefault(Adapter);
var underscore = _interopDefault(require('mout/string/underscore'));
var unique = _interopDefault(require('mout/array/unique'));

var babelHelpers = {};

babelHelpers.defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

babelHelpers;

var addHiddenPropsToTarget = jsData.utils.addHiddenPropsToTarget;
var classCallCheck = jsData.utils.classCallCheck;
var extend = jsData.utils.extend;
var fillIn = jsData.utils.fillIn;
var forEachRelation = jsData.utils.forEachRelation;
var forOwn = jsData.utils.forOwn;
var get = jsData.utils.get;
var isArray = jsData.utils.isArray;
var isObject = jsData.utils.isObject;
var isString = jsData.utils.isString;
var isUndefined = jsData.utils.isUndefined;
var omit = jsData.utils.omit;
var plainCopy = jsData.utils.plainCopy;
var resolve = jsData.utils.resolve;


var withoutRelations = function withoutRelations(mapper, props) {
  return omit(props, mapper.relationFields || []);
};

var DEFAULTS = {
  /**
   * Convert ObjectIDs to strings when pulling records out of the database.
   *
   * @name MongoDBAdapter#translateId
   * @type {boolean}
   * @default true
   */
  translateId: true,

  /**
   * MongoDB URI.
   *
   * @name MongoDBAdapter#uri
   * @type {string}
   * @default mongodb://localhost:27017
   */
  uri: 'mongodb://localhost:27017'
};

var FIND_OPTS_DEFAULTS = {};
var FIND_ONE_OPTS_DEFAULTS = {};
var INSERT_OPTS_DEFAULTS = {};
var INSERT_MANY_OPTS_DEFAULTS = {};
var UPDATE_OPTS_DEFAULTS = {};
var REMOVE_OPTS_DEFAULTS = {};

/**
 * MongoDBAdapter class.
 *
 * @example
 * // Use Container instead of DataStore on the server
 * import {Container} from 'js-data'
 * import MongoDBAdapter from 'js-data-mongodb'
 *
 * // Create a store to hold your Mappers
 * const store = new Container({
 *   mapperDefaults: {
 *     // MongoDB uses "_id" as the primary key
 *     idAttribute: '_id'
 *   }
 * })
 *
 * // Create an instance of MongoDBAdapter with default settings
 * const adapter = new MongoDBAdapter()
 *
 * // Mappers in "store" will use the MongoDB adapter by default
 * store.registerAdapter('mongodb', adapter, { default: true })
 *
 * // Create a Mapper that maps to a "user" collection
 * store.defineMapper('user')
 *
 * @class MongoDBAdapter
 * @extends Adapter
 * @param {Object} [opts] Configuration opts.
 * @param {boolean} [opts.debug=false] Whether to log debugging information.
 * @param {Object} [opts.findOpts] Options to pass to collection#find.
 * @param {Object} [opts.findOneOpts] Options to pass to collection#findOne.
 * @param {Object} [opts.insertOpts] Options to pass to collection#insert.
 * @param {Object} [opts.insertManyOpts] Options to pass to
 * collection#insertMany.
 * @param {boolean} [opts.raw=false] Whether to return detailed result objects
 * instead of just record data.
 * @param {Object} [opts.removeOpts] Options to pass to collection#remove.
 * @param {boolean} [opts.translateId=true] Convert ObjectIDs to strings when
 * pulling records out of the database.
 * @param {Object} [opts.updateOpts] Options to pass to collection#update.
 * @param {string} [opts.uri="mongodb://localhost:27017"] MongoDB URI.
 */
function MongoDBAdapter(opts) {
  var self = this;
  classCallCheck(self, MongoDBAdapter);
  opts || (opts = {});
  if (isString(opts)) {
    opts = { uri: opts };
  }
  fillIn(opts, DEFAULTS);
  Adapter__default.call(self, opts);

  /**
   * Default options to pass to collection#find.
   *
   * @name MongoDBAdapter#findOpts
   * @type {Object}
   * @default {}
   */
  self.findOpts || (self.findOpts = {});
  fillIn(self.findOpts, FIND_OPTS_DEFAULTS);

  /**
   * Default options to pass to collection#findOne.
   *
   * @name MongoDBAdapter#findOneOpts
   * @type {Object}
   * @default {}
   */
  self.findOneOpts || (self.findOneOpts = {});
  fillIn(self.findOneOpts, FIND_ONE_OPTS_DEFAULTS);

  /**
   * Default options to pass to collection#insert.
   *
   * @name MongoDBAdapter#insertOpts
   * @type {Object}
   * @default {}
   */
  self.insertOpts || (self.insertOpts = {});
  fillIn(self.insertOpts, INSERT_OPTS_DEFAULTS);

  /**
   * Default options to pass to collection#insertMany.
   *
   * @name MongoDBAdapter#insertManyOpts
   * @type {Object}
   * @default {}
   */
  self.insertManyOpts || (self.insertManyOpts = {});
  fillIn(self.insertManyOpts, INSERT_MANY_OPTS_DEFAULTS);

  /**
   * Default options to pass to collection#update.
   *
   * @name MongoDBAdapter#updateOpts
   * @type {Object}
   * @default {}
   */
  self.updateOpts || (self.updateOpts = {});
  fillIn(self.updateOpts, UPDATE_OPTS_DEFAULTS);

  /**
   * Default options to pass to collection#update.
   *
   * @name MongoDBAdapter#removeOpts
   * @type {Object}
   * @default {}
   */
  self.removeOpts || (self.removeOpts = {});
  fillIn(self.removeOpts, REMOVE_OPTS_DEFAULTS);

  /**
   * A Promise that resolves to a reference to the MongoDB client being used by
   * this adapter.
   *
   * @name MongoDBAdapter#client
   * @type {Object}
   */
  self.client = new Promise(function (resolve, reject) {
    mongodb.MongoClient.connect(opts.uri, function (err, db) {
      return err ? reject(err) : resolve(db);
    });
  });
}

// Setup prototype inheritance from Adapter
MongoDBAdapter.prototype = Object.create(Adapter__default.prototype, {
  constructor: {
    value: MongoDBAdapter,
    enumerable: false,
    writable: true,
    configurable: true
  }
});

Object.defineProperty(MongoDBAdapter, '__super__', {
  configurable: true,
  value: Adapter__default
});

/**
 * Alternative to ES6 class syntax for extending `MongoDBAdapter`.
 *
 * @name MongoDBAdapter.extend
 * @method
 * @param {Object} [instanceProps] Properties that will be added to the
 * prototype of the MongoDBAdapter.
 * @param {Object} [classProps] Properties that will be added as static
 * properties to the MongoDBAdapter itself.
 * @return {Object} MongoDBAdapter of `MongoDBAdapter`.
 */
MongoDBAdapter.extend = extend;

addHiddenPropsToTarget(MongoDBAdapter.prototype, {
  /**
   * Translate ObjectIDs to strings.
   *
   * @name MongoDBAdapter#_translateId
   * @method
   * @return {*}
   */

  _translateId: function _translateId(r, opts) {
    opts || (opts = {});
    if (this.getOpt('translateId', opts)) {
      if (isArray(r)) {
        r.forEach(function (_r) {
          var __id = _r._id ? _r._id.toString() : _r._id;
          _r._id = typeof __id === 'string' ? __id : _r._id;
        });
      } else if (isObject(r)) {
        var __id = r._id ? r._id.toString() : r._id;
        r._id = typeof __id === 'string' ? __id : r._id;
      }
    }
    return r;
  },


  /**
   * Return a Promise that resolves to a reference to the MongoDB client being
   * used by this adapter.
   *
   * Useful when you need to do anything custom with the MongoDB client library.
   *
   * @name MongoDBAdapter#getClient
   * @method
   * @return {Object} MongoDB client.
   */
  getClient: function getClient() {
    return this.client;
  },


  /**
   * Map filtering params in a selection query to MongoDB a filtering object.
   *
   * Handles the following:
   *
   * - where
   *   - and bunch of filtering operators
   *
   * @name MongoDBAdapter#getQuery
   * @method
   * @return {Object}
   */
  getQuery: function getQuery(mapper, query) {
    query = plainCopy(query || {});
    query.where || (query.where = {});

    forOwn(query, function (config, keyword) {
      if (Adapter.reserved.indexOf(keyword) === -1) {
        if (isObject(config)) {
          query.where[keyword] = config;
        } else {
          query.where[keyword] = {
            '==': config
          };
        }
        delete query[keyword];
      }
    });

    var mongoQuery = {};

    if (Object.keys(query.where).length !== 0) {
      forOwn(query.where, function (criteria, field) {
        if (!isObject(criteria)) {
          query.where[field] = {
            '==': criteria
          };
        }
        forOwn(criteria, function (v, op) {
          if (op === '==' || op === '===' || op === 'contains') {
            mongoQuery[field] = v;
          } else if (op === '!=' || op === '!==' || op === 'notContains') {
            mongoQuery[field] = mongoQuery[field] || {};
            mongoQuery[field].$ne = v;
          } else if (op === '>') {
            mongoQuery[field] = mongoQuery[field] || {};
            mongoQuery[field].$gt = v;
          } else if (op === '>=') {
            mongoQuery[field] = mongoQuery[field] || {};
            mongoQuery[field].$gte = v;
          } else if (op === '<') {
            mongoQuery[field] = mongoQuery[field] || {};
            mongoQuery[field].$lt = v;
          } else if (op === '<=') {
            mongoQuery[field] = mongoQuery[field] || {};
            mongoQuery[field].$lte = v;
          } else if (op === 'in') {
            mongoQuery[field] = mongoQuery[field] || {};
            mongoQuery[field].$in = v;
          } else if (op === 'notIn') {
            mongoQuery[field] = mongoQuery[field] || {};
            mongoQuery[field].$nin = v;
          } else if (op === '|==' || op === '|===' || op === '|contains') {
            mongoQuery.$or = mongoQuery.$or || [];
            var orEqQuery = {};
            orEqQuery[field] = v;
            mongoQuery.$or.push(orEqQuery);
          } else if (op === '|!=' || op === '|!==' || op === '|notContains') {
            mongoQuery.$or = mongoQuery.$or || [];
            var orNeQuery = {};
            orNeQuery[field] = {
              '$ne': v
            };
            mongoQuery.$or.push(orNeQuery);
          } else if (op === '|>') {
            mongoQuery.$or = mongoQuery.$or || [];
            var orGtQuery = {};
            orGtQuery[field] = {
              '$gt': v
            };
            mongoQuery.$or.push(orGtQuery);
          } else if (op === '|>=') {
            mongoQuery.$or = mongoQuery.$or || [];
            var orGteQuery = {};
            orGteQuery[field] = {
              '$gte': v
            };
            mongoQuery.$or.push(orGteQuery);
          } else if (op === '|<') {
            mongoQuery.$or = mongoQuery.$or || [];
            var orLtQuery = {};
            orLtQuery[field] = {
              '$lt': v
            };
            mongoQuery.$or.push(orLtQuery);
          } else if (op === '|<=') {
            mongoQuery.$or = mongoQuery.$or || [];
            var orLteQuery = {};
            orLteQuery[field] = {
              '$lte': v
            };
            mongoQuery.$or.push(orLteQuery);
          } else if (op === '|in') {
            mongoQuery.$or = mongoQuery.$or || [];
            var orInQuery = {};
            orInQuery[field] = {
              '$in': v
            };
            mongoQuery.$or.push(orInQuery);
          } else if (op === '|notIn') {
            mongoQuery.$or = mongoQuery.$or || [];
            var orNinQuery = {};
            orNinQuery[field] = {
              '$nin': v
            };
            mongoQuery.$or.push(orNinQuery);
          }
        });
      });
    }

    return mongoQuery;
  },


  /**
   * Map non-filtering params in a selection query to MongoDB query options.
   *
   * Handles the following:
   *
   * - limit
   * - skip/offset
   * - orderBy/sort
   *
   * @name MongoDBAdapter#getQueryOptions
   * @method
   * @return {Object}
   */
  getQueryOptions: function getQueryOptions(mapper, query) {
    query = plainCopy(query || {});
    query.orderBy = query.orderBy || query.sort;
    query.skip = query.skip || query.offset;

    var queryOptions = {};

    if (query.orderBy) {
      if (isString(query.orderBy)) {
        query.orderBy = [[query.orderBy, 'asc']];
      }
      for (var i = 0; i < query.orderBy.length; i++) {
        if (isString(query.orderBy[i])) {
          query.orderBy[i] = [query.orderBy[i], 'asc'];
        }
      }
      queryOptions.sort = query.orderBy;
    }

    if (query.skip) {
      queryOptions.skip = +query.skip;
    }

    if (query.limit) {
      queryOptions.limit = +query.limit;
    }

    return queryOptions;
  },


  /**
   * Turn an _id into an ObjectID if it isn't already an ObjectID.
   *
   * @name MongoDBAdapter#toObjectID
   * @method
   * @return {*}
   */
  toObjectID: function toObjectID(mapper, id) {
    if (id !== undefined && mapper.idAttribute === '_id' && typeof id === 'string' && bson.ObjectID.isValid(id) && !(id instanceof bson.ObjectID)) {
      return new bson.ObjectID(id);
    }
    return id;
  },


  /**
   * Return the foreignKey from the given record for the provided relationship.
   *
   * @name MongoDBAdapter#makeBelongsToForeignKey
   * @method
   * @return {*}
   */
  makeBelongsToForeignKey: function makeBelongsToForeignKey(mapper, def, record) {
    return this.toObjectID(def.getRelation(), Adapter__default.prototype.makeBelongsToForeignKey.call(this, mapper, def, record));
  },


  /**
   * Retrieve the record with the given primary key.
   *
   * @name MongoDBAdapter#find
   * @method
   * @param {Object} mapper The mapper.
   * @param {(string|number)} id Primary key of the record to retrieve.
   * @param {Object} [opts] Configuration options.
   * @param {Object} [opts.findOneOpts] Options to pass to collection#findOne.
   * @param {boolean} [opts.raw=false] Whether to return a more detailed
   * response object.
   * @param {string[]} [opts.with=[]] Relations to eager load.
   * @return {Promise}
   */
  find: function find(mapper, id, opts) {
    var self = this;
    var record = void 0,
        op = void 0;
    opts || (opts = {});
    opts.with || (opts.with = []);

    var findOneOpts = self.getOpt('findOneOpts', opts);
    findOneOpts.fields || (findOneOpts.fields = {});

    return self.getClient().then(function (client) {
      // beforeFind lifecycle hook
      op = opts.op = 'beforeFind';
      return resolve(self[op](mapper, id, opts)).then(function () {
        return new Promise(function (resolve, reject) {
          var mongoQuery = {};
          mongoQuery[mapper.idAttribute] = self.toObjectID(mapper, id);
          client.collection(mapper.table || underscore(mapper.name)).findOne(mongoQuery, findOneOpts, function (err, cursor) {
            return err ? reject(err) : resolve(cursor);
          });
        });
      });
    }).then(function (_record) {
      if (!_record) {
        return;
      }
      record = _record;
      self._translateId(record, opts);
      var tasks = [];

      forEachRelation(mapper, opts, function (def, __opts) {
        var relatedMapper = def.getRelation();
        var task = void 0;

        if (def.foreignKey && (def.type === 'hasOne' || def.type === 'hasMany')) {
          if (def.type === 'hasOne') {
            task = self.loadHasOne(mapper, def, record, __opts);
          } else {
            task = self.loadHasMany(mapper, def, record, __opts);
          }
        } else if (def.type === 'hasMany' && def.localKeys) {
          var localKeys = [];
          var itemKeys = get(record, def.localKeys) || [];
          itemKeys = isArray(itemKeys) ? itemKeys : Object.keys(itemKeys);
          localKeys = localKeys.concat(itemKeys);
          task = self.findAll(relatedMapper, {
            where: babelHelpers.defineProperty({}, relatedMapper.idAttribute, {
              'in': unique(localKeys).filter(function (x) {
                return x;
              }).map(function (x) {
                return self.toObjectID(relatedMapper, x);
              })
            })
          }, __opts).then(function (relatedItems) {
            def.setLocalField(record, relatedItems);
          });
        } else if (def.type === 'hasMany' && def.foreignKeys) {
          task = self.findAll(relatedMapper, {
            where: babelHelpers.defineProperty({}, def.foreignKeys, {
              'contains': self.makeHasManyForeignKeys(mapper, def, record)
            })
          }, __opts).then(function (relatedItems) {
            def.setLocalField(record, relatedItems);
          });
        } else if (def.type === 'belongsTo') {
          task = self.loadBelongsTo(mapper, def, record, __opts);
        }
        if (task) {
          tasks.push(task);
        }
      });

      return Promise.all(tasks);
    }).then(function () {
      var response = new Adapter.Response(record, {}, 'find');
      response.found = record ? 1 : 0;
      response = self.respond(response, opts);

      // afterFind lifecycle hook
      op = opts.op = 'afterFind';
      return resolve(self[op](mapper, id, opts, response)).then(function (_response) {
        // Allow for re-assignment from lifecycle hook
        return isUndefined(_response) ? response : _response;
      });
    });
  },


  /**
   * Retrieve the records that match the selection query.
   *
   * @name MongoDBAdapter#findAll
   * @method
   * @param {Object} mapper The mapper.
   * @param {Object} query Selection query.
   * @param {Object} [opts] Configuration options.
   * @param {Object} [opts.findOpts] Options to pass to collection#find.
   * @param {boolean} [opts.raw=false] Whether to return a more detailed
   * response object.
   * @param {string[]} [opts.with=[]] Relations to eager load.
   * @return {Promise}
   */
  findAll: function findAll(mapper, query, opts) {
    var self = this;
    opts || (opts = {});
    opts.with || (opts.with = []);

    var records = [];
    var op = void 0;
    var findOpts = self.getOpt('findOpts', opts);
    fillIn(findOpts, self.getQueryOptions(mapper, query));
    findOpts.fields || (findOpts.fields = {});
    var mongoQuery = self.getQuery(mapper, query);

    return self.getClient().then(function (client) {
      // beforeFindAll lifecycle hook
      op = opts.op = 'beforeFindAll';
      return resolve(self[op](mapper, query, opts)).then(function () {
        return new Promise(function (resolve, reject) {
          client.collection(mapper.table || underscore(mapper.name)).find(mongoQuery, findOpts).toArray(function (err, cursor) {
            return err ? reject(err) : resolve(cursor);
          });
        });
      });
    }).then(function (_records) {
      records = _records;
      self._translateId(records, opts);
      var tasks = [];
      forEachRelation(mapper, opts, function (def, __opts) {
        var relatedMapper = def.getRelation();
        var task = void 0;
        if (def.foreignKey && (def.type === 'hasOne' || def.type === 'hasMany')) {
          if (def.type === 'hasMany') {
            task = self.loadHasMany(mapper, def, records, __opts);
          } else {
            task = self.loadHasOne(mapper, def, records, __opts);
          }
        } else if (def.type === 'hasMany' && def.localKeys) {
          (function () {
            var localKeys = [];
            records.forEach(function (item) {
              var itemKeys = item[def.localKeys] || [];
              itemKeys = isArray(itemKeys) ? itemKeys : Object.keys(itemKeys);
              localKeys = localKeys.concat(itemKeys);
            });
            task = self.findAll(relatedMapper, {
              where: babelHelpers.defineProperty({}, relatedMapper.idAttribute, {
                'in': unique(localKeys).filter(function (x) {
                  return x;
                }).map(function (x) {
                  return self.toObjectID(relatedMapper, x);
                })
              })
            }, __opts).then(function (relatedItems) {
              records.forEach(function (item) {
                var attached = [];
                var itemKeys = get(item, def.localKeys) || [];
                itemKeys = isArray(itemKeys) ? itemKeys : Object.keys(itemKeys);
                relatedItems.forEach(function (relatedItem) {
                  if (itemKeys && itemKeys.indexOf(relatedItem[relatedMapper.idAttribute]) !== -1) {
                    attached.push(relatedItem);
                  }
                });
                def.setLocalField(item, attached);
              });
              return relatedItems;
            });
          })();
        } else if (def.type === 'hasMany' && def.foreignKeys) {
          throw new Error('findAll eager load hasMany foreignKeys not supported!');
        } else if (def.type === 'belongsTo') {
          task = self.loadBelongsTo(mapper, def, records, __opts);
        }
        if (task) {
          tasks.push(task);
        }
      });
      return Promise.all(tasks);
    }).then(function () {
      records || (records = []);
      var response = new Adapter.Response(records, {}, 'findAll');
      response.found = records.length;
      response = self.respond(response, opts);

      // afterFindAll lifecycle hook
      op = opts.op = 'afterFindAll';
      return resolve(self[op](mapper, query, opts, response)).then(function (_response) {
        // Allow for re-assignment from lifecycle hook
        return isUndefined(_response) ? response : _response;
      });
    });
  },


  /**
   * Create a new record.
   *
   * @name MongoDBAdapter#create
   * @method
   * @param {Object} mapper The mapper.
   * @param {Object} props The record to be created.
   * @param {Object} [opts] Configuration options.
   * @param {Object} [opts.insertOpts] Options to pass to collection#insert.
   * @param {boolean} [opts.raw=false] Whether to return a more detailed
   * response object.
   * @return {Promise}
   */
  create: function create(mapper, props, opts) {
    var self = this;
    var op = void 0;
    props || (props = {});
    opts || (opts = {});

    var insertOpts = self.getOpt('insertOpts', opts);

    return self.getClient().then(function (client) {
      // beforeCreate lifecycle hook
      op = opts.op = 'beforeCreate';
      return resolve(self[op](mapper, props, opts)).then(function (_props) {
        // Allow for re-assignment from lifecycle hook
        props = isUndefined(_props) ? props : _props;
        _props = withoutRelations(mapper, props);
        return new Promise(function (resolve, reject) {
          var collection = client.collection(mapper.table || underscore(mapper.name));
          var method = collection.insertOne ? 'insertOne' : 'insert';
          collection[method](_props, insertOpts, function (err, cursor) {
            return err ? reject(err) : resolve(cursor);
          });
        });
      }).then(function (cursor) {
        var record = void 0;
        var r = cursor.ops ? cursor.ops : cursor;
        self._translateId(r, opts);
        record = isArray(r) ? r[0] : r;
        cursor.connection = undefined;
        var response = new Adapter.Response(record, cursor, 'create');
        response.created = record ? 1 : 0;
        response = self.respond(response, opts);

        // afterCreate lifecycle hook
        op = opts.op = 'afterCreate';
        return resolve(self[op](mapper, props, opts, response)).then(function (_response) {
          // Allow for re-assignment from lifecycle hook
          return isUndefined(_response) ? response : _response;
        });
      });
    });
  },


  /**
   * Create multiple records in a single batch.
   *
   * @name MongoDBAdapter#createMany
   * @method
   * @param {Object} mapper The mapper.
   * @param {Object} props The records to be created.
   * @param {Object} [opts] Configuration options.
   * @param {Object} [opts.insertManyOpts] Options to pass to
   * collection#insertMany.
   * @param {boolean} [opts.raw=false] Whether to return a more detailed
   * response object.
   * @return {Promise}
   */
  createMany: function createMany(mapper, props, opts) {
    var self = this;
    var op = void 0;
    props || (props = {});
    opts || (opts = {});

    var insertManyOpts = self.getOpt('insertManyOpts', opts);

    return self.getClient().then(function (client) {
      // beforeCreateMany lifecycle hook
      op = opts.op = 'beforeCreateMany';
      return resolve(self[op](mapper, props, opts)).then(function (_props) {
        // Allow for re-assignment from lifecycle hook
        props = isUndefined(_props) ? props : _props;
        _props = props.map(function (record) {
          return withoutRelations(mapper, record);
        });
        return new Promise(function (resolve, reject) {
          var collection = client.collection(mapper.table || underscore(mapper.name));
          collection.insertMany(_props, insertManyOpts, function (err, cursor) {
            return err ? reject(err) : resolve(cursor);
          });
        });
      }).then(function (cursor) {
        var records = [];
        var r = cursor.ops ? cursor.ops : cursor;
        self._translateId(r, opts);
        records = r;
        cursor.connection = undefined;
        var response = new Adapter.Response(records, cursor, 'createMany');
        response.created = records.length;
        response = self.respond(response, opts);

        // afterCreateMany lifecycle hook
        op = opts.op = 'afterCreateMany';
        return resolve(self[op](mapper, props, opts, response)).then(function (_response) {
          // Allow for re-assignment from lifecycle hook
          return isUndefined(_response) ? response : _response;
        });
      });
    });
  },


  /**
   * Destroy the record with the given primary key.
   *
   * @name MongoDBAdapter#destroy
   * @method
   * @param {Object} mapper The mapper.
   * @param {(string|number)} id Primary key of the record to destroy.
   * @param {Object} [opts] Configuration options.
   * @param {boolean} [opts.raw=false] Whether to return a more detailed
   * response object.
   * @param {Object} [opts.removeOpts] Options to pass to collection#remove.
   * @return {Promise}
   */
  destroy: function destroy(mapper, id, opts) {
    var self = this;
    var op = void 0;
    opts || (opts = {});
    var removeOpts = self.getOpt('removeOpts', opts);

    return self.getClient().then(function (client) {
      // beforeDestroy lifecycle hook
      op = opts.op = 'beforeDestroy';
      return resolve(self[op](mapper, id, opts)).then(function () {
        return new Promise(function (resolve, reject) {
          var mongoQuery = {};
          mongoQuery[mapper.idAttribute] = self.toObjectID(mapper, id);
          var collection = client.collection(mapper.table || underscore(mapper.name));
          collection[collection.deleteOne ? 'deleteOne' : 'remove'](mongoQuery, removeOpts, function (err, cursor) {
            return err ? reject(err) : resolve(cursor);
          });
        });
      });
    }).then(function (cursor) {
      cursor.connection = undefined;
      var response = new Adapter.Response(undefined, cursor, 'destroy');
      response = self.respond(response, opts);

      // afterDestroy lifecycle hook
      op = opts.op = 'afterDestroy';
      return resolve(self[op](mapper, id, opts, response)).then(function (_response) {
        // Allow for re-assignment from lifecycle hook
        return isUndefined(_response) ? response : _response;
      });
    });
  },


  /**
   * Destroy the records that match the selection query.
   *
   * @name MongoDBAdapter#destroyAll
   * @method
   * @param {Object} mapper the mapper.
   * @param {Object} [query] Selection query.
   * @param {Object} [opts] Configuration options.
   * @param {boolean} [opts.raw=false] Whether to return a more detailed
   * response object.
   * @param {Object} [opts.removeOpts] Options to pass to collection#remove.
   * @return {Promise}
   */
  destroyAll: function destroyAll(mapper, query, opts) {
    var self = this;
    var op = void 0;
    query || (query = {});
    opts || (opts = {});
    var removeOpts = self.getOpt('removeOpts', opts);
    fillIn(removeOpts, self.getQueryOptions(mapper, query));

    return self.getClient().then(function (client) {
      // beforeDestroyAll lifecycle hook
      op = opts.op = 'beforeDestroyAll';
      return resolve(self[op](mapper, query, opts)).then(function () {
        var mongoQuery = self.getQuery(mapper, query);
        return new Promise(function (resolve, reject) {
          var collection = client.collection(mapper.table || underscore(mapper.name));
          collection[collection.deleteMany ? 'deleteMany' : 'remove'](mongoQuery, removeOpts, function (err, cursor) {
            return err ? reject(err) : resolve(cursor);
          });
        });
      });
    }).then(function (cursor) {
      cursor.connection = undefined;
      var response = new Adapter.Response(undefined, cursor, 'destroyAll');
      response = self.respond(response, opts);

      // afterDestroyAll lifecycle hook
      op = opts.op = 'afterDestroyAll';
      return resolve(self[op](mapper, query, opts, response)).then(function (_response) {
        // Allow for re-assignment from lifecycle hook
        return isUndefined(_response) ? response : _response;
      });
    });
  },


  /**
   * Apply the given update to the record with the specified primary key.
   *
   * @name MongoDBAdapter#update
   * @method
   * @param {Object} mapper The mapper.
   * @param {(string|number)} id The primary key of the record to be updated.
   * @param {Object} props The update to apply to the record.
   * @param {Object} [opts] Configuration options.
   * @param {boolean} [opts.raw=false] Whether to return a more detailed
   * response object.
   * @param {Object} [opts.updateOpts] Options to pass to collection#update.
   * @return {Promise}
   */
  update: function update(mapper, id, props, opts) {
    var self = this;
    props || (props = {});
    opts || (opts = {});
    var op = void 0;
    var updateOpts = self.getOpt('updateOpts', opts);

    return self.find(mapper, id, { raw: false }).then(function (record) {
      if (!record) {
        throw new Error('Not Found');
      }
      // beforeUpdate lifecycle hook
      op = opts.op = 'beforeUpdate';
      return resolve(self[op](mapper, id, props, opts));
    }).then(function (_props) {
      // Allow for re-assignment from lifecycle hook
      props = isUndefined(_props) ? props : _props;
      _props = withoutRelations(mapper, props);
      return self.getClient().then(function (client) {
        return new Promise(function (resolve, reject) {
          var mongoQuery = {};
          mongoQuery[mapper.idAttribute] = self.toObjectID(mapper, id);
          var collection = client.collection(mapper.table || underscore(mapper.name));
          collection[collection.updateOne ? 'updateOne' : 'update'](mongoQuery, { $set: _props }, updateOpts, function (err, cursor) {
            return err ? reject(err) : resolve(cursor);
          });
        });
      });
    }).then(function (cursor) {
      return self.find(mapper, id, { raw: false }).then(function (record) {
        cursor.connection = undefined;
        var response = new Adapter.Response(record, cursor, 'update');
        response.updated = 1;
        response = self.respond(response, opts);

        // afterUpdate lifecycle hook
        op = opts.op = 'afterUpdate';
        return resolve(self[op](mapper, id, props, opts, response)).then(function (_response) {
          // Allow for re-assignment from lifecycle hook
          return isUndefined(_response) ? response : _response;
        });
      });
    });
  },


  /**
   * Apply the given update to all records that match the selection query.
   *
   * @name MongoDBAdapter#updateAll
   * @method
   * @param {Object} mapper The mapper.
   * @param {Object} props The update to apply to the selected records.
   * @param {Object} [query] Selection query.
   * @param {Object} [opts] Configuration options.
   * @param {boolean} [opts.raw=false] Whether to return a more detailed
   * response object.
   * @param {Object} [opts.updateOpts] Options to pass to collection#update.
   * @return {Promise}
   */
  updateAll: function updateAll(mapper, props, query, opts) {
    var self = this;
    props || (props = {});
    query || (query = {});
    opts || (opts = {});
    var op = void 0,
        ids = void 0;
    var updateOpts = self.getOpt('updateOpts', opts);
    updateOpts.multi = true;

    return self.getClient().then(function (client) {
      var queryOptions = self.getQueryOptions(mapper, query);
      var mongoQuery = self.getQuery(mapper, query);

      // beforeUpdateAll lifecycle hook
      op = opts.op = 'beforeUpdateAll';
      return resolve(self[op](mapper, props, query, opts)).then(function (_props) {
        // Allow for re-assignment from lifecycle hook
        props = isUndefined(_props) ? props : _props;
        _props = withoutRelations(mapper, props);
        queryOptions.$set = _props;
        return self.findAll(mapper, query, { raw: false });
      }).then(function (records) {
        ids = records.map(function (record) {
          return self.toObjectID(mapper, record[mapper.idAttribute]);
        });

        return new Promise(function (resolve, reject) {
          var collection = client.collection(mapper.table || underscore(mapper.name));
          collection[collection.updateMany ? 'updateMany' : 'update'](mongoQuery, queryOptions, updateOpts, function (err, cursor) {
            return err ? reject(err) : resolve(cursor);
          });
        });
      }).then(function (cursor) {
        var query = {};
        query[mapper.idAttribute] = {
          'in': ids
        };
        return self.findAll(mapper, query, { raw: false }).then(function (records) {
          cursor.connection = undefined;
          var response = new Adapter.Response(records, cursor, 'update');
          response.updated = records.length;
          response = self.respond(response, opts);

          // afterUpdateAll lifecycle hook
          op = opts.op = 'afterUpdateAll';
          return resolve(self[op](mapper, props, query, opts, response)).then(function (_response) {
            // Allow for re-assignment from lifecycle hook
            return isUndefined(_response) ? response : _response;
          });
        });
      });
    });
  },


  /**
   * Not supported.
   *
   * @name MongoDBAdapter#updateMany
   * @method
   */
  updateMany: function updateMany() {
    throw new Error('not supported!');
  }
});

module.exports = MongoDBAdapter;
//# sourceMappingURL=js-data-mongodb.js.map