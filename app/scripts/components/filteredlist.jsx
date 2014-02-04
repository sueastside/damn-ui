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

    /*Define react modules of the module*/
    var FilteredList = React.createClass({
        getInitialState: function() {
            return {data: {results: []}, ordering: {choices:[]}, search: {}};
        },
        handleonSearch: function(data) {
            var component = this;
            var url = component.props.url+'?'+component.state.search.search_by_field +'='+ data.text;
            console.log("handleonSearch "+url);
            var data_xhr = Request(url);
              data_xhr.done(function( data ) {
                  component.state.data = data;
                  component.setState(component.state);
              });
        },
        handleonOrder: function(data) {
            var component = this;
            var url = component.props.url+'?'+component.state.ordering.order_by_field +'='+ data.field;
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
                  if (component.state.selected) {
                      console.log('FilteredList::loadData: '+component.state.selected);
                      component.state.active = component.state.data.results[component.state.selected];
                  }
                  component.setState(component.state);
              });
            });
        },
        componentWillMount: function() {
            
            if (this.props.state) {
                console.log('FilteredList::componentWillMount: '+this.props.state);
                this.state.selected = this.props.state[0];
                console.log('FilteredList::componentWillMount: s '+this.state.selected);
            }
            
            var component = this;
            console.log('FilteredList::componentWillMount: '+this.props.url);
            this.props.url.done(function (url) {
                console.log('FilteredList::componentWillMount:promise: '+url);
                component.loadData(url);
            });
        },
        componentWillReceiveProps: function(nextProps) {
          console.log('FilteredList::componentWillReceiveProps');
          this.loadData(nextProps.url);
        },
        handleSelected: function(index) {
            console.log('Selected ');
            console.log(index);
            this.state.selected = index;
            this.state.active = this.state.data.results[this.state.selected];
            this.setState(this.state);
        },
        render: function() {
            return (
                <div className="active">
                    <div className="workspace-list">
                        <h3>{this.state.name}</h3>
                        {this.state.search?<FilteredListSearch search={this.state.search} onSearch={this.handleonSearch}></FilteredListSearch>:''}
                        {this.state.ordering?<FilteredListOrder order={this.state.ordering} onOrder={this.handleonOrder}></FilteredListOrder>:''}
                        <FilteredListPaginator data={this.state.data} onNavigate={this.handleonNavigate}></FilteredListPaginator>
                        <ul>
                           {this.state.data.results.map(function(itm, i)  {
                                var boundClick = this.handleSelected.bind(this, i);
                                return this.props.type({key:itm.id, data:itm, onClick:boundClick, selected:(this.state.selected === i)});
                            }, this)}
                        </ul>
                    </div>
                    <div className="workspace-detail">
                        {this.state.active?this.props.detailtype({data:this.state.active}):''}
                    </div>
                </div>
            );
        }
    });
    window.FilteredList = FilteredList;

} ());
