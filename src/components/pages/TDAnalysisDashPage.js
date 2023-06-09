import { isNumber } from "lodash";
import { Alert, MDBCard, MDBCardBody, MDBCardHeader, MDBCol, MDBFormInline, MDBRow } from "mdbreact";
import React, { useState } from 'react';
import 'whatwg-fetch';
import BarChart from './sections/BarChart';
import BasicTable from './sections/BasicTable';
import CustomSearchableDropdown from "./sections/CustomSearchableDropdown";
import DownloadCSVButton from './sections/DownloadCSVButton';
import LineChart from './sections/LineChart';
import Loader from './sections/Loading';
import NegativeColumnChart from './sections/NegativeColumnChart';
import { PagePanel } from './sections/PagePanel';
import { CountCard } from './sections/StatusCards';
import TreeMap from './sections/TreeMap';

const INTEREST_ENDPOINT = process.env.REACT_APP_TD_TOOL_INTEREST_ENDPOINT + "api/";
const PRINCIPAL_ENDPOINT = process.env.REACT_APP_TD_TOOL_PRINCIPAL_ENDPOINT + "api/sdk4ed/";

const SELECT_AN_OPTION_TITLE = "Select Revision";

// This the value we multiple td in minutes to get td in currency, is the hour wage of software engineering
const wage = 39.44;

// Function to pause execution for a fixed amount of milliseconds
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const AlertForProjectState = props => {
  if (props.myProjectState !== undefined) {
    console.log("STATE = " + props.myProjectState)
    if (props.myProjectState === 'ABORTED') {
      return (
        <Alert color="danger" title="State Alert" autoHide={5000} dismiss>
          Something went wrong! Analysis was not completed successfully.
        </Alert>
      )
    } else if (props.myProjectState === 'RUNNING') {
      return (
        <Alert color="warning" title="State Alert" autoHide={5000} dismiss>
          Attention the analysis is in progress, you may need to refresh for new analyzed commits.
        </Alert>
      )
    } else if (props.myProjectState === 'COMPLETED') {
      return (
        <Alert color="success" title="State Alert" autoHide={5000} dismiss>
          Analysis completed successfully, all analyzed commits are shown.
        </Alert>
      )
    }
  }
  return (
    <Alert color="danger" title="State Alert" autoHide={5000} dismiss>
      Something went wrong! Probably the analysis not started or the project was deleted from the database.
    </Alert>
  )
}

// The Project Panel
const ProjectPanel = props => {

  return (
    <MDBRow className="mb-4">
      <MDBCol md="12" lg="12" className="mb-12">
        <MDBCard className="mb-12">
          <MDBCardHeader className="sdk4ed-color">Project </MDBCardHeader>
          <MDBCardBody>
            <MDBFormInline className="md-form m-0">
              <MDBCol>
                <h4 style={{ color: '#548235' }}>{props.myprojectName}</h4>
              </MDBCol>
            </MDBFormInline>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  )
}

const TDAnalysisPanel = props => {

  const breakingPointLineChart = () => {
    const result = props.myprincipalLineChart.map((x, i) => {
      try {
        return (x[1] / 60) / props.myInterestLineChart[i]["Interest (In Hours)"];
      } catch (error) {
        console.warn("Probably Analysis is not finished, please refresh the page");
        return null; // or any other value to indicate an error occurred
      }
    });
    return result;
  };

  const chartTitle = 'Evolution of TD Aspects throught Software Versions';

  const series = [{
    name: 'Interest €',
    data: props.myInterestLineChart.map(x => x["Interest (In €)"]),
    pointPlacement: 'on',
    color: "#C70039",
  }, {
    name: 'Principal €',
    data: props.myprincipalLineChart.map(x => x[1]),
    pointPlacement: 'on',
    color: "#3AC5E7",
  }, {
    name: 'Breaking Point',
    data: breakingPointLineChart(),
    pointPlacement: 'on',
    color: "#278649",
  }, {
    name: 'Cumulative Interest €',
    data: props.mycumulativeInterestLineChart.map(x => x["Interest (In €)"]),
    pointPlacement: 'on',
    color: "#F65E17",
  }];


  //=========================================//
  let interestProbability;
  try {
    interestProbability = parseFloat(props.myInterestChange.map(x => x["Change Between Revisions (In %)"])
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0)).toFixed(2);

    interestProbability = interestProbability / props.myInterestChange.length;
  } catch (error) {
    console.warn("Could not calculate interestProbability: " + error);
    interestProbability = 0;
  }

  const totalInterestInEuros = parseFloat(props.myAllFileMetricsAndInterest.map(x => x["Interest (In €)"])
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)).toFixed(2);

  const totalInterestInMinutes = parseFloat(props.myAllFileMetricsAndInterest.map(x => x["Interest (In Hours)"] * 60)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)).toFixed(2);

  const lastPrincipalInMinutes = props.myprincipalLineChart.map(x => x[1])[props.myprincipalLineChart.length - 1];

  const lastPrincipalInEuros = parseFloat((props.myprincipalLineChart.map(x => x[1])[props.myprincipalLineChart.length - 1] / 60) * wage).toFixed(2);

  const totalBreakingPoint = (lastPrincipalInMinutes / totalInterestInMinutes);


  return (
    <PagePanel header="Technical Debt Management Summary" linkTo="tdanalysis">

      <MDBRow className="mb-6">

        <MDBCol>
          {/*============== Render Highchart here ==============*/}
          <LineChart title={chartTitle} series={series} />
          {/*=========================================*/}
        </MDBCol>

      </MDBRow>

      <MDBRow className="mb-6 ">

        <MDBCol >
          <MDBCardHeader className="sdk4ed-color">Interest Project Summary</MDBCardHeader>
          <MDBRow className='mb-3'>
            <MDBCol>
              <CountCard title="BREAKING POINT (version)" color="#33691e light-green darken-4" value={parseFloat(Math.round(totalBreakingPoint)).toFixed(2)} icon="hat-wizard" />
            </MDBCol>
            <MDBCol>
              <CountCard title="TOTAL INTEREST (€)" color="#33691e light-green darken-4" value={totalInterestInEuros} icon="euro-sign" />
            </MDBCol>
            <MDBCol>
              <CountCard title="TOTAL INTEREST IN MINUTES" color="#33691e light-green darken-4" value={totalInterestInMinutes} icon="clock" />
            </MDBCol>
          </MDBRow>
          <MDBRow className='mb-2'>
            {/* <MDBCol>
              <CountCard title="MAINTAINABILITY RANKING (TOP %)" color="#33691e light-green darken-4" value={parseFloat(100 * props.interestRank).toFixed(2)} icon="trophy" />
            </MDBCol> */}
            <MDBCol>
              <CountCard title="INTEREST PROBABILITY (%)" color="#33691e light-green darken-4" value={parseFloat(100 * interestProbability).toFixed(2)} icon="percent" />
            </MDBCol>
            <MDBCol>
              <CountCard title="INTEREST RANKING (TOP %)" color="#33691e light-green darken-4" value={parseFloat(props.myInterestRanking).toFixed(2)} icon="trophy" />
            </MDBCol>
          </MDBRow>
        </MDBCol>


        <MDBCol >
          <MDBCardHeader className="sdk4ed-color">Principal Project Summary</MDBCardHeader>
          <MDBRow className='mb-3'>
            <MDBCol>
              <CountCard title="TD IN MINUTES" value={lastPrincipalInMinutes} icon="clock" />
            </MDBCol>
            <MDBCol>
              <CountCard title="TD IN CURRENCY (€)" color="#33691e light-green darken-4" value={lastPrincipalInEuros} icon="euro-sign" />
            </MDBCol>
          </MDBRow>

          <MDBRow className='mb-2'>
            <MDBCol>
              <CountCard title="BUGS" color="#33691e light-green darken-4" value={props.myBugs} icon="bug" />
            </MDBCol>
            <MDBCol>
              <CountCard title="VULNERABILITIES" color="#33691e light-green darken-4" value={props.myVulnerabilities} icon="lock-open" />
            </MDBCol>
            <MDBCol>
              <CountCard title="CODE SMELLS" color="#33691e light-green darken-4" value={props.myCodeSmells} icon="compress-arrows-alt" />
            </MDBCol>
          </MDBRow>
        </MDBCol>

      </MDBRow>
    </PagePanel>
  )
}

const AllFileMetricsAndInterestPanel = props => {

  const [selectedValue, setSelectedValue] = useState('');
  const [data, setData] = useState([]);
  var errorReturned = false;

  const handleSelect = async (value) => {
    let storedProject = sessionStorage.getItem('selected_project');
    let storedProjectJson = JSON.parse(storedProject);
    let url = "";
    let urlPrefix = INTEREST_ENDPOINT + "analysis/"
    url = urlPrefix + "allFileMetricsAndInterest?url=" + storedProjectJson.endpoint.toString() + "&sha=" + value;
    setSelectedValue(value);
    const response = await fetch(url).then(resp => {
      return resp;
    }).catch(e => console.error("error: " + e));
    if (response) {
      const json = await response.json();
      setData(json);
    } else {
      errorReturned = true;
    }
  };

  const handleClear = () => {
    setSelectedValue('');
    setData([]);
  };

  const options = getOptionsForDropdownInAlert(props.myAnalyzedCommits);

  const getTableData = () => {
    if (data.length === 0) {
      return [...props.myAllFileMetricsAndInterest];
    } else {
      return data;
    }
  }

  const panelTitle = "Interest per File";
  const tableTitle = "Class-Level Analysis";

  const filename = props.myprojectName + "_" + panelTitle + "_version_" + getSelectedValue(selectedValue, props.myAnalyzedCommits);

  //--------------------------------------------------------------------------------------//
  // TreeMap configurations
  //--------------------------------------------------------------------------------------//
  const treeMapData = getTableData().map(item => {
    if (item['Interest (In €)'] !== 0 && isNumber(item['Interest (In €)'])) {
      return ({
        name: item['File Path'].split("\/")[item["File Path"].split("\/").length - 1],
        value: item['Interest (In €)'],
        colorValue: item['Interest (In €)'],
      })
    }
  }).slice(0, 30);

  const seriesNames = ['Interest (In €)', 'Interest (In Hours)'];

  let subtitle = "Top Java classes with the highest interest";

  //--------------------------------------------------------------------------------------//

  return (
    <PagePanel header={panelTitle} linkTo="tdanalysis" isCollapsed={true}>
      <Alert color="info">
        Please choose a commit from the dropdown below. (First option is the latest analyzed commit)
        <MDBRow className="mb-12">
          <CustomSearchableDropdown options={options} onSelect={handleSelect} onClear={handleClear} />
          <MDBCol className="text-right">
            <DownloadCSVButton tableData={getTableData()} filename={filename} />
          </MDBCol>
        </MDBRow>
      </Alert>
      {/* // ---------------------------------------------------------------------------------------------------------- // */}

      <MDBRow className="mb-12">
        <MDBCol md="12" lg="12" className="mb-12">
          <TreeMap title={"High Interest Design Hotspots"} subtitle={subtitle} data={treeMapData} seriesNames={seriesNames} />
          <BasicTable title={tableTitle} data={getTableData()} showAggregatedData={true} />
        </MDBCol>
      </MDBRow>

    </PagePanel>
  )
}

const InterestPerCommitPanel = props => {

  const [selectedValue, setSelectedValue] = useState('');
  const [data, setData] = useState([]);
  var errorReturned = false;

  const handleSelect = async (value) => {
    let storedProject = sessionStorage.getItem('selected_project');
    let storedProjectJson = JSON.parse(storedProject);
    let url = "";
    let urlPrefix = INTEREST_ENDPOINT + "analysis/"
    url = urlPrefix + "interestPerCommitFile?url=" + storedProjectJson.endpoint.toString() + "&sha=" + value;
    setSelectedValue(value);
    const response = await fetch(url).then(resp => {
      return resp;
    }).catch(e => console.error("error: " + e));
    if (response) {
      const json = await response.json();
      setData(json);
    } else {
      errorReturned = true;
    }
  };

  const options = getOptionsForDropdownInAlert(props.myAnalyzedCommits);

  const handleClear = () => {
    setSelectedValue('');
    setData([]);
  };

  const getTableData = () => {
    if (data.length === 0) {
      return [...props.myInterestPerCommit];
    } else {
      return data;
    }
  }

  const panelTitle = "Interest Evolutions as Diff";

  const filename = props.myprojectName + "_" + panelTitle + "_version_" + getSelectedValue(selectedValue, props.myAnalyzedCommits);

  //--------------------------------------------------------------------------------------//
  // Bar Chart configurations
  //--------------------------------------------------------------------------------------//
  let sortedData = [...getTableData()].sort((a, b) => b["Interest (In €)"] - a["Interest (In €)"]);

  let filePaths = sortedData.map(x => {
    return x["File Path"].split("\/")[x["File Path"].split("\/").length - 1];
  });

  const series = [];
  let barChartData;

  for (const key of ["Interest (In €)", "Interest (In Hours)", "Contribution to Project Interest"]) {
    sortedData = [...getTableData()].sort((a, b) => b[key] - a[key]).map(value => {
      if ((value[key] !== null || value[key] !== undefined) && isNumber(value[key])) {
        return value[key];
      }
    });
    const firstMaxValues = sortedData.slice(0, 30);

    barChartData = {
      'name': key,
      'data': firstMaxValues
    }
    series.push(barChartData);
  }

  //--------------------------------------------------------------------------------------//
  // Negative Column Chart configurations
  //--------------------------------------------------------------------------------------//

  sortedData = [...getTableData()].sort((a, b) => b["Changed Interest (In €)"] - a["Changed Interest (In €)"]);

  let positiveFilePaths = sortedData.map(x => {
    return x["File Path"].split("\/")[x["File Path"].split("\/").length - 1];
  });
  const columnSeries = [];
  let positiveData;

  for (const key of ["Changed Interest (In €)", "Changed Interest (In Hours)", "Change Between Revisions (In %)"]) {
    sortedData = [...getTableData()].sort((a, b) => b[key] - a[key]).map(value => {
      if ((value[key] !== null || value[key] !== undefined) && isNumber(value[key])) {
        return value[key];
      } else {
        return 0;
      }
    });
    const firstMaxValues = sortedData.slice(0, 10);

    positiveData = {
      'name': "Positive " + key,
      'data': firstMaxValues
    }
    columnSeries.push(positiveData);
  }

  sortedData = [...getTableData()].sort((a, b) => a["Changed Interest (In €)"] - b["Changed Interest (In €)"]);
  let negativeFilePaths = sortedData.map(x => {
    return x["File Path"].split("\/")[x["File Path"].split("\/").length - 1];
  });
  let negativeData;
  for (const key of ["Changed Interest (In €)", "Changed Interest (In Hours)", "Change Between Revisions (In %)"]) {
    sortedData = [...getTableData()].sort((a, b) => a[key] - b[key]).map(value => {
      if ((value[key] !== null || value[key] !== undefined) && isNumber(value[key])) {
        return value[key];
      } else {
        return 0;
      }
    });
    const firstMinValues = sortedData.slice(0, 10);

    negativeData = {
      'name': "Negative " + key,
      'data': firstMinValues
    }
    columnSeries.push(negativeData);
  }

  console.log(columnSeries)
  //--------------------------------------------------------------------------------------//
  let subtitle = "Top Java classes with the highest interest";
  return (
    <PagePanel header={panelTitle} linkTo="tdanalysis" isCollapsed={true}>

      <Alert color="info">Please choose a commit sha from the dropdown below. (First option is the latest analyzed commit)
        <MDBRow className="mb-12">
          <CustomSearchableDropdown options={options} onSelect={handleSelect} onClear={handleClear} />
          <MDBCol className="text-right">
            <DownloadCSVButton tableData={getTableData()} filename={filename} />
          </MDBCol>
        </MDBRow>
      </Alert>

      <MDBRow className="mb-12">
        <MDBCol >
          <BarChart title={panelTitle} xAxisArray={filePaths} series={series} subtitle={subtitle} />
          {/* </MDBCol>
        <MDBCol> */}
          <NegativeColumnChart title={"File Interest Change Indicators"} subtitle={"Most Changed Java Classes"} positiveFilePaths={positiveFilePaths} negativeFilePaths={negativeFilePaths} series={columnSeries} />
        </MDBCol>
      </MDBRow>

      <MDBRow className="mb-12">
        <MDBCol md="12" lg="12" className="mb-12">
          <BasicTable title={panelTitle} data={getTableData()} showAggregatedData={true} />
        </MDBCol>
      </MDBRow>
    </PagePanel>
  )
}

const InterestChangePanel = props => {

  const [selectedValue, setSelectedValue] = useState('');
  const [data, setData] = useState([]);
  var errorReturned = false;

  const handleSelect = async (value) => {
    let storedProject = sessionStorage.getItem('selected_project');
    let storedProjectJson = JSON.parse(storedProject);
    let url = "";
    let urlPrefix = INTEREST_ENDPOINT + "analysis/"
    url = urlPrefix + "normalizedAndInterestChanges?url=" + storedProjectJson.endpoint.toString() + "&sha=" + value;
    setSelectedValue(value);
    const response = await fetch(url).then(resp => {
      return resp;
    }).catch(e => console.error("error: " + e));
    if (response) {
      const json = await response.json();
      setData(json);
    } else {
      errorReturned = true;
    }
  };

  const handleClear = () => {
    setSelectedValue('');
    setData([]);
  };

  const options = getOptionsForDropdownInAlert(props.myAnalyzedCommits);

  const getTableData = () => {
    if (data.length === 0) {
      console.log(props.myInterestChange)
      return [...props.myInterestChange];
    } else {
      return data;
    }
  }

  const panelTitle = "System-Level Interest Evolution Analysis";

  const filename = props.myprojectName + "_" + panelTitle + "_version_" + getSelectedValue(selectedValue, props.myAnalyzedCommits);

  return (
    <>
      <PagePanel header={panelTitle} linkTo="tdanalysis" isCollapsed={true}>
        <Alert color="info">Please choose a commit sha from the dropdown below. (First option is the latest analyzed commit)
          <MDBRow className="mb-12">

            <CustomSearchableDropdown options={options} onSelect={handleSelect} onClear={handleClear} />

            <MDBCol className="text-right">
              <DownloadCSVButton tableData={getTableData()} filename={filename} />
            </MDBCol>
          </MDBRow>
        </Alert>

        <MDBRow className="mb-12">
          <MDBCol md="12" lg="12" className="mb-12">
            <BasicTable nesting title={panelTitle} data={getTableData()} hover responsiveSm showAggregatedData={false} />
          </MDBCol>
        </MDBRow>


        {errorReturned &&
          <Alert color="danger">
            Something went wrong with the server, propably cannot calculate interest change for this commit!
          </Alert>
        }
      </PagePanel>
    </>
  );

}

const CumulativeInterestPanel = props => {
  const panelTitle = "Total Interest per Version"
  let dataList = Array.from(props.mycumulativeInterestLineChart);
  dataList.reverse();

  return (
    <PagePanel header={panelTitle} linkTo="tdanalysis" isCollapsed={true}>

      <MDBRow className="mb-12">
        <MDBCol md="12" lg="12" className="mb-12">
          <BasicTable title={panelTitle} data={dataList} />
        </MDBCol>
      </MDBRow>
    </PagePanel>
  )
}

const ProjectReusabillityMetricsPanel = props => {
  const panelTitle = "Total Quality Metrics per Version"
  return (
    <PagePanel header={panelTitle} linkTo="tdanalysis" isCollapsed={true}>

      <MDBRow className="mb-12">
        <MDBCol md="12" lg="12" className="mb-12">
          <BasicTable title={panelTitle} data={props.myProjectReusabillityMetrics} />
        </MDBCol>
      </MDBRow>
    </PagePanel>
  )
}

const FileReusabillityMetricsPanel = props => {
  const panelTitle = "File Reusabillity Metrics Indicators"
  return (
    <PagePanel header={panelTitle} linkTo="tdanalysis" isCollapsed={true}>

      <MDBRow className="mb-12">
        <MDBCol md="12" lg="12" className="mb-12">
          <BasicTable title={panelTitle} data={props.myFileReusabillityMetrics} />
        </MDBCol>
      </MDBRow>
    </PagePanel>
  )
}

const HighInterestFilesPanel = props => {
  const panelTitle = "High Interest Design Hotspots"

  const data = props.myHighInterestFiles.map(item => ({
    name: item['File Path'],
    value: item['Interest (In €)'],
    colorValue: item['Interest (In €)'],
  })).slice(0, 30);

  const seriesNames = ['Interest (In €)', 'Interest (In Hours)'];

  return (
    <PagePanel header={panelTitle} linkTo="tdanalysis" isCollapsed={true}>
      <TreeMap title={panelTitle} subtitle="Top 30 Java classes with the highest interest" data={data} seriesNames={seriesNames} />
      <MDBRow className="mb-12">
        <MDBCol md="12" lg="12" className="mb-12">
          <BasicTable title={panelTitle} data={props.myHighInterestFiles} />
        </MDBCol>
      </MDBRow>
    </PagePanel>
  )
}

const FileInterestChangePanel = props => {
  const panelTitle = "File Interest Change Indicators"
  return (
    <PagePanel header={panelTitle} linkTo="tdanalysis" isCollapsed={true}>

      <MDBRow className="mb-12">
        <MDBCol md="12" lg="12" className="mb-12">
          <BasicTable title={panelTitle} data={props.myFileInterestChange} />
        </MDBCol>
      </MDBRow>
    </PagePanel>
  )
}

const NormalizedInterestPanel = props => {
  const panelTitle = "Normalized Interest Indicators"
  return (
    <PagePanel header={panelTitle} linkTo="tdanalysis" isCollapsed={true}>

      <MDBRow className="mb-12">
        <MDBCol md="12" lg="12" className="mb-12">
          <BasicTable title={panelTitle} data={props.myNormalizedInterest} />
        </MDBCol>
      </MDBRow>
    </PagePanel>
  )
}

const AnalyzedCommitsPanel = props => {
  const panelTitle = "Analyzed Commits Indicators"
  return (
    <PagePanel header={panelTitle} linkTo="tdanalysis" isCollapsed={true}>

      <MDBRow className="mb-12">
        <MDBCol md="12" lg="12" className="mb-12">
          <BasicTable title={panelTitle} data={props.myAnalyzedCommits} />
        </MDBCol>
      </MDBRow>
    </PagePanel>
  )
}

function getOptionsForDropdownInAlert(myAnalyzedCommits) {
  const options = [];
  let option;
  for (let i = 0; i < myAnalyzedCommits.length; i++) {
    option = {
      'text': myAnalyzedCommits[i].revisionCount,
      'value': myAnalyzedCommits[i].sha
    };
    options.push(option);
  }
  return options;
}

const getSelectedValue = (selectedValue, myAnalyzedCommits) => {
  return selectedValue ? getOptionsForDropdownInAlert(myAnalyzedCommits).find(option => option.value === selectedValue).text : "LATEST";
}

/**
 * The technical debt dashboard page. The page is assembled using multiple panels.
 * The data is retrieved asynchronously.
 */
class TDAnalysisDashPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      name: "Dummy Project Title",
      language: 'Java',
      interestIndicatorsSummary: {},
      interestIndicators: {},
      interestLineChart: {},
      principalLineChart: {},
      breakingPointLineChart: {},
      cumulativeInterestLineChart: [],
      interestRank: {},
      interestProbabilityRank: {},
      principalIndicatorsSummary: {},
      principalIndicators: {},
      projectReusabillityMetrics: [],
      fileReusabillityMetrics: [],
      normalizedInterest: [],
      interestPerCommit: [],
      highInterestFiles: [],
      fileInterestChange: [],
      analyzedCommits: [],
      allFileMetricsAndInterest: [],
      interest: [],
      interestChange: [],
      interestRanking: [],
      principalList: []
    }
  }

  // Update project
  updateProjectData = (projectName) => {

    let projectTitle = "Dummy Project Title";
    // This should be change in integration
    let lag = 'Java';

    let storedProject = sessionStorage.getItem('selected_project');
    let storedProjectJson = JSON.parse(storedProject);



    projectTitle = storedProjectJson.name;

    // Fetch TD info from session storage
    if (storedProjectJson['common'] !== '') {
      let common = JSON.parse(storedProjectJson['common']);
      if ('language' in common) {
        lag = common['language']
      }
    }

    lag = lag.toLowerCase();

    this.setState({
      isLoading: true,
      name: projectTitle,
      language: lag
    });

    let url = "";
    let urlPrefix = INTEREST_ENDPOINT + "analysis/"

    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    url = urlPrefix + "analyzedCommits?url=" + projectName.toString();
    fetch(url, requestOptions)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          analyzedCommits: resp,
        })
      })
      .catch(error => console.log('error', error));

    // ---------------------------------------------------------------------------------------------------------- //

    /* url = urlPrefix + "projectReusabilityMetrics?url=" + projectName.toString();
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => {
        let data = result;
        this.setState({
          isLoading: false,
          projectReusabillityMetrics: data,
        })
      })
      .catch(error => console.log('error', error)); */

    // ---------------------------------------------------------------------------------------------------------- //
    //removed panel
    /* url = urlPrefix + "fileReusabilityMetrics?url=" + projectName.toString();
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => {
        let data = result;
        this.setState({
          isLoading: false,
          fileReusabillityMetrics: data,
        })
      })
      .catch(error => console.log('error', error)); */

    // ---------------------------------------------------------------------------------------------------------- //

    url = urlPrefix + "cumulativeInterest?url=" + projectName.toString();
    fetch(url, requestOptions)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          cumulativeInterestLineChart: resp,
        })
      })
      .catch(error => console.log('error', error));

    // ---------------------------------------------------------------------------------------------------------- //

    /* url = urlPrefix + "normalizedInterest?url=" + projectName.toString();
    fetch(url, requestOptions)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          normalizedInterest: resp,
        })
      })
      .catch(error => console.log('error', error)); */

    // ---------------------------------------------------------------------------------------------------------- //

    url = urlPrefix + "interestPerCommitFile?url=" + projectName.toString();
    fetch(url, requestOptions)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          interestPerCommit: resp,
        })
      })
      .catch(error => console.log('error', error));

    // ---------------------------------------------------------------------------------------------------------- //

    /* url = urlPrefix + "highInterestFiles?url=" + projectName.toString();
    fetch(url, requestOptions)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          highInterestFiles: resp,
        })
      })
      .catch(error => console.log('error', error)); */

    // ---------------------------------------------------------------------------------------------------------- //

    /* url = urlPrefix + "fileInterestChange?url=" + projectName.toString();
    fetch(url, requestOptions)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          fileInterestChange: resp,
        })
      })
      .catch(error => console.log('error', error)); */

    // ---------------------------------------------------------------------------------------------------------- //

    url = urlPrefix + "allFileMetricsAndInterest?url=" + projectName.toString();
    fetch(url, requestOptions)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          allFileMetricsAndInterest: resp,
        })
      })
      .catch(error => console.log('error', error));

    // ---------------------------------------------------------------------------------------------------------- //

    url = urlPrefix + "interest?url=" + projectName.toString();
    fetch(url, requestOptions)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          interest: resp,
        })
      })
      .catch(error => console.log('error', error));

    // ---------------------------------------------------------------------------------------------------------- //

    url = urlPrefix + "normalizedAndInterestChanges?url=" + projectName.toString();
    fetch(url, requestOptions)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          interestChange: resp,
        })
      })
      .catch(error => console.log('error', error));

    // ---------------------------------------------------------------------------------------------------------- //

    url = urlPrefix + "interest/ranking?url=" + projectName.toString();
    fetch(url, requestOptions)
      .then(resp => resp.text())
      .then(resp => {
        this.setState({
          isLoading: false,
          interestRanking: resp,
        })
      })
      .catch(error => console.log('error', error));

    // ---------------------------------------------------------------------------------------------------------- //

    urlPrefix = INTEREST_ENDPOINT + "project/"
    url = urlPrefix + "state?url=" + projectName.toString();
    fetch(url, requestOptions)
      .then(resp => resp.text())
      .then(resp => {
        this.setState({
          isLoading: false,
          projectState: resp,
        })
      })
      .catch(error => console.log('error', error));

    // ---------------------------------------------------------------------------------------------------------- //
    //eg http://195.251.210.147:8989/api/sdk4ed/metric-evolution/TasosTilsi:ServicedMetricsCalculator?metric=code_smells
    const username = projectName.toString().split('/')[3];
    const reponame = projectName.toString().split('/')[4];
    urlPrefix = PRINCIPAL_ENDPOINT + "metric-evolution/";
    url = urlPrefix + username + ":" + reponame + "?metric=code_smells";
    fetch(url, requestOptions)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          codeSmells: resp[resp.length - 1][1],
        })
      })
      .catch(error => console.log('error', error));

    // ---------------------------------------------------------------------------------------------------------- //
    //eg http://195.251.210.147:8989/api/sdk4ed/metric-evolution/TasosTilsi:ServicedMetricsCalculator?metric=vulnerabilities
    urlPrefix = PRINCIPAL_ENDPOINT + "metric-evolution/";
    url = urlPrefix + username + ":" + reponame + "?metric=vulnerabilities";
    fetch(url, requestOptions)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          vulnerabilities: resp[resp.length - 1][1],
        })
      })
      .catch(error => console.log('error', error));

    // ---------------------------------------------------------------------------------------------------------- //
    //eg http://195.251.210.147:8989/api/sdk4ed/metric-evolution/TasosTilsi:ServicedMetricsCalculator?metric=bugs
    urlPrefix = PRINCIPAL_ENDPOINT + "metric-evolution/";
    url = urlPrefix + username + ":" + reponame + "?metric=bugs";
    fetch(url, requestOptions)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          bugs: resp[resp.length - 1][1],
        })
      })
      .catch(error => console.log('error', error));

    // ---------------------------------------------------------------------------------------------------------- //
    //eg http://195.251.210.147:8989/api/sdk4ed/metric-evolution/TasosTilsi:ServicedMetricsCalculator?metric=sqale_index
    urlPrefix = PRINCIPAL_ENDPOINT + "metric-evolution/";
    url = urlPrefix + username + ":" + reponame + "?metric=sqale_index";
    fetch(url, requestOptions)
      .then(resp => resp.json())
      .then(resp => {
        console.log(resp)
        this.setState({
          isLoading: false,
          principalList: resp,
        })
      })
      .catch(error => console.log('error', error));

  }

  componentDidMount() {
    if (sessionStorage.getItem('selected_project') === null) {
      this.setState({
        error: { message: 'No project selected. Please select a project from the "Projects" panel and retry.' },
      })
    }
    else {
      var selectedProjectSession = JSON.parse(sessionStorage.getItem('selected_project'))
      var selectedProjectURL = selectedProjectSession['endpoint']
      var repoName = (selectedProjectURL.replace('.git', '').split('/'))[selectedProjectURL.split("/").length - 1]
      // console.log(selectedProjectURL.replace('.git', ''))
      // console.log(repoName)
      this.updateProjectData(selectedProjectURL.replace('.git', ''))
    }
  }

  render() {
    const {
      error,
      isLoading,
      name,
      interestIndicatorsSummary,
      interestIndicators,
      interestLineChart,
      principalLineChart,
      breakingPointLineChart,
      cumulativeInterestLineChart,
      radarChartvalues,
      principalIndicatorsSummary,
      principalIndicators,
      interestRank,
      interestProbabilityRank,
      projectReusabillityMetrics,
      fileReusabillityMetrics,
      normalizedInterest,
      interestPerCommit,
      highInterestFiles,
      fileInterestChange,
      interestChange,
      analyzedCommits,
      allFileMetricsAndInterest,
      interest,
      interestRanking,
      projectState,
      codeSmells,
      vulnerabilities,
      bugs,
      principalList
    } = this.state

    if (error) {
      return (
        <div class="alert alert-danger" role="alert">
          {error.message}
        </div>
      )
    }

    if (isLoading) {
      return (<Loader />)
    }
    else {
      return (
        <React.Fragment>

          <AlertForProjectState
            myProjectState={projectState}
          />

          <ProjectPanel
            myprojectName={name}
            updateProjectData={this.updateProjectData}
          />

          <TDAnalysisPanel
            myprojectName={name}
            updateProjectData={this.updateProjectData}
            interest={interestIndicatorsSummary}
            interestArtifacts={interestIndicators}
            myprincipalLineChart={principalList}
            mybreakingpointLineChart={breakingPointLineChart}
            mycumulativeInterestLineChart={cumulativeInterestLineChart}
            myInterestLineChart={interest}
            myInterestChange={interestChange}
            myInterestRanking={interestRanking}
            myAllFileMetricsAndInterest={allFileMetricsAndInterest}
            myCodeSmells={codeSmells}
            myVulnerabilities={vulnerabilities}
            myBugs={bugs}
            radarChartVal={radarChartvalues}
            interestProbabilityRank={interestProbabilityRank}
            interestRank={interestRank}
            principal={principalIndicatorsSummary}
            principalArtifacts={principalIndicators}
          />

          <AllFileMetricsAndInterestPanel
            myprojectName={name}
            myAnalyzedCommits={analyzedCommits}
            myAllFileMetricsAndInterest={allFileMetricsAndInterest}
          />

          <InterestPerCommitPanel
            myprojectName={name}
            myAnalyzedCommits={analyzedCommits}
            myInterestPerCommit={interestPerCommit}
          />

          <InterestChangePanel
            myAnalyzedCommits={analyzedCommits}
            myprojectName={name}
            myInterestChange={interestChange}
          />

          {/* <HighInterestFilesPanel
            myHighInterestFiles={highInterestFiles}
          /> */}

          {/* <CumulativeInterestPanel
            mycumulativeInterestLineChart={cumulativeInterestLineChart}
          /> */}

          {/* <ProjectReusabillityMetricsPanel
            myProjectReusabillityMetrics={projectReusabillityMetrics}
          /> */}

          {/* <FileReusabillityMetricsPanel
            myFileReusabillityMetrics={fileReusabillityMetrics}
          /> */}

          {/* <NormalizedInterestPanel
            myNormalizedInterest={normalizedInterest}
          /> */}

          {/* <FileInterestChangePanel
            myFileInterestChange={fileInterestChange}
          /> */}

          {/* <AnalyzedCommitsPanel
            myAnalyzedCommits={analyzedCommits}
          /> */}

        </React.Fragment>
      )
    }
  }

}

export default TDAnalysisDashPage;
