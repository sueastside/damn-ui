/** @jsx React.DOM */

    "use strict";
    
    var TabsSwitcher = React.createClass({
        getDefaultProps: function() {
            return {
                tabs: [
                    {title: 'first', content: 'Content 1'},
                    {title: 'second', content: 'Content 2'}
                ],
                active: 0
            };
        },
        getInitialState: function() {
            return {active: this.props.active?this.props.active:0};
        },
        componentWillReceiveProps: function(nextProps) {
          console.log('TabsSwitcher::componentWillReceiveProps');
          this.state.active = nextProps.active?nextProps.active:0
          this.setState(this.state);
        },
        render: function() {
            console.log('TabsSwitcher::render ', this.state.active);
            return <div>
                <TabsPane items={this.props.tabs} active={this.state.active} onTabClick={this.handleTabClick}/>
                <TabsContent items={this.props.tabs} active={this.state.active}/>
            </div>;
        },
        handleTabClick: function(index) {
            this.setState({active: index})
        }
    });
    
    

    var TabsPane = React.createClass({
        render: function() {
            var active = this.props.active;
            var items = this.props.items.map(function(item, index) {
                return <a key={index} href="#" className={'tab ' + (active == index ? 'tab_selected' : '')} onClick={this.onClick.bind(this, index)}>
                    {item.title}
                </a>;
            }.bind(this));
            return <div>{items}</div>;
        },
        onClick: function(index, event) {
            event.preventDefault();
            this.props.onTabClick(index);
        }
    });

    var TabsContent = React.createClass({
        render: function() {
            var active = this.props.active;
            var items = this.props.items.map(function(item, index) {
                return <div key={index} className={'tabs-panel ' + (active == index ? 'tabs-panel_selected' : '')}>{item.content}</div>;
            });
            return <div>{items}</div>;
        }
    });

