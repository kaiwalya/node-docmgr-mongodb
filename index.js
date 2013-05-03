
var PTDB = function (db, cb) {
	var This = this;
	This.db = db;
	return cb(null, This);
};

var PTCollection = function (coll, pt, docType) {
	var This = this;
	This.pt = pt;
};

var PTCursor = function(ptc, q, projection, options, callback){
	new PTCursor
}

PTCollection.prototype.find = function(q, projection, options, callback) {
	var This = this;
	This.coll.find();
	new PTCursor(This, q, projection, options, callback);
	return 
};

PTDB.prototype.collection = function (docType, callback) {
	This.db.collection(docType, function (err, mColl) {
		new PTCollection(mColl, This, docType);
		return callback(err, This);
	});
	return;
};

exports.createMongoDBPassThrough = function (db, cb) {
	new PTDB(db, cb);
	return;
};