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
                                         {title:'Revisions', content:<List type={Revision} url={this.props.data.url+'revisions/'} pathToId="revision.revision_id" />},
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
                <div  className="projectDetail">
                    <h3>{this.props.data.name}</h3>
                    <FollowControl description={this.props.data.name} object_url={this.props.data.url} is_following={this.props.data.is_following}/>
                    No further data at this point.
                </div>
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


/*

;(function() {

	jsPlumb.ready(function() {
		// setup some defaults for jsPlumb.	
		var instance = jsPlumb.getInstance({
			Endpoint : ["Dot", {radius:2}],
			HoverPaintStyle : {strokeStyle:"#1e8151", lineWidth:2 },
			ConnectionOverlays : [
				[ "Arrow", { 
					location:1,
					id:"arrow",
                    length:14,
                    foldback:0.8
				} ]
			],
			Container:"statemachine-demo"
		});

		var windows = jsPlumb.getSelector(".statemachine-demo .w");
        
        var g = new dagre.Digraph();
        
        windows.each(function(i, el) {
            var info = {};
            info['label'] = $(el).text();
            info['width'] = $(el).width();
            info['height'] = $(el).height();
            if ($(el).attr('id')=='create') {
                info['rank'] = 'min'; // max, min, same_
            } else if ($(el).attr('id')=='closed') {
                info['rank'] = 'max'; // max, min, same_
            } else {
                //info['rank'] = 'same_';
            }
            console.log(info);
            g.addNode($(el).attr('id'), info);
        });

        // initialise draggable elements.  
		instance.draggable(windows, {containment:"parent"});

        // bind a click listener to each connection; the connection is deleted. you could of course
		// just do this: jsPlumb.bind("click", jsPlumb.detach), but I wanted to make it clear what was
		// happening.
		instance.bind("click", function(c) { 
			instance.detach(c); 
		});

		// bind a connection listener. note that the parameter passed to this function contains more than
		// just the new connection - see the documentation for a full list of what is included in 'info'.
		// this listener sets the connection's internal
		// id as the label overlay's text.
        instance.bind("connection", function(info) {
			//info.connection.getOverlay("label").setLabel(info.connection.id);
            console.log(info.connection);
            var connections = instance.getConnections({source:info.source, target:info.source});
            console.log(connections);
            if (connections.length > 1) {
                instance.detach(info.connection);
            }
            g.addEdge(null, info.sourceId,   info.targetId);
            //connections[0].reapplyTypes({ connector:[ "Straight", {} ]});
        });

		// suspend drawing and initialise.
		instance.doWhileSuspended(function() {

			// make each ".ep" div a source and give it some parameters to work with.  here we tell it
			// to use a Continuous anchor and the StateMachine connectors, and also we give it the
			// connector's paint style.  note that in this demo the strokeStyle is dynamically generated,
			// which prevents us from just setting a jsPlumb.Defaults.PaintStyle.  but that is what i
			// would recommend you do. Note also here that we use the 'filter' option to tell jsPlumb
			// which parts of the element should actually respond to a drag start.
			instance.makeSource(windows, {
				filter:".ep",				// only supported by jquery
				anchor:"Continuous",
				//connector:[ "StateMachine", { curviness:20 } ],
                //connector:[ "StateMachine", { curviness:0, proximityLimit: 800 } ],
                connector:[ "Flowchart", {} ],
				connectorStyle:{ strokeStyle:"#5c96bc", lineWidth:2, outlineColor:"transparent", outlineWidth:4 },
				maxConnections:5,
				onMaxConnections:function(info, e) {
					alert("Maximum connections (" + info.maxConnections + ") reached");
				}
			});						

			// initialise all '.w' elements as connection targets.
	        instance.makeTarget(windows, {
				dropOptions:{ hoverClass:"dragHover" },
				anchor:"Continuous"				
			});

			// and finally, make a couple of connections
			instance.connect({ source:"create", target:"open" });
            instance.connect({ source:"open", target:"resolved" });
            instance.connect({ source:"open", target:"closed" });
            instance.connect({ source:"open", target:"inprogress" });

            instance.connect({ source:"resolved", target:"closed" });
            instance.connect({ source:"resolved", target:"reopened" });
            
            instance.connect({ source:"inprogress", target:"open" });
            instance.connect({ source:"inprogress", target:"resolved" });
            instance.connect({ source:"inprogress", target:"closed" });
            
            instance.connect({ source:"reopened", target:"closed" });
            instance.connect({ source:"reopened", target:"resolved" });
            instance.connect({ source:"reopened", target:"inprogress" });

            
            console.log('INIT');
            var layout = dagre.layout().nodeSep(50).edgeSep(50).rankSep(100).rankDir("LR").run(g);
            console.log(layout);
            layout.eachNode(function(u, value) {
                console.log("Node " + u + ": " + JSON.stringify(value));
                var offset = {top: (value.y - value.height/2)+50, left:(value.x - value.width/2)+200};
                console.log(offset);
                $('#'+u).css(offset);
            });
            layout.eachEdge(function(e, u, v, value) {
                console.log("Edge " + u + " -> " + v + ": " + JSON.stringify(value));
            });

		});

	});
})();
*/
