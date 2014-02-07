/** @jsx React.DOM */
"use strict";

var FieldChoices = React.createClass({
    propTypes: {
        options: React.PropTypes.array.isRequired,
    },
    render: function() {
        return this.transferPropsTo(
            <select>
                {(!this.props.value && this.props.required)?<option>Please select an option</option>:''}
                {$.map(this.props.options, function(value, i)  {
                    return <option key={i} value={value.url}>{value.name}</option>
                })}
            </select>
        );
    }
});

var Field = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        type: React.PropTypes.object.isRequired,
        error: React.PropTypes.array
    },
    getInitialState: function() {
        return {value: this.props.type.instance_value};
    },
    handleChange: function(event) {
        this.setState({value: event.target.value});
    },
    render: function() {
        var type = this.props.type.type=='date'?'date':'text';
        var value = this.state.value;
        var classNames = 'field';
        if (this.props.error) {
            classNames += ' error';
        }
        return this.transferPropsTo(
            <div className={classNames}>
                <label htmlFor="widget">{this.props.name}</label>
                {this.props.type.options?
                <FieldChoices required={this.props.type.required} onChange={this.handleChange} value={value} options={this.props.type.options}/>
                :(this.props.name!='description'?
                    <input onChange={this.handleChange} value={value} type={type} />
                    :<textarea rows="4" onChange={this.handleChange} value={value} type={type} />)
                }
                <span>{this.props.type.required?'*':' '}</span>
                <div>{this.props.error?this.props.error[0]:''}</div>
            </div>
        );
    }
});

var Editor = React.createClass({
    propTypes: jQuery.extend({
        url: React.PropTypes.string.isRequired,
        onSuccessfullSave: React.PropTypes.function
    },{}),
    getInitialState: function() {
        return {data: {actions: {POST: {}} }, errors: {}};
    },
    loadOptions: function (url) {
        var component = this;

        var request = RequestOPTIONS(url);
        var instance;
        if (component._isInstance(url)) {
            console.log('Editor::loadOptions INSTANCE');
            instance = Request(url);
        }
        
        $.when(request, instance).done(function(xhr_data1, xhr_data2) {
            component.state.data = xhr_data1[0];
            if (xhr_data2) {
                component.state.instance = xhr_data2[0];
            }
            component.setState(component.state);
        });
    },
    _isInstance: function (url) {
        var is_instance=/(.+?)\/\d+\/$/;
        return is_instance.test(url);
    },
    _getFields: function () {
        var _fields = this.state.data.actions.PUT;
        if (!_fields) {
            _fields = this.state.data.actions.POST;
        }
        return _fields;
    },
    getFields: function () {
        var fields = {};
        var component = this;
        $.map(this._getFields(), function(value, key)  {
            if (value.read_only==false) {
                fields[key] = value;
                fields[key].options = component.getOptions(key);
                if (component.state.instance) {
                    fields[key].instance_value = component.state.instance[key]
                }
            }
        }, this);
        
        return fields;
    },
    getOptions: function (fieldName) {
        var field = this._getFields()[fieldName];
        if (field.type=='field' && this.state.data.options && this.state.data.options[fieldName]) {
            var options = this.state.data.options[fieldName].slice(0);
            if (field.required==false) {
                options.unshift({name: '-----'})
            }
            return options;
        }
        return null;
    },
    componentWillMount: function() {
        this.loadOptions(this.props.url);
    },
    componentWillReceiveProps: function(nextProps) {
      this.loadOptions(nextProps.url);
    },
    handleClick: function () {
        var component = this;
        var object = {};
        $.map(this.refs, function(ref, key)  {
            object[key] = ref.state.value;
        });
        
        if (this._isInstance(this.props.url)) {
            object['_method'] = 'PUT';
        }
        console.log(object);
        
        
        var post = RequestPOST(this.props.url, object);
        post.fail(function (xhr) {
            console.log(xhr.responseJSON);
            component.setState({errors: xhr.responseJSON});
        });
        post.done(function (data) {
            if (component.props.onSuccessfullSave) {
                component.props.onSuccessfullSave(data);
            }
        });
    },
    componentDidUpdate: function () {
        var elements = $(this.getDOMNode()).find('select');
        console.log('----componentDidUpdate----------------------');
        console.log(elements);
        console.log(elements.length);
        console.log('--------------------------');
        elements.chosen();
    },
    render: function() {
        console.log(this.props.url);
        console.log(this.state.data.actions.PUT);

        return (
                <form>
                   {$.map(this.getFields(),function(value, key)  {
                        return (<Field ref={key} key={key} name={key} type={value} error={this.state.errors[key]} />);
                    }.bind(this), this)}
                    <button type="submit" onClick={this.handleClick}><i className="fa fa-floppy-o"></i>Save</button>
                </form>
        );
    }
});


var EditorControl = React.createClass({
    getInitialState: function() {
        return {editing: false};
    },
    onClick: function(event) {
        this.setState({editing: !this.state.editing});
        event.preventDefault();
    },
    onSuccessfullSave: function (data) {
        this.setState({editing: false});
        this.props.parent.props.data = data;
        this.props.parent.forceUpdate();
    },
    render: function() {
        return this.transferPropsTo(
            <div className="editorControl">
                <a onClick={this.onClick} href=""><i className="fa fa-pencil-square-o"></i></a>
                {this.state.editing?
                <div className="modal">
                    <div className="close" onClick={this.onClick}></div>
                    <h1>Editing {this.props.object_url}</h1>
                    <Editor onSuccessfullSave={this.onSuccessfullSave} url={this.props.object_url} />
                </div>
                :''}
            </div>
        );
    }
});
