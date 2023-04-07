import { MDBCard, MDBCardBody, MDBCardHeader, MDBCol, MDBContainer, MDBDataTable, MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle, MDBFormInline, MDBRow } from "mdbreact";
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

// SELECT sum(principal), sum(interest) FROM `analyjed_jar_project_classes` WHERE project_name='Holisun Arassistance' GROUP by version

const TD_TOOLBOX_ENDPOINT = process.env.REACT_APP_TD_TOOL_INTEREST_ENDPOINT // Update inside .env file


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

const InterestPanel = props => {

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
    <PagePanel header="Technical debt interest" linkTo="tdinterest">


      <MDBRow className="mb-4">
        <MDBCol md="12" lg="12" className="mb-12">
          <MDBCard className="mb-12">
            <MDBCardHeader className="sdk4ed-color">Project</MDBCardHeader>
            <MDBCardBody>
              <MDBFormInline className="md-form m-0">
                <MDBDropdown>
                  <MDBDropdownToggle caret className="white-text" color="  light-green darken-4">
                    Project
                  </MDBDropdownToggle>
                  <MDBDropdownMenu basic>
                    <MDBDropdownItem onClick={(param) => props.updateProjectData('holisun_arassistance')}>Holisun Arassistance</MDBDropdownItem>
                    <MDBDropdownItem onClick={(param) => props.updateProjectData('airbus')}>Airbus</MDBDropdownItem>
                    <MDBDropdownItem onClick={(param) => props.updateProjectData('neurasmus')}>Neurasmus</MDBDropdownItem>
                  </MDBDropdownMenu>
                </MDBDropdown>
                <h4 style={{ color: '#548235' }}>{props.myprojectName}</h4>
              </MDBFormInline>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

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
          <MDBRow className="mb-3">
            <MDBCol>
              <CountCard title="BREAKING POINT (version)" color="#33691e light-green darken-4" value={parseFloat(Math.round(props.interest.breakingPoint)).toFixed(2)} icon="hat-wizard" />
            </MDBCol>
            <MDBCol>
              <CountCard title="TOTAL INTEREST (€)" color="#33691e light-green darken-4" value={parseFloat(Math.round(props.interest.totalInterest)).toFixed(2)} icon="euro-sign" />
            </MDBCol>
            <MDBCol>
              <CountCard title="INTEREST PROBABILITY (%)" color="#33691e light-green darken-4" value={parseFloat(props.interest.interestProbability).toFixed(2)} icon="percent" />
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-3">
            <MDBCol>
              <CountCard title="MAINTAINABILITY RANKING (%)" color="#33691e light-green darken-4" value={Math.round(props.interest.maintainabilityRank)} icon="trophy" />
            </MDBCol>
            <MDBCol>
              <CountCard title="INTEREST PROBABILITY RANKING (%)" color="#33691e light-green darken-4" value={Math.round(props.interest.interestProbabilityRank)} icon="trophy" />
            </MDBCol>
          </MDBRow>
        </MDBCol>
      </MDBRow>
      {/*
            <MDBRow className="mb-3">
              <MDBCol md="12" lg="12" className="mb-12">
                <MDBCard className="mb-12">
                  <MDBCardHeader className="sdk4ed-color">Project Interest Indicators</MDBCardHeader>
                  <MDBCardBody>
                  <MDBContainer>
                    <Radar data={InterestRadarPanel}/>
                  </MDBContainer>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
*/}
      <MDBRow className="mb-12">
        <MDBCol md="12" lg="12" className="mb-12">
          <MDBCard className="mb-12">
            <MDBCardHeader className="sdk4ed-color">Artifact Interest Indicators</MDBCardHeader>
            <MDBCardBody>
              <MDBContainer>
                <BasicTable title="Principal Indicators" data={props.interestArtifacts} />
              </MDBContainer>
            </MDBCardBody>
          </MDBCard>
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
class TDInterestDashPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      name: '',
      interestIndicatorsSummary: {},
      interestIndicators: {},
      interestLineChart: {},
      principalLineChart: {},
      breakingPointLineChart: {},
      cumulativeInterestLineChart: {},
      radarChartvalues: {},
      radarChartLabels: {},
    }
  }


  // Update project
  updateProjectData = (projectName) => {
    this.setState({
      isLoading: true,
    });

    if (projectName === 'neurasmus') {
      fetch("http://"+TD_TOOLBOX_ENDPOINT+"/interestSummary/search?projectID=Neurasmus&version=8&language=c")
        .then(resp => resp.json())
        .then(resp => {
          this.setState({
            isLoading: false,
            name: resp.interestSummary.name,
            interestIndicatorsSummary: resp.interestSummary,
          })
        })

      fetch("http://"+TD_TOOLBOX_ENDPOINT+"/interestIndicators/search?projectID=Neurasmus&version=8&language=c")
        .then(resp => resp.json())
        .then(resp => {
          this.setState({
            isLoading: true,
            interestIndicators: resp.interestIndicators,
          })
        })

      fetch("http://"+TD_TOOLBOX_ENDPOINT+"/lineChartInterestTD/search?projectID=Neurasmus&language=c")
        .then(resp => resp.json())
        .then(resp => {
          this.setState({
            isLoading: true,
            interestLineChart: resp.lineChartInterestTD,
          })
        })

      fetch("http://"+TD_TOOLBOX_ENDPOINT+"/lineChartPrincipalTD/search?projectID=Neurasmus&language=c")
        .then(resp => resp.json())
        .then(resp => {
          this.setState({
            isLoading: true,
            principalLineChart: resp.lineChartPrincipalTD,
          })
        })

      fetch("http://"+TD_TOOLBOX_ENDPOINT+"/lineChartBreakingPointTD/search?projectID=Neurasmus&language=c")
        .then(resp => resp.json())
        .then(resp => {
          this.setState({
            isLoading: true,
            breakingPointLineChart: resp.lineChartBreakingPointTD,
          })
        })

      fetch("http://"+TD_TOOLBOX_ENDPOINT+"/cumulativeInterestLineChart/search?projectID=Neurasmus&language=c")
        .then(resp => resp.json())
        .then(resp => {
          this.setState({
            isLoading: false,
            cumulativeInterestLineChart: resp.cumulativeInterestLineChart,
          })
        })
    }
    else if (projectName === 'holisun_arassistance') {
      fetch("http://"+TD_TOOLBOX_ENDPOINT+"/interestSummary/search?projectID=Holisun%20Arassistance&version=4&language=java")
        .then(resp => resp.json())
        .then(resp => {
          this.setState({
            isLoading: false,
            name: resp.interestSummary.name,
            interestIndicatorsSummary: resp.interestSummary,
          })
        })

      fetch("http://"+TD_TOOLBOX_ENDPOINT+"/interestIndicators/search?projectID=Holisun%20Arassistance&version=4&language=java")
        .then(resp => resp.json())
        .then(resp => {
          this.setState({
            isLoading: true,
            interestIndicators: resp.interestIndicators,
          })
        })

      fetch("http://"+TD_TOOLBOX_ENDPOINT+"/lineChartInterestTD/search?projectID=Holisun%20Arassistance&language=java")
        .then(resp => resp.json())
        .then(resp => {
          this.setState({
            isLoading: true,
            interestLineChart: resp.lineChartInterestTD,
          })
        })

      fetch("http://"+TD_TOOLBOX_ENDPOINT+"/lineChartPrincipalTD/search?projectID=Holisun%20Arassistance&language=java")
        .then(resp => resp.json())
        .then(resp => {
          this.setState({
            isLoading: true,
            principalLineChart: resp.lineChartPrincipalTD,
          })
        })

      fetch("http://"+TD_TOOLBOX_ENDPOINT+"/lineChartBreakingPointTD/search?projectID=Holisun%20Arassistance&language=java")
        .then(resp => resp.json())
        .then(resp => {
          this.setState({
            isLoading: true,
            breakingPointLineChart: resp.lineChartBreakingPointTD,
          })
        })

      fetch("http://"+TD_TOOLBOX_ENDPOINT+"/cumulativeInterestLineChart/search?projectID=Holisun%20Arassistance&language=java")
        .then(resp => resp.json())
        .then(resp => {
          this.setState({
            isLoading: false,
            cumulativeInterestLineChart: resp.cumulativeInterestLineChart,
          })
        })
    }
    else if (projectName === 'airbus') {

      fetch("http://"+TD_TOOLBOX_ENDPOINT+"/interestSummary/search?projectID=Airbus&version=2&language=c")
        .then(resp => resp.json())
        .then(resp => {
          this.setState({
            isLoading: false,
            name: resp.interestSummary.name,
            interestIndicatorsSummary: resp.interestSummary,
          })
        })

      fetch("http://"+TD_TOOLBOX_ENDPOINT+"/interestIndicators/search?projectID=Airbus&version=2&language=c")
        .then(resp => resp.json())
        .then(resp => {
          this.setState({
            isLoading: true,
            interestIndicators: resp.interestIndicators,
          })
        })

      fetch("http://"+TD_TOOLBOX_ENDPOINT+"/lineChartInterestTD/search?projectID=Airbus&language=c")
        .then(resp => resp.json())
        .then(resp => {
          this.setState({
            isLoading: true,
            interestLineChart: resp.lineChartInterestTD,
          })
        })

      fetch("http://"+TD_TOOLBOX_ENDPOINT+"/lineChartPrincipalTD/search?projectID=Airbus&language=c")
        .then(resp => resp.json())
        .then(resp => {
          this.setState({
            isLoading: true,
            principalLineChart: resp.lineChartPrincipalTD,
          })
        })

      fetch("http://"+TD_TOOLBOX_ENDPOINT+"/lineChartBreakingPointTD/search?projectID=Airbus&language=c")
        .then(resp => resp.json())
        .then(resp => {
          this.setState({
            isLoading: true,
            breakingPointLineChart: resp.lineChartBreakingPointTD,
          })
        })

      fetch("http://"+TD_TOOLBOX_ENDPOINT+"/cumulativeInterestLineChart/search?projectID=Airbus&language=c")
        .then(resp => resp.json())
        .then(resp => {
          this.setState({
            isLoading: false,
            cumulativeInterestLineChart: resp.cumulativeInterestLineChart,
          })
        })

    }
  }


  componentDidMount() {
    fetch("http://"+TD_TOOLBOX_ENDPOINT+"/interestSummary/search?projectID=Holisun%20Arassistance&version=4&language=java")
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          name: resp.interestSummary.name,
          interestIndicatorsSummary: resp.interestSummary,
        })
      })

    fetch("http://"+TD_TOOLBOX_ENDPOINT+"/interestIndicators/search?projectID=Holisun%20Arassistance&version=4&language=java")
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: true,
          interestIndicators: resp.interestIndicators,
        })
      })

    fetch("http://"+TD_TOOLBOX_ENDPOINT+"/lineChartInterestTD/search?projectID=Holisun%20Arassistance&language=java")
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: true,
          interestLineChart: resp.lineChartInterestTD,
        })
      })

    fetch("http://"+TD_TOOLBOX_ENDPOINT+"/lineChartPrincipalTD/search?projectID=Holisun%20Arassistance&language=java")
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: true,
          principalLineChart: resp.lineChartPrincipalTD,
        })
      })

    fetch("http://"+TD_TOOLBOX_ENDPOINT+"/lineChartBreakingPointTD/search?projectID=Holisun%20Arassistance&language=java")
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: true,
          breakingPointLineChart: resp.lineChartBreakingPointTD,
        })
      })

    fetch("http://"+TD_TOOLBOX_ENDPOINT+"/cumulativeInterestLineChart/search?projectID=Holisun%20Arassistance&language=java")
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          cumulativeInterestLineChart: resp.cumulativeInterestLineChart,
        })
      })
  }

  render() {
    const { isLoading, name, interestIndicatorsSummary, interestIndicators, interestLineChart, principalLineChart, breakingPointLineChart, cumulativeInterestLineChart, radarChartvalues, radarChartLabels } = this.state

    if (this.isLoading) {
      return (<Loader />)
    } else {
      return (
        <React.Fragment>
          <MDBRow>
            {/*
              <MDBCol size="2">
              <FileExplorerPanel/>
              </MDBCol>*/}
            <MDBCol>
              <InterestPanel
                myprojectName={name}
                updateProjectData={this.updateProjectData}
                interest={interestIndicatorsSummary}
                interestArtifacts={interestIndicators}
                myinterestLineChart={interestLineChart}
                myprincipalLineChart={principalLineChart}
                mybreakingpointLineChart={breakingPointLineChart}
                mycumulativeInterestLineChart={cumulativeInterestLineChart}
                radarChartVal={radarChartvalues}
                radarChartLab={radarChartLabels}
              />
            </MDBCol>
          </MDBRow>
        </React.Fragment>
      )
    }
  }

}

export default TDInterestDashPage;
