import React from 'react';
import {PagePanel} from './sections/PagePanel';
import { MDBCol, MDBRow} from "mdbreact";
import {ProgressCard, CountCard, ScoreCard} from './sections/StatusCards'
import PlotlyChart from './sections/Chart';
import PropTypes from 'prop-types'
import 'whatwg-fetch';
import { Line, Radar } from 'react-chartjs-2';
import Loader from './sections/Loading'
import FileExplorer from './sections/FileExplorer';
import ContentPanel from './sections/ContentPanel';
import { MDBCard, MDBCardBody, MDBDataTable, MDBCardHeader, MDBContainer, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBFormInline, MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';

//============== Import Highcharts ==============//
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// This the value we multiple td in minutes to get td in currency, is the hour wage of software engineering
const wage = 40
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

const PrincipalPanel = props => {

  function normalize(min, max)
  {
    var delta = max - min;
    return function (val) {
      return (val - min) / delta;
    };
  }

  var numbers = [parseFloat(props.principal.bugs), parseFloat(props.principal.bugs), parseFloat(props.principal.vulnerabilities), parseFloat(props.principal.duplCode), parseFloat(props.principal.codeSmells)];

  console.log(numbers.map(normalize(Math.min(...numbers), Math.max(...numbers))));

  numbers = numbers.map(normalize(Math.min(...numbers), Math.max(...numbers)))

  const PrincipalRadarPanel =  {
    labels: ['Info', 'Minor	', 'Major	', 'Critical', 'Blocker'],
    datasets: [
      {
        label: 'Severity of Issues',
        backgroundColor: 'rgba(84,130,53,0.05)',
        borderColor: 'rgba(84,130,53,1)',
        pointRadius: 4,
        pointHitRadius: 4,
        pointBackgroundColor: 'rgba(84,130,53,1)',
        pointBorderColor: '#c1c7d1',
        pointHoverBackgroundColor : '#fff',
        pointHoverBorderColor: 'rgba(84,130,53,1)',
        data: numbers
      }
    ]
  }

  return (
    <PagePanel header="Technical debt principal" linkTo="tdprincipal">

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
                <h4 style={{color:'#548235'}}>{props.myprojectName}</h4>
              </MDBFormInline>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>

    <MDBRow className="mb-3">
      <MDBCol size="12">
        <MDBRow className="mb-3">
          <MDBCol>
            <CountCard title="TD IN MINUTES"  value={props.principal.tdInMinutes} icon="clock" />
          </MDBCol>
          <MDBCol>
            <CountCard title="TD IN CURRENCY" color="#33691e light-green darken-4" value={Math.round((props.principal.tdInMinutes/60)*wage)} icon="money-bill-alt"/>
          </MDBCol>
          <MDBCol>
            <CountCard title="BUGS" color="#33691e light-green darken-4" value={props.principal.bugs} icon="bug"/>
          </MDBCol>
          </MDBRow>

          <MDBRow className="mb-3">
            <MDBCol>
              <CountCard title="VULNERABILITIES" color="#33691e light-green darken-4" value={props.principal.vulnerabilities} icon="lock-open"/>
            </MDBCol>
            <MDBCol>
              <CountCard title="CODE SMELLS" color="#33691e light-green darken-4" value={props.principal.codeSmells} icon="compress-arrows-alt"/>
            </MDBCol>
            <MDBCol>
              <CountCard title="DUPLICATIONS" color="#33691e light-green darken-4" value={props.principal.duplCode / 100} icon="copy"/>
          </MDBCol>
        </MDBRow>
      </MDBCol>
    </MDBRow>

    <MDBRow className="mb-3">
      <MDBCol md="12" lg="12" className="mb-12">
        <MDBCard className="mb-12">
          <MDBCardHeader className="sdk4ed-color">Project Severity Issues</MDBCardHeader>
          <MDBCardBody>
          <MDBContainer>
            <Radar data={PrincipalRadarPanel} options={radarChartOptions} />
          </MDBContainer>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>

    <MDBRow className="mb-12">
      <MDBCol md="12" lg="12" className="mb-12">
        <MDBCard className="mb-12">
          <MDBCardHeader className="sdk4ed-color">Artifact Principal Indicators</MDBCardHeader>
          <MDBCardBody>
          <MDBContainer>
            <BasicTable  title="Principal Indicators" data={props.principalArtifacts}/>
          </MDBContainer>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>

    </PagePanel>
  )}

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
          for(var i in data.rows)
          {
              var row = data.rows[i]
              var r = []
              for(var j in data.columns)
              {
                  var field = data.columns[j]['field']
                  r.push(<td key={uniqueId++}>{row[field]}</td>)
              }
              rows.push(<tr key={uniqueId++}>{r} </tr>)
          }
          var header = []
          for(var h in data.columns)
              header.push(<th key={uniqueId++}>{data.columns[h]['label']} </th>)

          return(
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

  // Function to extract values from json
  function returnValues(data) {
    var values = []
    for(var i = 0; i < data.length; i++) {
      values.push(data[i].eval)
    }
    return values
  }

  /**
  * The technical debt dashboard page. The page is assembled using multiple panels.
  * The data is retrieved asynchronously.
  */
  class TDPrincipalDashPage extends React.Component {
    constructor(props){
      super(props);

      this.state = {
        isLoading: false,
        name: '',
        principalIndicatorsSummary: {},
        principalIndicators: {},
      }
    }

    // Update project
    updateProjectData = (projectName) => {
      this.setState({
        isLoading: true,
      });

      if(projectName === 'neurasmus'){
         fetch("http://195.251.210.147:7070/principalSummary/search?projectID=Neurasmus&version=8")
        .then(resp => resp.json())
        .then(resp => {
          this.setState({
            isLoading: true,
            name: resp.principalSummary.name,
            principalIndicatorsSummary: resp.principalSummary,
          })
        })

        fetch("http://195.251.210.147:7070/principalIndicators/search?projectID=Neurasmus&version=8")
        .then(resp => resp.json())
        .then(resp => {
          this.setState({
            isLoading: false,
            principalIndicators: resp.principalIndicators,
          })
        })
      }else if(projectName === 'holisun_arassistance'){

        fetch("http://195.251.210.147:7070/principalSummary/search?projectID=Holisun%20Arassistance&version=4")
        .then(resp => resp.json())
        .then(resp => {
          this.setState({
            isLoading: true,
            name: resp.principalSummary.name,
            principalIndicatorsSummary: resp.principalSummary,
          })
        })

        fetch("http://195.251.210.147:7070/principalIndicators/search?projectID=Holisun%20Arassistance&version=4")
        .then(resp => resp.json())
        .then(resp => {
          this.setState({
            isLoading: false,
            principalIndicators: resp.principalIndicators,
          })
        })
      }else if(projectName === 'airbus'){
        fetch("http://195.251.210.147:7070/principalSummary/search?projectID=Airbus&version=2")
        .then(resp => resp.json())
        .then(resp => {
          this.setState({
            isLoading: true,
            name: resp.principalSummary.name,
            principalIndicatorsSummary: resp.principalSummary,
          })
        })

        fetch("http://195.251.210.147:7070/principalIndicators/search?projectID=Airbus&version=2")
        .then(resp => resp.json())
        .then(resp => {
          this.setState({
            isLoading: false,
            principalIndicators: resp.principalIndicators,
          })
        })
      }
    }

    componentDidMount(){
      fetch("http://195.251.210.147:7070/principalSummary/search?projectID=Holisun%20Arassistance&version=4")
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: true,
          name: resp.principalSummary.name,
          principalIndicatorsSummary: resp.principalSummary,
        })
      })

      fetch("http://195.251.210.147:7070/principalIndicators/search?projectID=Holisun%20Arassistance&version=4")
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          principalIndicators: resp.principalIndicators,
        })
      })
    }

    render(){
      const { isLoading, name, principalIndicatorsSummary, principalIndicators } = this.state


      if(this.isLoading){
        return (<Loader/>)
      }else{
        return(
          <React.Fragment>
          <MDBRow>
          {/*
            <MDBCol size="2">
            <FileExplorerPanel/>
            </MDBCol>*/}
            <MDBCol>
            <PrincipalPanel
            myprojectName = {name}
            updateProjectData={this.updateProjectData}
            principal = {principalIndicatorsSummary}
            principalArtifacts = {principalIndicators}
            />

            </MDBCol>
            </MDBRow>
            </React.Fragment>
          )
        }
      }

    }

    export default TDPrincipalDashPage;
