/** @jsx React.DOM */

(function() {
    "use strict";
    
    function classSet(classNames) {
      if (typeof classNames == 'object') {
        return Object.keys(classNames).map(function(className) {
          return classNames[className] ? className : '';
        }).join(' ');
      } else {
        return Array.prototype.join.call(arguments, ' ');
      }
    }
        

    var ProfilePic = React.createClass({
      render: function() {
        return (
          <img src={'http://placekitten.com/32/32?username=' + this.props.username} />
        );
      }
    });
    window.ProfilePic = ProfilePic;


    var Notification = React.createClass({
        render: function() {
            var cx = classSet;
              var classes = cx({
                'notification': true,
                'notification-active': this.props.selected,
                'notification-read': this.props.read
              });
              
            return this.transferPropsTo(
                <li className={classes} data-id={this.props.data.id}>
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
            return {data: {results: []}, read: {}};
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
        handleSelected: function(index) {
            console.log('Selected ');
            console.log(index);
            this.state.selected = index;
            this.state.active = this.state.data.results[this.state.selected];
            this.state.read[this.state.selected] = true;
            this.setState(this.state);
        },
        render: function() {
            return (
                <div className="active">
                    <ul className="workspace-list">
                        {this.state.data.results.map(function(itm, i)  {
                            var boundClick = this.handleSelected.bind(this, i);
                            return <Notification onClick={boundClick} key={itm.id} data={itm} selected={this.state.selected === i} read={this.state.read[i]} />
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
