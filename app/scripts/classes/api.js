(function() {
	"use strict";
    var staticUrl = "http://127.0.0.1:8000";
	//var staticUrl = "http://damn.csproject.org:8080";

	var requestCache = {};

	var Request = function( url ) {
        
        if (!url.indexOf('http') == 0) {
            url = staticUrl + url;
        }
        
		
		if ( requestCache[url] ) {
			return requestCache[url];
		}

		return $.ajax({
					"url": url,
					"method": "GET"
		}).fail(function( xhr, status, err ) {
			console.log( xhr, status, err );
		}).done(function() {
			delete requestCache[url];
		});
	};

	window.Request = Request;
	
	
	
	var RequestOPTIONS = function( url ) {
		
		if ( requestCache[url] ) {
			return requestCache[url];
		}

		return $.ajax({
					"url": staticUrl + url,
					"method": "OPTIONS"
		}).fail(function( xhr, status, err ) {
			console.log( xhr, status, err );
		}).done(function() {
			delete requestCache[url];
		});
	};

	window.RequestOPTIONS = RequestOPTIONS;
} ());
