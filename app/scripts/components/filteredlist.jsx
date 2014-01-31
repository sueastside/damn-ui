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
                       {this.props.order.fields.map(function(item)  {
                            return <li value={item[0]}>{item[1]}</li>
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

    /*Define react modules of the module*/
    var FilteredList = React.createClass({
        getInitialState: function() {
            return {data: {results: []}, ordering: {fields:[]}, search: {}};
        },
        handleonSearch: function(data) {
            var component = this;
            var url = component.props.url+component.state.search.url + data.text;
            console.log("handleonSearch "+url);
            var data_xhr = Request(url);
              data_xhr.done(function( data ) {
                  component.state.data = data;
                  component.setState(component.state);
              });
        },
        handleonOrder: function(data) {
            var component = this;
            var url = component.props.url+component.state.ordering.url + data.field;
            console.log("handleonOrder "+url);
            var data_xhr = Request(url);
              data_xhr.done(function( data ) {
                  component.state.data = data;
                  component.setState(component.state);
              });
        },
        handleonNavigate: function(data) {
            console.log('handleonNavigate'+data.url)
            var component = this;
            var data_xhr = Request(data.url);
              data_xhr.done(function( data ) {
                  component.state.data = data;
                  component.setState(component.state);
              });
        },
        loadData: function (url) {
            var component = this;

            var filters = RequestOPTIONS(url);
            
            filters.done(function( xhr_data ) {
              console.log(xhr_data);
              component.state.ordering = xhr_data.ordering;
              component.state.search = xhr_data.search;
              component.state.name = xhr_data.name;
              component.setState(component.state);
              var data_xhr = Request(url);
              data_xhr.done(function( data ) {
                  component.state.data = data;
                  component.setState(component.state);
              });
            });
        },
        componentWillMount: function() {
            console.log('componentWillMount');
            this.loadData(this.props.url);
        },
        componentWillReceiveProps: function(nextProps) {
          console.log('FilteredList::componentWillReceiveProps');
          this.loadData(nextProps.url);
        },
        handleClick: function(event) {
            var element = $(event.target).parent('li');
            console.log(element);
            var url = element.attr('data-url');
            console.log('handleClick '+ url); //Todo: Update detail view here.
            return false;
          },
        render: function() {
            return (
                <div key={'FilteredList-'+this.props.url} className="workspace-list active">
                    <h3>{this.state.name}</h3>
                    {this.state.search?<FilteredListSearch search={this.state.search} onSearch={this.handleonSearch}></FilteredListSearch>:''}
                    {this.state.ordering?<FilteredListOrder order={this.state.ordering} onOrder={this.handleonOrder}></FilteredListOrder>:''}
                    <FilteredListPaginator data={this.state.data} onNavigate={this.handleonNavigate}></FilteredListPaginator>
                    <ul onClick={this.handleClick}>
                       {this.state.data.results.map(function(itm)  {
                            return this.props.type({data:itm})
                        }, this)}
                    </ul>
                </div>
            );
        }
    });
    window.FilteredList = FilteredList;

} ());
