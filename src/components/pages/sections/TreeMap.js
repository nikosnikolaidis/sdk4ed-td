import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsTreemap from 'highcharts/modules/treemap';
import highchartsMore from 'highcharts/highcharts-more';
import HCExporting from 'highcharts/modules/exporting';
import HCCSVExporting from 'highcharts/modules/export-data';
HCExporting(Highcharts);
HCCSVExporting(Highcharts);
highchartsMore(Highcharts);

// Initialize the Treemap module
highchartsTreemap(Highcharts);

export default class MyTreemapChart extends React.Component {
    render() {
        const { title, data, seriesNames, subtitle } = this.props;

        const chartOptions = {
            chart: {
                type: 'treemap',
            },
            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: [
                            'downloadCSV',
                            'downloadXLS',
                            'separator',
                            'downloadPNG',
                            'downloadJPEG',
                            'downloadSVG',
                            'separator',
                            'printChart',
                        ],
                    },
                },
            },
            title: {
                text: title,
            },
            subtitle: {
                text: subtitle
            },
            colorAxis: {
                minColor: '#FFFFFF',
                maxColor: 'rgba(84,130,53,1)'
            },
            series: [
                {
                    type: 'treemap',
                    layoutAlgorithm: "squarified",
                    aspectRatio: 1,
                    layoutStartingDirection: "horizontal",
                    data: data,
                },
            ],
        };

        return (
            <div>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                />
            </div>
        );
    }
}