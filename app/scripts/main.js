(function() {
	"use strict";
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
	})
} ());