/** @jsx React.DOM */

(function() {
    "use strict";

    var Notification = React.createClass({
        render: function() {
            return (
                <li>
                    <h3>{this.props.data.timesince}</h3>
                    <span>{this.props.data.__str__}</span>
                </li>
            );
        }
    });

    
    var NotificationStream = React.createClass({
        loadCommentsFromServer: function() {
            var component = this;
            var data_xhr = Request(this.props.url);
            data_xhr.done(function( data ) {
                component.setState({data: data});
            });
          },
        getInitialState: function() {
            return {data: []};
        },
        componentWillMount: function() {
            this.loadCommentsFromServer();
            setInterval(this.loadCommentsFromServer, this.props.pollInterval);
        },
        render: function() {
            return (
                <ul className="workspace-list">
                    {this.state.data.map(function(itm)  {
                        return <Notification data={itm} />
                    })}
                </ul>
            );
        }
    });
    window.NotificationStream = NotificationStream;

} ());
