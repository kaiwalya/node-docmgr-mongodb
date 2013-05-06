var docmgr = require('docmgr');

var PTDB = function (db, cb) {
	var This = this;
	This.db = db;
	return cb(null, This);
};

var PTCollection = function (coll, pt, docType) {
	var This = this;
	This.coll = coll;
	This.pt = pt;
	This.docType = docType;
};

var PTCursor = function (cursor) {
	var This = this;
	This.cursor = cursor;
};

PTCursor.prototype.next = function (callback) {
	var This = this;
	This.cursor.nextObject(function (err, obj) {
		return callback(err, obj);
	});
	return;
};

PTCollection.prototype.insert = function (obj, options, callback) {
	var This = this;
	This.coll.insert(obj, {w: 1}, callback);
};

PTCollection.prototype.update = function (obj, doc, options, callback) {
	var This = this;
	var opt = {w: 1};
	var uo = new docmgr.UpdateOptions(options);
	if (!uo.isSingle()) {
		opt.multi = true;
	}
	This.coll.update(obj, doc, opt, callback);
};

PTCollection.prototype.find = function (q, projection, options, callback) {
	var This = this;
	var outOptions = {};
	if (projection) {
		outOptions.fields = projection;
	}
	var fo = new docmgr.FindOptions(options);
	//console.log(q, outOptions);
	This.coll.find(q, outOptions, function (err, result) {
		if (err)
			return callback(err);
		if (fo.isSingle()) {
			return result.count(function (err, count) {
				if (count === 0) {
					return callback();
				}
				else if (count === 1) {
					var cursor = new PTCursor(result);
					return cursor.next(callback);
				}
				else {
					return callback(new docmgr.OutOfBoundsException());
				}
			});
		}
		else {
			return callback(err, new PTCursor(result));
		}
	});

	return;
};


PTDB.prototype.collection = function (docType, callback) {
	var This = this;
	This.db.collection(docType, function (err, mColl) {
		return callback(err, new PTCollection(mColl, This, docType));
	});
	return;
};

exports.createMongoDBPassThrough = function (db, cb) {
	new PTDB(db, cb);
	return;
};