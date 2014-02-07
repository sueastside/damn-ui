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
        
        var call = $.ajax({
					url: url,
					method: "GET",
                    dataType: 'json'
		});

		call.fail(function( xhr, status, err ) {
			console.log( xhr, status, err );
		}).done(function() {
			delete requestCache[url];
		});
        return call;
	};

	window.Request = Request;
	
	
	
	var RequestOPTIONS = function( url ) {
        
        if (!url.indexOf('http') == 0) {
            url = staticUrl + url;
        }

		return $.ajax({
					url: url,
                    method: "OPTIONS",
                    dataType: 'json'
					
		}).fail(function( xhr, status, err ) {
			console.log( xhr, status, err );
		}).done(function() {
            
			console.log('RequestOPTIONS::done: '+url);
		});
	};

	window.RequestOPTIONS = RequestOPTIONS;
    
    var RequestPOST = function( url, data ) {
        
        if (!url.indexOf('http') == 0) {
            url = staticUrl + url;
        }
		
		if ( requestCache[url] ) {
			return requestCache[url];
		}

		return $.ajax({
                    url: url,
					method: "POST",
                    dataType: 'json',
                    data: data
		}).fail(function( xhr, status, err ) {
			console.log( xhr, status, err );
		}).done(function() {
			delete requestCache[url];
		});
	};

	window.RequestPOST = RequestPOST;
} ());
