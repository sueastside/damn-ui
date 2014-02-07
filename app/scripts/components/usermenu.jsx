/** @jsx React.DOM */

(function() {
    "use strict";
    
    var damntoken = $.cookie("damntoken");
    
    
    $.ajaxSetup ({
        cache: false,
        headers: (damntoken?{'Authorization': 'Token '+damntoken}:{})
    });
    
    
    var USER_NAME;
    var USER_URL = $.Deferred();

    var UserMenu = React.createClass({
        getInitialState: function() {
            return {username: 'Loading...', avatar_src:null, loggedin: false};
        },
        loadFromServer: function () {
            var component = this;
            var data_xhr = Request('/user/');
            data_xhr.done(function( data ) {
                USER_NAME = component.state.username = data.username;
                component.state.loggedin = true;
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
        componentWillMount: function() {
            this.loadFromServer();
        },
        handleLogin: function () {
            var component = this;
            var login = this.refs.login.getDOMNode().value;
            var password = this.refs.password.getDOMNode().value;
            console.log(login+':'+password);
            
            USER_URL = $.Deferred();
            
            var data = {};
            data['username'] = login;
            data['password'] = password;
            var data_xhr = RequestPOST('/api-token-auth/', data);
            data_xhr.done(function( data ) {
                console.log(data);
                $.cookie("damntoken", data.token);
                $.ajaxSetup ({
                    headers: {'Authorization': 'Token '+data.token}
                });
                component.loadFromServer();
            });
        },
        render: function() {
            return (
                    <li className="user_button" data-url={this.state.url} data-id={this.state.id}>
                        <a href="#">
                            <span>{this.state.username}</span>
                            <img src={this.state.avatar_src} />
                        </a>
                        {!this.state.loggedin?
                            <div className="modal" >
                                <h1>Login</h1>
                                <form>
                                    <div className="field" name="Login">
                                        <label>Login</label>
                                        <input ref="login" type="text" value="admin" />
                                    </div>
                                    <div className="field" name="Login">
                                        <label>Password</label>
                                        <input ref="password" type="password" value="admin" />
                                    </div>
                                    <button onClick={this.handleLogin} type="submit">Login</button>
                                </form>
                            </div>
                        :''}
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
            console.log('USER_URL.promise() '+data+url);
            deferred.resolve(data+url);
        });
        return deferred.promise();
    };
    
    window.get_user_name = function () {
        return USER_NAME;
    };

} ());
