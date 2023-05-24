import React from 'react'
import PropTypes from 'prop-types'
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import ContentPanel from './ContentPanel'

/**
 * A simple table to show some simple tabular data.
 * This table is meant to show short tabular data and is shown within a content panel for convenience.
 * For more complex data, refer to https://mdbootstrap.com/docs/react/tables/additional/
 */
class BasicTable extends React.Component {

    static propTypes = {
        /**
         * An object that respects as defined here https://mdbootstrap.com/docs/react/tables/additional/
         * It contains the data that will be visualized in the table
         */
        data: PropTypes.object,

        /**
         * The title of the table.
         */
        title: PropTypes.string
    }

    render(){
        var data = this.props.data
        var rows = []
        var uniqueId = 0
        for(var i in data.rows){
            var row = data.rows[i]
            var r = []
            for(var j in data.columns){
                var field = data.columns[j]['field']
                r.push(<td key={uniqueId++}>{row[field]}</td>)
            }
            rows.push(<tr key={uniqueId++}>{r}</tr>)
        }
        var header = []
        for(var h in data.columns)
            header.push(<th key={uniqueId++}>{data.columns[h]['label']}</th>)


        return(
            <ContentPanel title={this.props.title} isCollapsed={true}>
                <MDBTable small responsive bordered hover striped>
                    <MDBTableHead><tr>{header}</tr></MDBTableHead>
                    <MDBTableBody>{rows}</MDBTableBody>
                </MDBTable>
            </ContentPanel>
        )
    }
}

export default BasicTable;