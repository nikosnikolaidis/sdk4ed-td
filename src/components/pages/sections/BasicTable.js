import lodash, { isEmpty } from 'lodash';
import { MDBDataTable, Alert } from "mdbreact";
import PropTypes from 'prop-types';
import React from 'react';
import Table from './Table';

function calculateAverage(rows, aggregatedDataColumns) {
    const averageRow = {};
    averageRow[aggregatedDataColumns[0].label] = "AVG";

    for (let i = 1; i < aggregatedDataColumns.length; i++) {
        const sum = rows.map((x) => x[aggregatedDataColumns[i].label]).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        averageRow[aggregatedDataColumns[i].label] = parseFloat(sum / rows.length).toFixed(2);
    }

    return averageRow;
}

function calculateSum(rows, aggregatedDataColumns) {
    const sumRow = {};
    sumRow[aggregatedDataColumns[0].label] = "SUM";

    for (let i = 1; i < aggregatedDataColumns.length; i++) {
        const sum = rows.reduce((accumulator, currentValue) => accumulator + currentValue[aggregatedDataColumns[i].label], 0);
        sumRow[aggregatedDataColumns[i].label] = parseFloat(sum).toFixed(2);
    }

    return sumRow;
}

function calculateMax(rows, aggregatedDataColumns) {
    const maxRow = {};
    maxRow[aggregatedDataColumns[0].label] = "MAX";

    for (let i = 1; i < aggregatedDataColumns.length; i++) {
        const max = Math.max(...rows.map((item) => item[aggregatedDataColumns[i].label]));
        maxRow[aggregatedDataColumns[i].label] = parseFloat(max).toFixed(2);
    }

    return maxRow;
}

export function formatAggregatedData(tableData) {
    let aggregatedData = [];
    if (typeof tableData !== undefined && !isEmpty(tableData.columns)) {
        const aggregatedDataColumns = lodash.cloneDeep(tableData.columns);
        aggregatedDataColumns[0].label = 'Aggregation';
        aggregatedDataColumns[0].field = 'Aggregation';

        const aggregatedDataRows = [];
        // console.log("BASIC TABLE tableData.rows: " + JSON.stringify(tableData.rows));

        aggregatedDataRows.push(calculateAverage(tableData.rows, aggregatedDataColumns));
        aggregatedDataRows.push(calculateSum(tableData.rows, aggregatedDataColumns));
        aggregatedDataRows.push(calculateMax(tableData.rows, aggregatedDataColumns));

        aggregatedData = {
            'columns': aggregatedDataColumns,
            'rows': aggregatedDataRows
        };

    }
    return aggregatedData;
}

export function formatTableData(arr) {
    if (typeof arr !== undefined && !isEmpty(arr)) {
        var data = JSON.parse(JSON.stringify(arr));

        const keys = [];
        const columns = [];
        const rows = [];
        if (data.length > 0) {
            keys.push(Object.keys(data[0]));

            for (let i = 0; i < keys[0].length; i++) {
                // console.log("keys[i]: " + keys[0][i]);
                let column = {
                    'label': '' + keys[0][i] + '',
                    'field': '' + keys[0][i] + '',
                    'sort': 'asc',
                    'width': 150
                };
                columns.push(column);
            }
        }
        rows.push(data);

        const tableData = {
            'columns': columns,
            'rows': rows[0]
        };
        return tableData;
    }

    return {}
}

export default class BasicTable extends React.Component {

    static propTypes = {
        /**
         * An object that respects as defined here https://mdbootstrap.com/docs/react/tables/additional/
         * It contains the data that will be visualized in the table
         */
        data: PropTypes.any,

        /**
         * The title of the table.
         */
        title: PropTypes.string,

        showAggregatedData: PropTypes.bool,
    }

    render() {
        const tableData = formatTableData(this.props.data);

        let aggregatedData = formatAggregatedData(tableData);

        console.log("this.props.showAggregatedData: " + this.props.showAggregatedData);

        let alertInnerText;
        if (this.props.showAggregatedData) {
            alertInnerText = "Class-Level Analysis"
        } else {
            alertInnerText = "System-Level Analysis"
        }
        return (
            <>
                {this.props.showAggregatedData && (aggregatedData > 0 || <Table cardHeaderColor="blue-grey" data={aggregatedData} title="System-Level Analysis" />)}
                <br/>
                <Alert className="blue-grey white-text" color="blue-grey" title="State Alert">
                    {alertInnerText}
                </Alert>
                <MDBDataTable striped small bordered responsive hover data={tableData} />
            </>
        )
    }
}