(function() {
    "use strict";
    var currentView = false;

    var workspace = {
        init: function() {
            var workspace_height = $(window).height() - $("#menu").height();
            $("body").css("height", workspace_height);
            $("#workspace").css("height", workspace_height);
        }
    };

    $(function() {
        $(window).on("resize", function() {
            workspace.init();
        });

        workspace.init();
    });


    var LoadView = function(view, viewName, state) {
        if ( currentView ) {
            $("#workspace-menu > div").removeClass("active");
            $("#workspace-area > div").removeClass("active");
        }

        $("#workspace-menu > div." + viewName).addClass("active");
        $("workspace-area > div." + viewName).addClass("active");

        /*
            Setting up menu and submenu highlights.
        */
        $("#workspace-menu > div." + viewName + " li").removeClass("active");
        $("#workspace-menu > div." + viewName).find("li a[href='#!" + viewName + ";" + state + "']").parent().addClass("active");

        $("#menu li").removeClass("active");
        $("#menu li a[href='#!" + viewName + "']").parent().addClass("active");

        view(state);
        
        //Keepin' track of ma state.
        currentView = viewName;
    }

    $(window).on("hashchange", function() {
        var clickedView = window.location.hash.substr(2).split(";")[0];
        console.log(clickedView+'   '+clickedView.charAt(0).toUpperCase() + clickedView.slice(1));
        console.log(window.location.hash.substr(2).split(";")[1]);
        LoadView( window[clickedView.charAt(0).toUpperCase() + clickedView.slice(1)], clickedView, window.location.hash.substr(2).split(";")[1] );
    });

    $(document).ready(function () {
        if ( window.location.hash ) {
            var hash = window.location.hash.substr(2).split(";")[0];
            LoadView( window[hash.charAt(0).toUpperCase() + hash.slice(1)], hash, window.location.hash.substr(2).split(";")[1] );
        }
        setTimeout(function () {window.renderUserMenu();}, 100);
    });
} ());
