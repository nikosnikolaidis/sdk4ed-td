import { MDBDataTable } from "mdbreact";
import PropTypes from 'prop-types';
import React, { useState } from 'react';

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
        title: PropTypes.string
    }

    render() {

        var data = JSON.parse(JSON.stringify(this.props.data));
        console.log(this.props.title + " : " + JSON.stringify(data));

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
                }
                columns.push(column);
            }
        }
        rows.push(data);

        const tableData = {
            'columns': columns,
            'rows': rows[0]
        }

        // console.log("tableData:", tableData);

        return (
            <MDBDataTable striped small bordered responsive hover data={tableData} />
        )
    }
}