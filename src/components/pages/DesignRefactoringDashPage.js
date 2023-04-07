import React from 'react';
import {PagePanel} from './sections/PagePanel';
import { MDBCol, MDBRow} from "mdbreact";
import {ProgressCard, CountCard, ScoreCard} from './sections/StatusCards'
import 'whatwg-fetch';
import PropTypes from 'prop-types';
import Loader from './sections/Loading'
import { MDBCard, MDBCardBody, MDBCardHeader, MDBDataTable, MDBCardTitle, MDBCardText, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBFormInline, MDBTable, MDBTableBody, MDBTableHead, MDBBtn, MDBIcon } from 'mdbreact';
//============== Import Highcharts ==============//
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import heatmap from 'highcharts/modules/heatmap.js';
import treemap from 'highcharts/modules/treemap.js';

//import 'react-tree-graph/dist/style.css'
import {Treebeard} from 'react-treebeard';
import { Alert } from 'reactstrap';

heatmap(Highcharts);
treemap(Highcharts);

const TD_TOOLBOX_ENDPOINT = process.env.REACT_APP_TD_TOOL_INTEREST_ENDPOINT

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
            <h4 style={{color:'#548235'}}>{props.myprojectName}</h4>
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
                </MDBDropdown>   
                */}          
            </MDBFormInline>
        </MDBCardBody>
        </MDBCard>
    </MDBCol>
</MDBRow>
  )
}

class TreeExampleAfter extends React.Component {

  constructor(props)
  {
      super(props);
     console.log("In Constructor " + props.name)
      this.state = {
        isLoading: false,
        moveClassRefactoringsBefore : {},
        moveClassRefactoringsAfter : {},
        coupling_old: 0,
        coupling_new: 0,
        cohesion_old: 0,
        cohesion_new: 0,
        name: props.name,
      };
      this.onToggle = this.onToggle.bind(this); 
  }

  componentDidMount()
  {

    this.setState({
      isLoading: true,
  });

  var projectID = this.state.name
  console.log("ProjectID: " + projectID)
    // Move class refactoring before
  
    var url = TD_TOOLBOX_ENDPOINT + "moveClassRefactorings/search?projectID=" + projectID + "&isNew=0"
  
    fetch(url)
    .then(resp => resp.json())
    .then(resp => {
      this.setState({
        isLoading: false,
        moveClassRefactoringsBefore: resp.moveClassRefactorings,
      })
    })
  
    // Move class refactoring after
  
    var url = TD_TOOLBOX_ENDPOINT + "moveClassRefactorings/search?projectID=" + projectID + "&isNew=1"
    
    fetch(url)
    .then(resp => resp.json())
    .then(resp => {
      console.log(resp.moveClassRefactorings);
      this.setState({
        isLoading: false,
        moveClassRefactoringsAfter: resp.moveClassRefactorings,
      })
    })

    // Move class refactoring project metrics
    var url = TD_TOOLBOX_ENDPOINT + "moveClassRefactoringMetrics/search?projectID=" + projectID
    
    fetch(url)
    .then(resp => resp.json())
    .then(resp => {
      this.setState({
        isLoading: false,
        coupling_old: resp.moveClassProjectMetrics.couplingOld,
        coupling_new: resp.moveClassProjectMetrics.couplingNew,
        cohesion_old: resp.moveClassProjectMetrics.cohesionOld,
        cohesion_new: resp.moveClassProjectMetrics.cohesionNew,
      })
    })


  }

  onToggle(node, toggled){
      const {cursor, moveClassRefactorings} = this.state;
      if (cursor) {
          this.setState(() => ({cursor, active: false}));
      }
      node.active = true;
      if (node.children) { 
          node.toggled = toggled; 
      }
      this.setState(() => ({cursor: node, moveClassRefactorings: Object.assign({}, moveClassRefactorings)}));
  }
  
  render(){
    const {isLoading, moveClassRefactoringsBefore, moveClassRefactoringsAfter, coupling_old, coupling_new, cohesion_old, cohesion_new} = this.state;

    if(isLoading)
    {
      return (<Loader/>)
    }
    else
    {  
      return (
        <MDBRow className="mb-4">
          <MDBCol md="12" lg="12" className="mb-12">
            <MDBCard className="mb-12">
              <MDBCardHeader className="sdk4ed-color">Move Class Refactorings</MDBCardHeader>
              <MDBCardBody>
              <MDBRow className="mb-3">


                <MDBCol>
                <MDBCardHeader className="sdk4ed-color">Before </MDBCardHeader>


                <MDBCard>
                  <MDBCardBody>
                    <MDBCardTitle>Project Metrics</MDBCardTitle>
                    <MDBCardText>
                      Coupling : {coupling_old}
                    </MDBCardText>
                    <MDBCardText>
                      Cohesion : {cohesion_old}
                    </MDBCardText>
                  </MDBCardBody>
                </MDBCard>

                <MDBCard>
                  <MDBCardBody>
                  <MDBCardTitle>Initial Source Code Design</MDBCardTitle>

                  <Treebeard
                    data={moveClassRefactoringsBefore}
                    onToggle={this.onToggle}
                  /> 

                  </MDBCardBody>
                </MDBCard>
                </MDBCol>


                <MDBCol>
                <MDBCardHeader className="sdk4ed-color">After</MDBCardHeader>

                <MDBCard>
                  <MDBCardBody>
                    <MDBCardTitle>Project Metrics</MDBCardTitle>
                    <MDBCardText>
                      Coupling : {coupling_new}
                    </MDBCardText>
                    <MDBCardText>
                      Cohesion : {cohesion_new}
                    </MDBCardText>
                  </MDBCardBody>
                </MDBCard>


                <MDBCard>
                  <MDBCardBody>
                  <MDBCardTitle>Proposed Source Code Design</MDBCardTitle>

                  <Treebeard
                  data={moveClassRefactoringsAfter}
                  onToggle={this.onToggle}
                  /> 

                  </MDBCardBody>
                </MDBCard>

              </MDBCol>
          </MDBRow>
 
                
              </MDBCardBody>
            </MDBCard>
        </MDBCol>
    </MDBRow>
      );
  }
  }
}


const LongMethodTreeMap = props => {

  var LongMethodData = {
      colorAxis: {
          minColor: '#FFFFFF',
          maxColor: 'rgba(84,130,53,1)'
     },
      series: [{
          animation: true,
          type: 'treemap',
          layoutAlgorithm: 'squarified',
          data: props.extractMethodOpportunities
      }],
      title: {
          text: 'Extract Method Opportunities'
      },
      subtitle: {
        text: 'Size of BOX: lines of code, Color Density: Cohesion Benefit'
    },
    legend: {
      enabled: false
     }
  }

  return (
      <MDBRow className="mb-4">
          <MDBCol md="12" lg="12" className="mb-12">
              <MDBCard className="mb-12">
              <MDBCardHeader className="sdk4ed-color">Extract Method Opportunities</MDBCardHeader>
              <MDBCardBody>
                  <HighchartsReact highcharts={Highcharts} options={LongMethodData} immutable = {true} />
              </MDBCardBody>
              </MDBCard>
          </MDBCol>
      </MDBRow>
  )
}


/**
 * The design refactorings dashboard page. The page is assembled using multiple panels.
 * The data is retrieved asynchronously.
 */
class DesignRefactoringDashPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    isLoading: false,
    name: 'Neurasmus',
    extractMethodOpportunities: {},
    language: 'c'
    }
  }


 // Update project
	updateProjectData = (projectName) => {
	
    // This should be change in integration
    var lag = 'c';
    var version = 0;

    let storedProject = sessionStorage.getItem('selected_project');
    let storedProjectJson = JSON.parse(storedProject);

    // Fetch TD info from session storage
    if(storedProjectJson['technicaldebt'] !== '')
    {
        let tdInfo = JSON.parse(storedProjectJson['technicaldebt']);
        if('versionsNum' in tdInfo){
          version = tdInfo['versionsNum']
        }
        if('language' in tdInfo){
          lag = tdInfo['language']
        }      
    }
    
    lag = lag.toLowerCase();

      this.setState({
        isLoading: true,
        myprojectName: projectName,
        name: projectName,
        language: lag
    });

    // Refactor Opportunities
    var url = TD_TOOLBOX_ENDPOINT + "extractMethodOpportunities/search?projectID=" + projectName + "&version=" + version

      fetch(url)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          isLoading: false,
          name: projectName,
          extractMethodOpportunities: resp.opportunities,
        })
      })
	}


  componentDidMount(){

    if (sessionStorage.getItem('selected_project') === null)
    {
      this.setState({
          error: {message: 'No project selected. Please select a project from the "Projects" panel and retry.'},
      })
    }
    else
    {
      var selectedProjectSession = JSON.parse(sessionStorage.getItem('selected_project'))
      var selectedProjectURL = selectedProjectSession['endpoint']
      var repoName = (selectedProjectURL.replace('.git','').split('/'))[selectedProjectURL.split("/").length - 1]
      this.updateProjectData(repoName)
    }

  }

  render(){
        const {error, isLoading, name,  radarChartLabels, extractMethodOpportunities, language} = this.state
        
        if (error) {
          return (
              <div class="alert alert-danger" role="alert">
                  {error.message}
              </div>
          )
      }

    if(isLoading)
    {
      return (<Loader/>)
    }
    else //if (language === 'java')
    {
      console.log("CHECK name to give: " + name)
      return(

          <React.Fragment>
            <ProjectPanel
                    myprojectName = {name}
                    updateProjectData={this.updateProjectData}
                    newAnalysis={this.newAnalysis}
                />

              <LongMethodTreeMap
                  radarChartLab = {radarChartLabels}
                  updateProjectData={this.updateProjectData}
                  extractMethodOpportunities = {extractMethodOpportunities}
              /> 

              <TreeExampleAfter
                name = {name}
              />
              
            </React.Fragment>
            )
    }
  }

}

export default DesignRefactoringDashPage;
