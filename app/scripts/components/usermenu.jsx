/** @jsx React.DOM */

(function() {
    "use strict";
    
    $.ajaxSetup ({
        cache: false,
        headers: {'Authorization': 'Token e8401436e22b48f6d7407c4a7ff1323f4102fea8'}
    });
    
    var USER_URL;

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
                USER_URL = data.url;
            });
            data_xhr.fail(function () {
                component.state = component.getInitialState();
                component.state.username = 'Please login.';
                component.setState(component.state);
                USER_URL = null;
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
    
    window.get_user_url = function () {
        return USER_URL;
    };

} ());
