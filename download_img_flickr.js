var Crawler = require("crawler");
var fs = require('fs');
var request = require('request');

/* download image */
var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

var URL_CRAWL = 'https://www.flickr.com';
var URL_GET_IMG = 'https://www.flickr.com/photos/o-studio/collections/72157626090816270/';
var FOLDER_IMAGE = 'flickr';
var c = new Crawler({
    maxConnections : 10,
    jQuery: true,
    callback : function (error, result, $) {
        // get url each link in collections image
        $('.setLink').each(function(index, a) {
            var queueUrl = $(a).attr('href');
            c.queue(URL_CRAWL + queueUrl);
        });

        // get image and download
        $('.view.photo-list-photo-view.requiredToShowOnServer.awake').each(function(index, img) {
            var img = $(this).attr('style');
            img = img.match(/\/\/(.*)\)/);

            var imgFlick = img[1];
            var ext = imgFlick.match(/\.jpg|\.png/);
            var url_link = imgFlick.replace(/\_[a-z]\.jpg|\_[a-z]\.png/, '');
            var url_link = url_link.replace(/\.jpg|_.png/, '');
            download('https://' + url_link + '_b' + ext, FOLDER_IMAGE + '/' + Math.random() + ext, function(){
                console.log('download done: ' + url_link);
            });
        });
    }
});

c.queue(URL_GET_IMG);

