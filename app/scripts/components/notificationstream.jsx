/** @jsx React.DOM */

(function() {
    "use strict";
    

    var ProfilePic = React.createClass({
      render: function() {
        return (
          <img src={'http://placekitten.com/32/32?username=' + this.props.username} />
        );
      }
    });


    var Notification = React.createClass({
        handleClick: function(event) {
            console.log(event);
            var id = $(event.target).attr('data-id');
            this.props.onClick(this.props.data);
            return false;
        },
        render: function() {
            return (
                <li className="notification" onClick={this.handleClick} data-id={this.props.data.id}>
                    <div className="notification-user">
                        <ProfilePic user={this.props.data.actor} username={this.props.data.actor_descr} />
                        <div className="notification-summary">
                            <div>
                                <a href={this.props.data.actor}>{this.props.data.actor_descr}</a>
                                 {' '+this.props.data.verb+' '}
                                <a href={this.props.data.action_object}>{this.props.data.action_object_descr}</a>
                            </div>
                            <div>{this.props.data.timesince}</div>
                        </div>
                    </div>
                </li>
            );
        }
    });

    
    var NotificationStream = React.createClass({
        loadFromServer: function() {
            var component = this;
            var data_xhr = Request(this.props.url);
            data_xhr.done(function( data ) {
                component.state.data = data;
                component.setState(component.state);
            });
          },
        getInitialState: function() {
            return {data: [], active: null};
        },
        componentWillMount: function() {
            this.loadFromServer();
            this.interval = setInterval(this.loadFromServer, this.props.pollInterval);
        },
        componentWillUnmount: function() {
            console.log('NotificationStream::componentWillUnmount');
            console.log(this.interval);
            clearInterval(this.interval);
        },
        handleonNavigate: function(data) {
            var component = this;
            component.state.active = data;
            component.setState(component.state);
        },
        render: function() {
            return (
                <div className="active">
                    <ul className="workspace-list">
                        {this.state.data.map(function(itm)  {
                            return <Notification onClick={this.handleonNavigate} key={itm.id} data={itm} />
                        }, this)}
                    </ul>
                    <div className="workspace-detail">
                        {this.state.active?this.state.active.description:''} 
                    </div>
                </div>
            );
        }
    });
    window.NotificationStream = NotificationStream;

} ());
