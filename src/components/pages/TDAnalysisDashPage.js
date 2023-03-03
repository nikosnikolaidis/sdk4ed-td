import { MDBCard, MDBCardBody, MDBCardHeader, MDBCol, MDBDataTable, MDBFormInline, MDBRow } from "mdbreact";
import PropTypes from 'prop-types';
import React from 'react';
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
              {/*
                <MDBDropdown>
                    <MDBDropdownToggle caret className="white-text" color="  light-green darken-4">
                        Select Project
                    </MDBDropdownToggle>
                    <MDBDropdownMenu basic>
                        <MDBDropdownItem onClick={(param) => props.updateProjectData('HolisunArassistance')}>Holisun Arassistance</MDBDropdownItem>
                        <MDBDropdownItem onClick={(param) => props.updateProjectData('Airbus')}>Airbus</MDBDropdownItem>
                        <MDBDropdownItem onClick={(param) => props.updateProjectData('Neurasmus')}>Neurasmus</MDBDropdownItem>
                    </MDBDropdownMenu>

<MDBBtn className="white-text" color=" light-green darken-4" onClick={(param) => props.newAnalysis(props.myprojectName)}><MDBIcon icon="sync-alt" className="mr-1" size="lg"/>New Analysis</MDBBtn>
                </MDBDropdown>
                  	*/}

            </MDBFormInline>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  )
}

const InterestPanel = props => {

  return (
    <PagePanel header="Artifact Interest Indicators" linkTo="tdanalysis">

      <MDBRow className="mb-12">
        <MDBCol md="12" lg="12" className="mb-12">
          <BasicTable title="Interest Indicators" data={props.interestArtifacts} />
        </MDBCol>
      </MDBRow>
    </PagePanel>
  )

}


const PrincipalPanel = props => {

  return (
    <PagePanel header="Artifact Principal Indicators" linkTo="tdanalysis">

      <MDBRow className="mb-12">
        <MDBCol md="12" lg="12" className="mb-12">
          <BasicTable title="Principal Indicators" data={props.principalArtifacts} />
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
      name: 'Principal €',
      data: props.myprincipalLineChart.values,
      pointPlacement: 'on',
      color: "#3AC5E7",
    }, {
      name: 'Breaking Point',
      data: props.mybreakingpointLineChart.values,
      pointPlacement: 'on',
      color: "#278649",
    }, {
      name: 'Cumulative Interest €',
      data: props.mycumulativeInterestLineChart.values,
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

      {/*
   <MDBRow className="mb-4">
            <MDBCol md="12" lg="12" className="mb-12">
                <MDBCard className="mb-12">
                <MDBCardHeader className="sdk4ed-color">Project </MDBCardHeader>
                <MDBCardBody>
                    <MDBFormInline className="md-form m-0">
                        <MDBDropdown>
                            <MDBDropdownToggle caret className="white-text" color="  light-green darken-4">
                                Select Project
                            </MDBDropdownToggle>
                            <MDBDropdownMenu basic>
                                <MDBDropdownItem onClick={(param) => props.updateProjectData('HolisunArassistance')}>Holisun Arassistance</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateProjectData('Airbus')}>Airbus</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateProjectData('Neurasmus')}>Neurasmus</MDBDropdownItem>
                            </MDBDropdownMenu>

<MDBBtn className="white-text" color="  light-green darken-4" onClick={(param) => props.newAnalysis(props.myprojectName)}><MDBIcon icon="sync-alt" className="mr-1" size="lg"/>New Analysis</MDBBtn>

                        </MDBDropdown>
                        <h4 style={{color:'#548235'}}>{props.myprojectName}</h4>
                    </MDBFormInline>
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
      </MDBRow>
*/}
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

      <MDBRow className="mb-3">
        <MDBCol size="12">
          <MDBCardHeader className="sdk4ed-color">Principal Project Summary</MDBCardHeader>
          <MDBRow className="mb-3">
            <MDBCol>
              <CountCard title="TD IN MINUTES" value={props.principal.tdInMinutes} icon="clock" />
            </MDBCol>
            <MDBCol>
              <CountCard title="TD IN CURRENCY (€)" color="#33691e light-green darken-4" value={parseFloat(props.principal.tdInCurrency).toFixed(2)} icon="euro-sign" />
            </MDBCol>
            <MDBCol>
              <CountCard title="BUGS" color="#33691e light-green darken-4" value={props.principal.bugs} icon="bug" />
            </MDBCol>
          </MDBRow>

          <MDBRow className="mb-3">
            <MDBCol>
              <CountCard title="VULNERABILITIES" color="#33691e light-green darken-4" value={props.principal.vulnerabilities} icon="lock-open" />
            </MDBCol>
            <MDBCol>
              <CountCard title="CODE SMELLS" color="#33691e light-green darken-4" value={props.principal.codeSmells} icon="compress-arrows-alt" />
            </MDBCol>
            <MDBCol>
              <CountCard title="DUPLICATIONS " color="#33691e light-green darken-4" value={props.principal.duplCode} icon="copy" />
            </MDBCol>
          </MDBRow>
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
              <CountCard title="TOTAL INTEREST (€)" color="#33691e light-green darken-4" value={parseFloat(props.interest.totalInterest).toFixed(2)} icon="euro-sign" />
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
    data: PropTypes.object,

    /**
     * The title of the table.
     */
    title: PropTypes.string
  }

  render() {
    var data = this.props.data
    var rows = []
    var uniqueId = 0
    for (var i in data.rows) {
      var row = data.rows[i]
      var r = []
      for (var j in data.columns) {
        var field = data.columns[j]['field']
        r.push(<td key={uniqueId++}>{row[field]}</td>)
      }
      rows.push(<tr key={uniqueId++}>{r}</tr>)
    }
    var header = []
    for (var h in data.columns)
      header.push(<th key={uniqueId++}>{data.columns[h]['label']}</th>)

    return (
      <MDBDataTable striped small bordered responsive hover data={data} />
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
      isLoading: false,
      name: 'Neurasmus',
      language: 'C',
      interestIndicatorsSummary: {},
      interestIndicators: {},
      interestLineChart: {},
      principalLineChart: {},
      breakingPointLineChart: {},
      cumulativeInterestLineChart: {},
      radarChartvalues: {},
      radarChartLabels: {},
      interestRank: {},
      interestProbabilityRank: {},
      principalIndicatorsSummary: {},
      principalIndicators: {},
    }
  }


  // Update project
  updateProjectData = (projectName) => {


    // This should be change in integration
    var lag = 'c';

    let storedProject = sessionStorage.getItem('selected_project');
    let storedProjectJson = JSON.parse(storedProject);

    // Fetch TD info from session storage
    if (storedProjectJson['technicaldebt'] !== '') {
      let tdInfo = JSON.parse(storedProjectJson['technicaldebt']);
      if ('language' in tdInfo) {
        lag = tdInfo['language']
      }
    }

    lag = lag.toLowerCase();

    console.log("Project Name: " + projectName)
    console.log("Language: " + lag)

    this.setState({
      isLoading: true,
      myprojectName: projectName,
      language: lag
    });

    // Principal Data
    var url = TD_TOOLBOX_ENDPOINT + "principalSummary/search?projectID=" + projectName
    console.log("test principal api: " + url)

    fetch(url)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          name: resp.principalSummary.name,
          principalIndicatorsSummary: resp.principalSummary,
        })
      })

    url = TD_TOOLBOX_ENDPOINT + "principalIndicators/search?projectID=" + projectName

    fetch(url)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          principalIndicators: resp.principalIndicators,
        })
      })

    // Interest Data
    url = TD_TOOLBOX_ENDPOINT + "interestSummary/search?projectID=" + projectName + "&language=" + lag

    console.log("test interest api: " + url)

    fetch(url)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          interestIndicatorsSummary: resp.interestSummary,
        })
      })

    url = TD_TOOLBOX_ENDPOINT + "interestIndicators/search?projectID=" + projectName + "&language=" + lag
    fetch(url)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          interestIndicators: resp.interestIndicators,
        })
      })

    url = TD_TOOLBOX_ENDPOINT + "lineChartInterestTD/search?projectID=" + projectName + "&language=" + lag
    fetch(url)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          interestLineChart: resp.lineChartInterestTD,
        })
      })

    url = TD_TOOLBOX_ENDPOINT + "lineChartPrincipalTD/search?projectID=" + projectName + "&language=" + lag
    fetch(url)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          principalLineChart: resp.lineChartPrincipalTD,
        })
      })

    url = TD_TOOLBOX_ENDPOINT + "lineChartBreakingPointTD/search?projectID=" + projectName + "&language=" + lag
    fetch(url)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          breakingPointLineChart: resp.lineChartBreakingPointTD,
        })
      })

    url = TD_TOOLBOX_ENDPOINT + "cumulativeInterestLineChart/search?projectID=" + projectName + "&language=" + lag
    fetch(url)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          cumulativeInterestLineChart: resp.cumulativeInterestLineChart,
        })
      })

    url = TD_TOOLBOX_ENDPOINT + "interestRanking/search?projectID=" + projectName + "&language=" + lag
    fetch(url)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          interestRank: resp.interestRank,
        })
      })

    url = TD_TOOLBOX_ENDPOINT + "interestProbabilityRanking/search?projectID=" + projectName + "&language=" + lag
    fetch(url)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          interestProbabilityRank: resp.interestProbabilityRank,
        })
      })
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
      this.updateProjectData(repoName)
    }
  }

  render() {
    const { error, isLoading, name, interestIndicatorsSummary, interestIndicators, interestLineChart, principalLineChart, breakingPointLineChart, cumulativeInterestLineChart, radarChartvalues, radarChartLabels, principalIndicatorsSummary, principalIndicators, interestRank, interestProbabilityRank } = this.state

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
            radarChartVal={radarChartvalues}
            interestProbabilityRank={interestProbabilityRank}
            interestRank={interestRank}
            principal={principalIndicatorsSummary}
            principalArtifacts={principalIndicators}
            radarChartLab={radarChartLabels}
          />

          <InterestPanel
            interestArtifacts={interestIndicators}
          />

          <PrincipalPanel
            principalArtifacts={principalIndicators}
          />

        </React.Fragment>
      )
    }
  }

}

export default TDAnalysisDashPage;
