/** @jsx React.DOM */

(function() {
    "use strict";
    
    $.ajaxSetup ({
        cache: false,
        headers: {'Authorization': 'Token e8b384a82666310e71334a4a2078a4ead775e76a'}
    });
    
    var USER_NAME;
    var USER_URL = $.Deferred();

    var UserMenu = React.createClass({
        getInitialState: function() {
            return {username: 'Loading...', avatar_src:null};
        },
        componentWillMount: function() {
            var component = this;
            var data_xhr = Request('/user/');
            data_xhr.done(function( data ) {
                USER_NAME = component.state.username = data.username;
                component.state.url = data.url;
                component.state.id = data.id;
                component.state.avatar_src = 'http://placekitten.com/32/32';
                component.setState(component.state);
                USER_URL.resolve(data.url);
            });
            data_xhr.fail(function () {
                component.state = component.getInitialState();
                USER_NAME = component.state.username = 'Please login.';
                component.setState(component.state);
                USER_URL.resolve(null);
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
    
    window.get_user_url_promise = function (url) {
        var deferred = $.Deferred();
        USER_URL.promise().done(function (data){
            deferred.resolve(data+url);
        });
        return deferred.promise();
    };
    
    window.get_user_name = function () {
        return USER_NAME;
    };

} ());
