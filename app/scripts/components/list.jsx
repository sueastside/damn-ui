/** @jsx React.DOM */

"use strict";

var SelectableListMixin = {
    propTypes: {
        state: React.PropTypes.array,
    },
    getInitialState: function() {
        return {data: {results: []}};
    },
    getActiveObject: function(data, index) {
        return data.results[index];
    },
    handleSelected: function(index) {
        this.state.selected = index;
        this.state.active = this.getActiveObject(this.state.data, this.state.selected);
        this.setState(this.state);
    },
    componentWillMount: function () {
        if (this.props.context) {
            console.log('SelectableListMixin::componentWillMount: '+this.props.context);
            this.state.selected = this.props.context[0];
            this.setState(this.state);
        }
    },
    componentWillUpdate: function (nextProps, nextState) {
        if (this.state.selected) {
            console.log('SelectableListMixin::componentWillUpdate: '+nextState.selected);
            nextState.active = this.getActiveObject(nextState.data, nextState.selected);
        }
    }
};

var AsyncListMixin = {
    propTypes: {
        url: function(props, propName, componentName) {
                if (!(typeof props[propName].then === 'function') && !(typeof props[propName] === 'string')) {
                    throw new Error('Invariant Violation: Required prop `'+propName+'` was not a Promise or a string in `'+componentName+'`');
                }
            }
    },
    _processURL: function (url) {
        if (typeof this.processURL === 'function'){
            return this.processURL(url);
        }
        else {
            return url;
        }
    },
    loadData: function (urlPromise) {
        var component = this;
        $.when( urlPromise ).done(function (url) {
            var data_xhr = Request(component._processURL(url));
            data_xhr.done(function( data ) {
                component.state.data = data;
                component.setState(component.state);
            });
        });
    },
    componentWillMount: function() {
        this.loadData(this.props.url);
    },
    componentWillReceiveProps: function(nextProps) {
        this.loadData(nextProps.url);
    }
};

var List = React.createClass({
    mixins: [SelectableListMixin, AsyncListMixin],
    propTypes: jQuery.extend({
        type: React.PropTypes.func.isRequired
    }, AsyncListMixin.propTypes, SelectableListMixin.propTypes),
    render: function() {
        return (
                <ul>
                   {this.state.data.results.map(function(itm, i)  {
                        var boundClick = this.handleSelected.bind(this, i);
                        return this.props.type({key:itm.id, data:itm, onClick:boundClick, selected:(this.state.selected == i)});
                    }, this)}
                </ul>
        );
    }
});

