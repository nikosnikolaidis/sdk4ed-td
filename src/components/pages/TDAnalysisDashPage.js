import { MDBCollapse, MDBCard, MDBCardBody, MDBCardHeader, MDBCol, MDBDataTable, MDBFormInline, MDBRow, Alert, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from "mdbreact";
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import 'whatwg-fetch';
import ContentPanel from './sections/ContentPanel';
import FileExplorer from './sections/FileExplorer';
import Loader from './sections/Loading';
import { PagePanel } from './sections/PagePanel';
import { CountCard } from './sections/StatusCards';
//============== Import Highcharts ==============//
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const TD_TOOLBOX_ENDPOINT = process.env.REACT_APP_TD_TOOL_ENDPOINT;

// This the value we multiple td in minutes to get td in currency, is the hour wage of software engineering
const wage = 37.50
// Styling options for RadarChart - Edit only for styling modifications
const radarChartOptions = {
  scale: {
    ticks: {
      min: 0,
      max: 1,
      stepSize: 0.2
    },
    pointLabels: {
      fontSize: 15
    },
  },
  responsive: true,
  legend: false,
}

// Function to pause execution for a fixed amount of milliseconds
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
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

const AllFileMetricsAndInterestPanel = props => {

  const [selectedValue, setSelectedValue] = useState('');
  const [data, setData] = useState([]);
  var errorReturned = false;

  const handleSelect = async (value) => {
    let storedProject = sessionStorage.getItem('selected_project');
    let storedProjectJson = JSON.parse(storedProject);
    let url = "";
    let urlPrefix = TD_TOOLBOX_ENDPOINT + "api/analysis/"
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

  const options = [];
  let option;
  for (let i = 0; i < props.myAnalyzedCommits.length; i++) {
    // if (props.myAnalyzedCommits[i].revisionCount > 3) {
    option = {
      'text': props.myAnalyzedCommits[i].revisionCount,
      'value': props.myAnalyzedCommits[i].sha
    }
    options.push(option);
    // }
  }

  return (
    <PagePanel header="All File Metrics And Interest Indicators" linkTo="tdanalysis">
      <Alert color="info">
        Please choose a commit from the dropdown below. (First option is the latest analyzed commit)
        <MDBDropdown dropright>
          <MDBDropdownToggle caret color="primary" >
            {selectedValue ? selectedValue : 'Select an option'}
          </MDBDropdownToggle>
          <MDBDropdownMenu>
            {options.map((option) => (
              <MDBDropdownItem key={option.value}
                onClick={() => {
                  handleSelect(option.value)
                }}>
                {option.text}
              </MDBDropdownItem>
            ))}
          </MDBDropdownMenu>
        </MDBDropdown>
      </Alert>
      {/* // ---------------------------------------------------------------------------------------------------------- // */}

      {data.length == 0 &&
        <MDBRow className="mb-12">
          <MDBCol md="12" lg="12" className="mb-12">
            <BasicTable title="All File Metrics And Interest Indicators" data={props.myAllFileMetricsAndInterest} />
          </MDBCol>
        </MDBRow>
      }

      {data.length > 0 &&
        <MDBRow className="mb-12">
          <MDBCol md="12" lg="12" className="mb-12">
            <BasicTable title="All File Metrics And Interest Indicators" data={data} />
          </MDBCol>
        </MDBRow>
      }

    </PagePanel>
  )

}

const CumulativeInterestPanel = props => {

  return (
    <PagePanel header="Cumulative Interest Indicators" linkTo="tdanalysis">

      <MDBRow className="mb-12">
        <MDBCol md="12" lg="12" className="mb-12">
          <BasicTable title="Cumulative Interest Indicators" data={props.mycumulativeInterestLineChart} />
        </MDBCol>
      </MDBRow>
    </PagePanel>
  )

}

const ProjectReusabillityMetricsPanel = props => {

  return (
    <PagePanel header="Project Reusabillity Metrics Indicators" linkTo="tdanalysis">

      <MDBRow className="mb-12">
        <MDBCol md="12" lg="12" className="mb-12">
          <BasicTable title="Project Reusabillity Metrics Indicators" data={props.myProjectReusabillityMetrics} />
        </MDBCol>
      </MDBRow>
    </PagePanel>
  )

}

const FileReusabillityMetricsPanel = props => {

  return (
    <PagePanel header="File Reusabillity Metrics Indicators" linkTo="tdanalysis">

      <MDBRow className="mb-12">
        <MDBCol md="12" lg="12" className="mb-12">
          <BasicTable title="File Reusabillity Metrics Indicators" data={props.myFileReusabillityMetrics} />
        </MDBCol>
      </MDBRow>
    </PagePanel>
  )

}

const NormalizedInterestPanel = props => {

  return (
    <PagePanel header="Normalized Interest Indicators" linkTo="tdanalysis">

      <MDBRow className="mb-12">
        <MDBCol md="12" lg="12" className="mb-12">
          <BasicTable title="Normalized Interest Indicators" data={props.myNormalizedInterest} />
        </MDBCol>
      </MDBRow>
    </PagePanel>
  )

}

const HighInterestFilesPanel = props => {

  return (
    <PagePanel header="High Interest Files Indicators" linkTo="tdanalysis">

      <MDBRow className="mb-12">
        <MDBCol md="12" lg="12" className="mb-12">
          <BasicTable title="High Interest Files Indicators" data={props.myHighInterestFiles} />
        </MDBCol>
      </MDBRow>
    </PagePanel>
  )

}

const InterestPerCommitPanel = props => {

  return (
    <PagePanel header="Interest Per Commit Indicators" linkTo="tdanalysis">

      <MDBRow className="mb-12">
        <MDBCol md="12" lg="12" className="mb-12">
          <BasicTable title="Interest Per Commit Indicators" data={props.myInterestPerCommit} />
        </MDBCol>
      </MDBRow>
    </PagePanel>
  )

}

const FileInterestChangePanel = props => {

  return (
    <PagePanel header="File Interest Change Indicators" linkTo="tdanalysis">

      <MDBRow className="mb-12">
        <MDBCol md="12" lg="12" className="mb-12">
          <BasicTable title="File Interest Change Indicators" data={props.myFileInterestChange} />
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
    let urlPrefix = TD_TOOLBOX_ENDPOINT + "api/analysis/"
    url = urlPrefix + "interestChange?url=" + storedProjectJson.endpoint.toString() + "&sha=" + value;
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

  const options = [];
  let option;
  for (let i = 0; i < props.myAnalyzedCommits.length; i++) {
    if (props.myAnalyzedCommits[i].revisionCount > 3) {
      option = {
        'text': props.myAnalyzedCommits[i].sha,
        'value': props.myAnalyzedCommits[i].sha
      }
      options.push(option);
    }
  }

  return (
    <>
      <Alert color="info">Please choose a commit sha from the dropdown below. (First option is the latest analyzed commit)
        <MDBDropdown dropright>
          <MDBDropdownToggle caret color="primary">
            {selectedValue ? selectedValue : 'Select an option'}
          </MDBDropdownToggle>

          <MDBDropdownMenu>
            {options.map((option) => (
              <MDBDropdownItem key={option.value}
                onClick={() => {
                  handleSelect(option.value)
                }}>
                {option.text}
              </MDBDropdownItem>
            ))}
          </MDBDropdownMenu>
        </MDBDropdown>
      </Alert>

      {data.length > 0 &&
        <PagePanel header="Interest Change Indicators" linkTo="tdanalysis">
          <MDBRow className="mb-12">
            <MDBCol md="12" lg="12" className="mb-12">
              <BasicTable nesting title="Interest Change Indicators" data={data} hover responsiveSm />
            </MDBCol>
          </MDBRow>
        </PagePanel>
      }

      {data.length === 0 &&
        <Alert color="warning">
          Nothing returned, there is no interest change for this commit!
        </Alert>
      }

      {errorReturned &&
        <Alert color="danger">
          Something went wrong with the server, propably cannot calculate interest change for this commit!
        </Alert>
      }
    </>
  );

}

const AnalyzedCommitsPanel = props => {

  return (
    <PagePanel header="Analyzed Commits Indicators" linkTo="tdanalysis">

      <MDBRow className="mb-12">
        <MDBCol md="12" lg="12" className="mb-12">
          <BasicTable title="Analyzed Commits Indicators" data={props.myAnalyzedCommits} />
        </MDBCol>
      </MDBRow>
    </PagePanel>
  )

}

const TDAnalysisPanel = props => {

  function normalize(min, max) {
    var delta = max - min;
    return function (val) {
      return (val - min) / delta;
    };
  }

  {/*
	var values = parseFloat(props.radarChartVal.values);

	console.log("Before normalize: " + values);

	console.log(values.map(normalize(Math.min(...values), Math.max(...values))));

	values = values.map(normalize(Math.min(...values), Math.max(...values)))

	console.log("After normalize: " +values);

	*/}

  const InterestRadarPanel = {
    labels: props.radarChartLab.values,
    datasets: [
      {
        label: 'Interest Indicators',
        backgroundColor: 'rgba(84,130,53,0.05)',
        borderColor: 'rgba(84,130,53,1)',
        pointRadius: 4,
        pointHitRadius: 4,
        pointBackgroundColor: 'rgba(84,130,53,1)',
        pointBorderColor: '#c1c7d1',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(84,130,53,1)',
        data: props.radarChartVal.values
      }
    ]
  }

  const options = {
    chart: {
      polar: true,
      type: 'line'
    },

    title: {
      text: 'Evolution of TD Aspects throught Software Versions',
      x: -80,
      align: 'center'
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
    series: [{
      name: 'Interest €',
      data: props.myinterestLineChart.values,
      pointPlacement: 'on',
      color: "#C70039",
    }, {
      name: 'Breaking Point',
      data: props.myAnalyzedCommits,
      pointPlacement: 'on',
      color: "#278649",
    }, {
      name: 'Cumulative Interest €',
      data: props.mycumulativeInterestLineChart.map(x => x.interestEu),
      pointPlacement: 'on',
      color: "#F65E17",
    }],

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


  //=========================================//


  return (
    <PagePanel header="Technical Debt Management Summary" linkTo="tdanalysis">

      <MDBRow className="mb-6">

        <MDBCol>
          {/*============== Render Highchart here ==============*/}
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
          />
          {/*=========================================*/}
        </MDBCol>

      </MDBRow>

      <MDBRow className="mb-6">
        <MDBCol size="12">
          <MDBCardHeader className="sdk4ed-color">Interest Project Summary</MDBCardHeader>
          <MDBRow className="mb-3">
            <MDBCol>
              <CountCard title="BREAKING POINT (version)" color="#33691e light-green darken-4" value={parseFloat(Math.round(props.interest.breakingPoint)).toFixed(2)} icon="hat-wizard" />
            </MDBCol>
            <MDBCol>
              <CountCard title="TOTAL INTEREST (€)" color="#33691e light-green darken-4" value={parseFloat(props.myAllFileMetricsAndInterest.map(x => x.interestEu)
                .reduce((accumulator, currentValue) => accumulator + currentValue, 0)).toFixed(2)} icon="euro-sign" />
            </MDBCol>
            <MDBCol>
              <CountCard title="INTEREST PROBABILITY (%)" color="#33691e light-green darken-4" value={parseFloat(100 * props.interest.interestProbability).toFixed(2)} icon="percent" />
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-3">
            <MDBCol>
              <CountCard title="MAINTAINABILITY RANKING (TOP %)" color="#33691e light-green darken-4" value={parseFloat(100 * props.interestRank).toFixed(2)} icon="trophy" />
            </MDBCol>
            <MDBCol>
              <CountCard title="INTEREST PROBABILITY RANKING (TOP %)" color="#33691e light-green darken-4" value={parseFloat(100 * props.interestProbabilityRank).toFixed(2)} icon="trophy" />
            </MDBCol>
          </MDBRow>
        </MDBCol>
      </MDBRow>
    </PagePanel>
  )
}

class BasicTable extends React.Component {

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

const FileExplorerPanel = () => {
  return (
    <ContentPanel title="Project explorer">
      <FileExplorer></FileExplorer>
    </ContentPanel>
  )
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
      // language: 'C',
      interestIndicatorsSummary: {},
      interestIndicators: {},
      interestLineChart: {},
      principalLineChart: {},
      breakingPointLineChart: {},
      cumulativeInterestLineChart: [],
      radarChartvalues: {},
      radarChartLabels: {},
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
      allFileMetricsAndInterest: []
    }
  }

  // Update project
  updateProjectData = (projectName) => {

    let projectTitle = "Dummy Project Title";
    // This should be change in integration
    // let lag = 'c';

    let storedProject = sessionStorage.getItem('selected_project');
    let storedProjectJson = JSON.parse(storedProject);

    projectTitle = storedProjectJson.name;

    // Fetch TD info from session storage
    // if (storedProjectJson['technicaldebt'] !== '') {
    //   let tdInfo = JSON.parse(storedProjectJson['technicaldebt']);
    //   if ('language' in tdInfo) {
    //     lag = tdInfo['language']
    //   }
    // }

    // lag = lag.toLowerCase();

    this.setState({
      isLoading: true,
      name: projectTitle,
      // language: lag
    });

    let url = "";
    let urlPrefix = TD_TOOLBOX_ENDPOINT + "api/analysis/"

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

    url = urlPrefix + "projectReusabilityMetrics?url=" + projectName.toString();
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => {
        let data = result;
        this.setState({
          isLoading: false,
          projectReusabillityMetrics: data,
        })
      })
      .catch(error => console.log('error', error));

    // ---------------------------------------------------------------------------------------------------------- //

    url = urlPrefix + "fileReusabilityMetrics?url=" + projectName.toString();
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => {
        let data = result;
        this.setState({
          isLoading: false,
          fileReusabillityMetrics: data,
        })
      })
      .catch(error => console.log('error', error));

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

    url = urlPrefix + "normalizedInterest?url=" + projectName.toString();
    fetch(url, requestOptions)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          normalizedInterest: resp,
        })
      })
      .catch(error => console.log('error', error));

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

    url = urlPrefix + "highInterestFiles?url=" + projectName.toString();
    fetch(url, requestOptions)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          highInterestFiles: resp,
        })
      })
      .catch(error => console.log('error', error));

    // ---------------------------------------------------------------------------------------------------------- //

    url = urlPrefix + "fileInterestChange?url=" + projectName.toString();
    fetch(url, requestOptions)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          fileInterestChange: resp,
        })
      })
      .catch(error => console.log('error', error));

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

    urlPrefix = TD_TOOLBOX_ENDPOINT + "api/project/"
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
      radarChartLabels,
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
      analyzedCommits,
      allFileMetricsAndInterest,
      projectState
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
            myinterestLineChart={interestLineChart}
            myprincipalLineChart={principalLineChart}
            mybreakingpointLineChart={breakingPointLineChart}
            mycumulativeInterestLineChart={cumulativeInterestLineChart}
            myAllFileMetricsAndInterest={allFileMetricsAndInterest}
            radarChartVal={radarChartvalues}
            interestProbabilityRank={interestProbabilityRank}
            interestRank={interestRank}
            principal={principalIndicatorsSummary}
            principalArtifacts={principalIndicators}
            radarChartLab={radarChartLabels}
          />

          <AllFileMetricsAndInterestPanel
            myAnalyzedCommits={analyzedCommits}
            myAllFileMetricsAndInterest={allFileMetricsAndInterest}
          />

          <InterestPerCommitPanel
            myInterestPerCommit={interestPerCommit}
          />

          <HighInterestFilesPanel
            myHighInterestFiles={highInterestFiles}
          />

          <CumulativeInterestPanel
            mycumulativeInterestLineChart={cumulativeInterestLineChart}
          />

          <ProjectReusabillityMetricsPanel
            myProjectReusabillityMetrics={projectReusabillityMetrics}
          />

          <FileReusabillityMetricsPanel
            myFileReusabillityMetrics={fileReusabillityMetrics}
          />

          <NormalizedInterestPanel
            myNormalizedInterest={normalizedInterest}
          />

          <FileInterestChangePanel
            myFileInterestChange={fileInterestChange}
          />

          <AnalyzedCommitsPanel
            myAnalyzedCommits={analyzedCommits}
          />

          <InterestChangePanel
            myAnalyzedCommits={analyzedCommits}
            myprojectName={name}
          />

        </React.Fragment>
      )
    }
  }

}

export default TDAnalysisDashPage;
