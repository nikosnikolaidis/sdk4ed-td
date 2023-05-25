import PropTypes from 'prop-types';
import React from 'react';
import { CSVLink } from 'react-csv';
import { Alert, MDBBtn, MDBCard, MDBCardBody, MDBCardHeader, MDBCol, MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle, MDBFormInline, MDBRow } from "mdbreact";

function extractDataFromJsonIntoTable(data) {
    const allDataCSV = [];

    for (let i = 0; i < data.length; i++) {
        allDataCSV.push(Object.values(data[i]));
    }

    return allDataCSV;
}

function generateCSVData(tableData, aggregatedData) {
    const allDataCSV = [];

    if (tableData.columns != undefined) {
        // Push column labels from tableData
        allDataCSV.push([...tableData.columns.map(x => x.label)]);
    }

    if (tableData.rows != undefined && tableData.rows.length > 0) {
        // Push rows from tableData
        for (let i = 0; i < tableData.rows.length; i++) {
            allDataCSV.push(extractDataFromJsonIntoTable(tableData.rows)[i]);
        }
    }

    // Push an empty row
    allDataCSV.push([]);

    if (aggregatedData.columns != undefined) {
        // Push column labels from aggregatedData
        allDataCSV.push([...aggregatedData.columns.map(x => x.label)]);
    }

    if (aggregatedData.rows != undefined && aggregatedData.rows.length > 0) {
        // Push rows from aggregatedData
        for (let i = 0; i < aggregatedData.rows.length; i++) {
            allDataCSV.push(extractDataFromJsonIntoTable(aggregatedData.rows)[i]);
        }
    }

    return allDataCSV;
}

DownloadCSVButton.propTypes = {
    data: PropTypes.array,
    aggregatedData: PropTypes.array,
    filename: PropTypes.string,
};

function DownloadCSVButton({ tableData, aggregatedData, filename }) {
    return (
        <>
            <MDBBtn>
                <CSVLink data={generateCSVData(tableData, aggregatedData)} filename={filename + '.csv'}>
                    Download CSV
                </CSVLink>
            </MDBBtn>
        </>
    );
}



export default DownloadCSVButton;
