/** @jsx React.DOM */

(function() {
    "use strict";
    
    var FilteredListSearch = React.createClass({
        handleSubmit: function() {
            var text = this.refs.text.getDOMNode().value.trim();
            this.props.onSearch({text: text});
            return false;
          },
        getInitialState: function() {
            return {description: ''};
        },
        render: function() {
            if (this.props.search.searches) {
                var description = this.props.search.searches.join(' ');
                this.state.description = 'Searches '  + description;
            }
            return (
                <form className="filteredListSearchForm" onSubmit={this.handleSubmit} title={this.state.description}>
                    <input type="text" placeholder="Search..." ref="text"/>
                    <input type="submit" value="Search" />
                </form>
            );
        }
    });
    
    var FilteredListOrder = React.createClass({
        handleClick: function(event) {
            console.log(event);
            var field = $(event.target).attr('value');
            console.log(field);
            this.props.onOrder({field: field});
            return false;
          },
        render: function() {
            return (
                <ul onClick={this.handleClick}>
                       {this.props.order.choices.map(function(item)  {
                            return <li key={item[0]} value={item[0]}>{item[1]}</li>
                        })}
                </ul>
            );
        }
    });
    
    
    var FilteredListPaginator = React.createClass({
        handlePrevious: function() {
            this.props.onNavigate({url: this.props.data.previous});
            return false;
        },
        handleNext: function() {
            this.props.onNavigate({url: this.props.data.next});
            return false;
        },
        render: function() {
            return (
                <div>
                    <span ref="previous" onClick={this.handlePrevious}>Previous</span>
                    <span ref="next" onClick={this.handleNext}>Next</span>
                </div>
            );
        }
    });


    var FilteredList = React.createClass({
        mixins: [SelectableListMixin, AsyncListMixin],
        propTypes: jQuery.extend({
            type: React.PropTypes.func.isRequired
        }, AsyncListMixin.propTypes, SelectableListMixin.propTypes),
        getInitialState: function() {
            return {ordering: {choices:[]}, search: {}};
        },
        processURL: function (url) {
            console.log('FilteredList::processURL '+this.state.searching);
            console.log('FilteredList::processURL '+this.state.order_field);
            var args = '';
            if (this.state.search.search_by_field && this.state.searching) {
                args += '&'+this.state.search.search_by_field +'='+ this.state.searching;
            }
            if (this.state.ordering.order_by_field && this.state.order_field) {
                args += '&'+this.state.ordering.order_by_field +'='+ this.state.order_field;
            }
            if (this.state.navigate) {
                return this.state.navigating+'?'+args;
            }
            return url+'?'+args;        
        },
        handleonSearch: function(data) {
            this.state.searching = data.text
            this.loadData(this.props.url);
        },
        handleonOrder: function(data) {
            this.state.order_field = data.field
            this.loadData(this.props.url);
        },
        handleonNavigate: function(data) {
            this.state.navigate = data.url;
            this.loadData(this.props.url);
        },
        loadOptions: function (url) {
            var component = this;

            var filters = RequestOPTIONS(url);
            
            filters.done(function( xhr_data ) {
              console.log(xhr_data);
              component.state.ordering = xhr_data.ordering;
              component.state.search = xhr_data.search;
              component.state.name = xhr_data.name;
              component.setState(component.state);
            });
        },
        componentWillMount: function() {
            var component = this;
            this.props.url.done(function (url) {
                component.loadOptions(url);
            });
        },
        componentWillReceiveProps: function(nextProps) {
          console.log('FilteredList::componentWillReceiveProps');
          var component = this;
            this.props.url.done(function (url) {
                component.loadOptions(url);
            });
          this.loadData(nextProps.url);
        },
        render: function() {
            return (
                <div className="active">
                    <div className="workspace-list">
                        <h3>{this.state.name}</h3>
                        <FilteredListSearch search={this.state.search} onSearch={this.handleonSearch}></FilteredListSearch>
                        <FilteredListOrder order={this.state.ordering} onOrder={this.handleonOrder}></FilteredListOrder>
                        <FilteredListPaginator data={this.state.data} onNavigate={this.handleonNavigate}></FilteredListPaginator>
                        <ul>
                           {this.state.data.results.map(function(itm, i)  {
                                var boundClick = this.handleSelected.bind(this, i);
                                return this.props.type({key:itm.id, data:itm, onClick:boundClick, selected:(this.state.selected == i)});
                            }, this)}
                        </ul>
                    </div>
                    <div className="workspace-detail">
                        {this.state.active?this.props.detailtype({key:this.state.active.id, data:this.state.active, context:this.props.context.slice(1)}):''}
                    </div>
                </div>
            );
        }
    });
    window.FilteredList = FilteredList;

} ());
