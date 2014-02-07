/** @jsx React.DOM */

/*
    This will be used as a reference module.
*/

(function() {
    "use strict";
    
    /*Define react modules of the module*/
    var Task = React.createClass({
        render: function() {
            return this.transferPropsTo(
                <li className={this.props.selected?'active':''} data-url={this.props.data.url}>
                    <h3>{this.props.data.summary}</h3>
                    <span>{this.props.data.description}</span>
                </li>
            );
        }
    });
    
    var Revision = React.createClass({
        render: function() {
            return this.transferPropsTo(
                <div>
                    <ProfilePic user={this.props.data.revision.editor} username={this.props.data.revision.editor} /> 
                    <span>{this.props.data.revision.editor}</span>
                    <span>{this.props.data.revision.date_created}</span>
                    <div>
                        {this.props.data.revision.comment}
                    </div>
                    <div>
                        <h3>{this.props.data.object.summary}</h3>
                        <span>{this.props.data.object.description}</span>
                    </div> 
                    <hr />
                </div>
            );
        }
    });
    
    var Follower = React.createClass({
        render: function() {
            return this.transferPropsTo(
                <div>
                    <ProfilePic user={this.props.data} username={this.props.data.username} />
                    <span>{this.props.data.username}</span>
                </div>
            );
        }
    });
    
    var FollowControl = React.createClass({
        propTypes: {
            is_following: React.PropTypes.bool.isRequired,
            object_url: React.PropTypes.string.isRequired,
            description: React.PropTypes.string.isRequired
        },
        getInitialState: function() {
            return {is_following: this.props.is_following};
        },
        onClick: function(event) {
            var method = this.state.is_following?'DELETE':'POST';
            this.setState({is_following: !this.state.is_following});
            event.preventDefault();
            
            $.ajax({
              url: this.props.object_url+'follow/',
              dataType: 'json',
              type: method,
              data: {},
              success: function(data) {
              }.bind(this)
            });
        },
        render: function() {
            var verb = this.state.is_following?"Unfollow":"Follow";
            var className = this.state.is_following?"fa fa-eye-slash":"fa fa-eye";
            return this.transferPropsTo(
                    <a onClick={this.onClick} className="followControl" href="" title={verb+' '+this.props.description}><i className={className}></i></a>
            );
        }
    });
    
    
    var ReadOnlyField = React.createClass({
        propTypes: {
            name: React.PropTypes.string.isRequired,
            value: React.PropTypes.string,
            url: React.PropTypes.string
        },
        render: function() {
            return this.transferPropsTo(
            <div className="field">
                <div className="name">{this.props.name}</div>
                <div className="value"><a href={this.props.url}>{this.props.value}</a></div>
             </div>
            );
        }
    });
    
    
    var TaskDetail = React.createClass({
        getFields: function () {
            var fields = {};
            var component = this;
            $.map(this.props.data, function(value, key)  {
                if (key.match(/_descr$/)) {
                    var name = key.substring(0, key.length-'_descr'.length);
                    fields[name] = {};
                    fields[name]['value'] = value;
                    fields[name]['url'] = component.props.data[name];
                }
            }, this);
            
            return fields;
        },
        render: function() {
            return this.transferPropsTo(
                <div className="taskDetail">
                    <h3>{this.props.data.summary}</h3>
                    <FollowControl description={this.props.data.summary} object_url={this.props.data.url} is_following={this.props.data.is_following}/>
                    
                    <EditorControl parent={this} object_url={this.props.data.url} />
                    
                    <div>{this.props.data.description}</div>
                    
                    {$.map(this.getFields(),function(value, key)  {
                        return (<ReadOnlyField key={key} name={key} value={value.value} url={value.url} />);
                    }.bind(this), this)}
                    
                    <TabsSwitcher active={this.props.context[0]} tabs={[{title:'Comments', content:<CommentBox url={this.props.data.url+'comments/'} pollInterval={60000} />},
                                         {title:'Revisions', content:<List type={Revision} url={this.props.data.url+'revisions/'} />},
                                         {title:'Followers', content:<List type={Follower} url={this.props.data.url+'followers/'} />},
                                         {title:'Activity', content:<NotificationStream url={this.props.data.url+'activity/'} pollInterval={60000} />} ]}/>
                </div>
            );
        }
    });

    var Project = React.createClass({
        render: function() {
            return this.transferPropsTo(
                <li key={this.props.data.id} data-url={this.props.data.url}>
                    <h3>{this.props.data.name}</h3>
                    <span>{this.props.data.is_following}</span>
                </li>
            );
        }
    });
    
    var ProjectDetail = React.createClass({
        render: function() {
            console.log(this.props.data);
            return this.transferPropsTo(
                <div>ProjectDetail</div>
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
        var context = state.slice(1);
        console.log('window.Dashboard: name '+name);
        console.log('window.Dashboard: state '+context);
        
        //React.renderComponent(<Editor url={"/projects/1/tasks/"} />, $("#workspace-area")[0]);
        //return;

        if (name=='tasks') {
            React.renderComponent(<FilteredList context={context} type={Task} detailtype={TaskDetail} url={window.get_user_url_promise("tasks/")}></FilteredList>, $("#workspace-area")[0]);
        } else if (name=='projects') {
            React.renderComponent(<FilteredList context={context} type={Project} detailtype={ProjectDetail} url={window.get_user_url_promise("projects/")}></FilteredList>, $("#workspace-area")[0]);
        } else {
            React.renderComponent(<NotificationStream url="/users/1/activity/" pollInterval={5000}></NotificationStream>, $("#workspace-area")[0]);
        }
    };
} ());
