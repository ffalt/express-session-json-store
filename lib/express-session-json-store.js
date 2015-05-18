var fs = require('fs'),
	path = require('path');

module.exports = function (session) {
	var Store = session.Store;

	var cache = {};
	var changed = false;

	function JSONFileStore(options) {
		var self = this;

		options = options || {};
		Store.call(self, options);

		self.path = path.normalize(options.path || './sessions');
		self.filename = options.filename || 'sessions.json';
		self.ttl = options.ttl || (60 * 60 * 1000);
		self.saveInterval = options.saveInterval || (5 * 60 * 1000);

		fs.mkdir(self.path, function (err) {
			if (err && err.code != 'EEXIST') throw err;
			var sessionPath = path.join(self.path, self.filename);
			fs.readFile(sessionPath, 'utf8', function (err, data) {
				if (err && err.code != 'ENOENT') throw err;
				if ((!err) && (data)) {
					data = JSON.parse(data);
					Object.keys(data).forEach(function (key) {
						cache[key] = data[key];
					});
				}
			});
		});

		var repeat = function () {
			if (self.ttl > 0) {
				var ids = Object.keys(cache);
				for (var i = 0; i < ids.length; i++) {
					if (self.expired(ids[i]))
						self.destroy(ids[i]);
				}
			}
			if (changed)
				self.savejson(function () {
					setTimeout(repeat, self.saveInterval);
				});
			else
				setTimeout(repeat, self.saveInterval);
		};

		setTimeout(repeat, self.saveInterval);
	}

	JSONFileStore.prototype.__proto__ = Store.prototype;


	JSONFileStore.prototype.get = function (sessionId, callback) {
		if (cache[sessionId]) return callback(null, cache[sessionId]);
		callback();
	};

	JSONFileStore.prototype.set = function (sessionId, session, callback) {
		session.__lastAccess = new Date().getTime();
		changed = true;
		cache[sessionId] = session;
		callback && callback(null, session);
	};

	JSONFileStore.prototype.savejson = function (callback) {
		var self = this;
		changed = false;
		var s = JSON.stringify(cache);
		fs.writeFile(path.join(self.path, self.filename), s, function (err) {
			callback && callback(err);
		});
	};

	JSONFileStore.prototype.destroy = function (sessionId, callback) {
		global.logger.info('destroy old session', sessionId);
		delete cache[sessionId];
		changed = true;
		callback && callback();
	};

	JSONFileStore.prototype.length = function (callback) {
		callback && callback(null, Object.keys(cache).length);
	};

	JSONFileStore.prototype.clear = function (callback) {
		cache = {};
		changed = true;
		callback && callback();
	};

	JSONFileStore.prototype.list = function (callback) {
		callback && callback(null, Object.keys(cache));
	};

	JSONFileStore.prototype.expired = function (sessionId, callback) {
		if (!cache[sessionId]) {
			callback && callback(null, true);
			return true;
		}
		var self = this,
			now = new Date().getTime(),
			session = cache[sessionId],
			ttl = self.ttl || ('number' == typeof session.cookie.maxAge ? (session.cookie.maxAge || 0) : 0);
		var result = session.__lastAccess + ttl < now;
		callback && callback(null, result);
		return result;
	};

	return JSONFileStore;
};

