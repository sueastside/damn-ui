/** @jsx React.DOM */

/*
    This will be used as a reference module.
*/

(function() {
    "use strict";

    /*Define react modules of the module*/
    var Task = React.createClass({
        render: function() {
            console.log(this.props.data);
            return (
                <li key={this.props.data.id} data-url={this.props.data.url}>
                    <h3>{this.props.data.summary}</h3>
                    <span>{this.props.data.description}</span>
                </li>
            );
        }
    });
    
    var Project = React.createClass({
        render: function() {
            console.log(this.props.data);
            return (
                <li key={this.props.data.id} data-url={this.props.data.url}>
                    <h3>{this.props.data.name}</h3>
                    <span>{this.props.data.is_following}</span>
                </li>
            );
        }
    });


    /* Loading class
     * This will be used when loading this specific page
     * Things like loading/caching data will be handled here.
     * This is called in main.js LoadView function.
     */
    window.Dashboard = function(state) {
        if (state=='tasks') {
            React.renderComponent(<FilteredList type={Task} url="/tasks/"></FilteredList>, $("#workspace-area")[0]);
        } else if (state=='projects') {
            React.renderComponent(<FilteredList type={Project} url="/projects/"></FilteredList>, $("#workspace-area")[0]);
        } else {
            React.renderComponent(<NotificationStream url="/users/1/activity/" pollInterval={5000}></NotificationStream>, $("#workspace-area")[0]);
        }
    };
} ());
