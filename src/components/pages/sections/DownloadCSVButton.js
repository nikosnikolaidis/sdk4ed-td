import { isEmpty } from 'lodash';
import { MDBBtn } from "mdbreact";
import PropTypes from 'prop-types';
import React from 'react';
import { CSVLink } from 'react-csv';
import { formatAggregatedData, formatTableData } from './BasicTable';

// Function to extract data from JSON into table
function extractDataFromJsonIntoTable(data) {
    const allDataCSV = [];
    // Loop through each entry in the JSON data object
    data.forEach((entry) => {
        // Push rows from tableData
        allDataCSV.push(Object.values(entry));
    });
    return allDataCSV;
}

// Function to generate CSV data from tableData and aggregatedData
function generateCSVData(tableData, aggregatedData) {
    // console.log("CSV Button tableData: " + JSON.stringify(tableData));
    // console.log("CSV Button aggregatedData: " + JSON.stringify(aggregatedData));
    const allDataCSV = [];
    // Check if tableData has columns
    if (!isEmpty(tableData.columns)) {
        // Push column labels from tableData
        allDataCSV.push([...tableData.columns.map(x => x.label)]);
    }
    // Check if tableData has rows
    if (!isEmpty(tableData.rows)) {
        // Push rows from tableData
        for (let i = 0; i < tableData.rows.length; i++) {
            allDataCSV.push(extractDataFromJsonIntoTable(tableData.rows)[i]);
        }
    }

    // Push an empty row
    allDataCSV.push([]);
    // Check if aggregatedData has columns
    if (!isEmpty(aggregatedData.columns)) {
        // Push column labels from aggregatedData
        allDataCSV.push([...aggregatedData.columns.map(x => x.label)]);
    }
    // Check if aggregatedData has rows
    if (!isEmpty(aggregatedData.rows)) {
        // Push rows from aggregatedData
        for (let i = 0; i < aggregatedData.rows.length; i++) {
            allDataCSV.push(extractDataFromJsonIntoTable(aggregatedData.rows)[i]);
        }
    }

    console.log("allDataCSV: " + JSON.stringify(allDataCSV));
    return allDataCSV;
}

// Define propTypes for component
DownloadCSVButton.propTypes = {
    tableData: PropTypes.array,
    filename: PropTypes.string,
};

// DownloadCSVButton component
function DownloadCSVButton({ tableData, filename }) {
    return (
        <>
            <CSVLink data={generateCSVData(formatTableData(tableData), formatAggregatedData(formatTableData(tableData)))} filename={`${filename}.csv`}>
                <MDBBtn>
                    Download CSV
                </MDBBtn>
            </CSVLink>
        </>
    );
}
// Export DownloadCSVButton component
export default DownloadCSVButton;