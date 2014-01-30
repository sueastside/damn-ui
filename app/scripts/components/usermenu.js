/** @jsx React.DOM */

(function() {
    "use strict";
    
    $.ajaxSetup ({
        cache: false,
        headers: {'Authorization': 'Token 740a04407a34316403eba0cceaf395a812180c0d'}
    });

    var UserMenu = React.createClass({
        getInitialState: function() {
            return {username: 'Loading...', avatar_src:null};
        },
        componentWillMount: function() {
            var component = this;
            var data_xhr = Request('/user/');
            data_xhr.done(function( data ) {
                component.state.username = data.username;
                component.state.url = data.url;
                component.state.id = data.id;
                component.state.avatar_src = 'http://placekitten.com/32/32';
                component.setState(component.state);
            });
            data_xhr.fail(function () {
                component.state = component.getInitialState();
                component.state.username = 'Please login.';
                component.setState(component.state);
            });
        },
        render: function() {
            return (
                    <li className="user_button" data-url={this.state.url} data-id={this.state.id}>
                        <a href="#">
                            <span>{this.state.username}</span>
                            <img src={this.state.avatar_src} />
                        </a>
                    </li>
            );
        }
    });
    window.UserMenu = UserMenu;
    
    window.renderUserMenu = function () {
        React.renderComponent(<UserMenu></UserMenu>, $("#user")[0]);
    };

} ());
