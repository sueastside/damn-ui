(function() {
	"use strict";

	var staticUrl = "http://damn.csproject.org:8080";

	var requestCache = {};

	var Request = function( url ) {
		
		if ( requestCache[url] ) {
			return requestCache[url];
		}

		return $.ajax({
					"url": staticUrl + url,
					"method": "GET"
		}).fail(function( xhr, status, err ) {
			console.log( xhr, status, err );
		}).done(function() {
			delete requestCache[url];
		});
	};

	window.Request = Request;
} ());