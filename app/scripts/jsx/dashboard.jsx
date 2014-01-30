/** @jsx React.DOM */

/*
	This will be used as a reference module.
*/

(function() {
	"use strict";

	/*Define react modules of the module*/
	var TaskList = React.createClass({
		render: function() {
			return (
				<ul className="workspace-list">
					{this.props.data.tasks.map(function(itm)  {
						return <Task data={itm} />
					})}
				</ul>
			);
		}
	}); 

	var Task = React.createClass({
		render: function() {
			return (
				<li>
					<h3>{this.props.data.target}</h3>
					<span>{this.props.data.__str__}</span>
				</li>
			);
		}
	});

	var Menu = React.createClass({
		render: function() {

		}
	});


	/* Loading class
	 * This will be used when loading this specific page
	 * Things like loading/caching data will be handled here.
	 * This is called in main.js LoadView function.
	 */
	window.Dashboard = function(state) {
		var user_activity = Request("/users/1/activity");

		user_activity.done(function( xhr_data ) {
			
			var data = {
				tasks: xhr_data
			}

			React.renderComponent(
				<TaskList data={data}></TaskList>,
				$("#workspace-area")[0]
			);
		});
	};
} ());