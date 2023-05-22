import React from 'react';
import PropTypes from 'prop-types'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HCExporting from 'highcharts/modules/exporting';
import HCCSVExporting from 'highcharts/modules/export-data';
HCExporting(Highcharts);
HCCSVExporting(Highcharts);

const options = (title, xAxisArray, seriesObjectArray, subtitle) => {
    const options = {
        chart: {
            type: 'column',
        },
        title: {
            text: title,
        },
        subtitle: {
            text: subtitle
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
        xAxis: {
            categories: xAxisArray || ['Label 1', 'Label 2', 'Label 3'],
        },
        yAxis: {
            title: {
                text: 'Value',
            },
        },
        series: seriesObjectArray || [
            {
                name: 'Data',
                data: [1, 1, 1, 1, 1, 1],
            },
            {
                name: 'Data2',
                data: [2, 2, 2, 2, 2, 2],
            },
        ],
    };

    return options;
};

export default class BarChart extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        xAxisArray: PropTypes.object,
        series: PropTypes.object,
        subtitle:PropTypes.string
    }

    render() {

        return (
            <div>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options(this.props.title, this.props.xAxisArray, this.props.series, this.props.subtitle)}
                />
            </div>
        )
    }
};