'use strict';

var config = require('../config');
var qiniu = require('qiniu');

qiniu.conf.ACCESS_KEY = config.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.qiniu.SECRET_KEY;

//对一般操作进行promise封装
var uploadFile = qiniu.io.putFile;

exports.uploadFile = uploadFile;

//获取上传凭证
function getUptoken(bucketname) {
	var putPolicy = new qiniu.rs.PutPolicy(bucketname);
	return putPolicy.token();
}

//上传文件
exports.upload = function (path, key,cb) {
	var extra = new qiniu.io.PutExtra();
	var uptoken = getUptoken(config.qiniu.BUCKET_NAME);
	return this.uploadFile(uptoken, key, path, extra,function(err,result){
		cb(err,result);
	})
}
