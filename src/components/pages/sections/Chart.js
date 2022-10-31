import React from 'react';
import Plot from 'react-plotly.js';
import ContentPanel from './ContentPanel' 

/**
 * A convenience wrapper to a Plot.ly plot.
 * All props are directly passed as state. See Plot.ly's documentation for more information.
 */
class PlotlyChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
    }

    render() {
        return (
            <ContentPanel title={this.props.title} className="pl-0 pr-0 mr-1 ml-1">
            <Plot 
                data={this.state.data}
                layout={this.state.layout}
                frames={this.state.frames}
                config={this.state.config}
                onInitialized={(figure) => this.setState(figure)}
                onUpdate={(figure) => this.setState(figure)}
            />
            </ContentPanel>
        );
    }
}

export default PlotlyChart;