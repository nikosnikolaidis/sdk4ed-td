import React from 'react';
import PropTypes from 'prop-types'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HCExporting from 'highcharts/modules/exporting';
import HCCSVExporting from 'highcharts/modules/export-data';
HCExporting(Highcharts);
HCCSVExporting(Highcharts);

const options = (chartTitle, series) => {
    const options = {
        chart: {
            type: 'line'
        },

        title: {
            text: chartTitle,
            align: 'center'
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

        pane: {
            size: '80%'
        },

        xAxis: {

            tickmarkPlacement: 'on',
            allowDecimals: false,
            lineWidth: 0
        },

        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0
        },

        tooltip: {
            shared: true,
            pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
        },

        legend: {
            align: 'right'
        },
        series: series,

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        align: 'center',
                        verticalAlign: 'bottom'
                    },
                    pane: {
                        size: '70%'
                    }
                }
            }]
        }
    }

    return options;
};

export default class LineChart extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        series: PropTypes.object
    }

    render() {

        return (
            <div>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options(this.props.title, this.props.series)}
                />
            </div>
        )
    }
};