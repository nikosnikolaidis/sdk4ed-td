import React from 'react';
import PropTypes from 'prop-types'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HCExporting from 'highcharts/modules/exporting';
import HCCSVExporting from 'highcharts/modules/export-data';
HCExporting(Highcharts);
HCCSVExporting(Highcharts);

const options = (title, positiveFilePaths, negativeFilePaths, seriesObjectArray, subtitle) => {
    const options = {
        chart: {
            type: 'bar',
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
        xAxis: [{
            categories: positiveFilePaths,
            reversed: true,
            labels: {
                step: 1
            },
        }, {
            categories: negativeFilePaths,
            reversed: false,
            opposite: true,
            linkedTo: 0,
            labels: {
                step: 1
            },
        }],
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

export default class NegativeLineChart extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        positiveFilePaths: PropTypes.object,
        negativeFilePaths: PropTypes.object,
        series: PropTypes.object,
        subtitle: PropTypes.string
    }

    render() {

        return (
            <div>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options(this.props.title, this.props.positiveFilePaths, this.props.negativeFilePaths, this.props.series, this.props.subtitle)}
                />
            </div>
        )
    }
};