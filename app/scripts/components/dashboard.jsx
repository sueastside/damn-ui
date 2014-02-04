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
            return this.transferPropsTo(
                <li className={this.props.selected?'notification-active':''} key={this.props.data.id} data-url={this.props.data.url}>
                    <h3>{this.props.data.summary}</h3>
                    <span>{this.props.data.description}</span>
                </li>
            );
        }
    });
    
    var RevisionsList = React.createClass({
        render: function() {
            return this.transferPropsTo(
                <div>
                    RevisionsList {this.props.url}
                </div>
            );
        }
    });
    
    var TaskDetail = React.createClass({
        render: function() {
            return this.transferPropsTo(
                <div>
                    <h3>{this.props.data.summary}</h3>
                    <span>{this.props.data.description}</span>
                    <TabsSwitcher tabs={[{title:'Comments', content:<CommentBox url={this.props.data.url+'comments/'} pollInterval={5000} />},
                                         {title:'Revisions', content:<RevisionsList url={this.props.data.url+'revisions/'} />},
                                         {title:'Followers', content:<RevisionsList url={this.props.data.url+'followers/'} />},
                                         {title:'Activity', content:<RevisionsList url={this.props.data.url+'activity/'} />} ]}/>
                </div>
            );
        }
    });

    var Project = React.createClass({
        render: function() {
            console.log(this.props.data);
            return this.transferPropsTo(
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
        var name = state[0];
        var state = state.slice(1);
        console.log('window.Dashboard: name '+name);
        console.log('window.Dashboard: state '+state);
        if (name=='tasks') {
            React.renderComponent(<FilteredList state={state} type={Task} detailtype={TaskDetail} url={window.get_user_url_promise("tasks/")}></FilteredList>, $("#workspace-area")[0]);
        } else if (name=='projects') {
            React.renderComponent(<FilteredList state={state} type={Project} url={window.get_user_url_promise("projects/")}></FilteredList>, $("#workspace-area")[0]);
        } else {
            React.renderComponent(<NotificationStream url="/users/1/activity/" pollInterval={5000}></NotificationStream>, $("#workspace-area")[0]);
        }
    };
} ());
