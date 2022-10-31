import React from 'react';
import {PagePanel} from './sections/PagePanel';
import { MDBCol, MDBRow, MDBCard,MDBCardHeader, MDBCardBody, MDBTable, MDBTableHead, MDBTableBody, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBBtn,MDBIcon} from "mdbreact";
import PropTypes from 'prop-types'
import {ProgressCard, CountCard, ScoreCard} from './sections/StatusCards'
import PlotlyChart from './sections/Chart';
import 'whatwg-fetch';
import Loader from './sections/Loading'

const SERVER_IP = process.env.REACT_APP_DEPENDABILITY_TOOL_SERVER_IP // Update inside .env file
const ENERGY_TOOLBOX_ENDPOINT = process.env.REACT_APP_ENERGY_TOOLBOX_ENDPOINT // Needed to get the EnergyToolbox data

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
                <MDBTable striped small bordered responsive hover maxHeight="31vh">
                    <MDBTableHead><tr>{header}</tr></MDBTableHead>
                    <MDBTableBody>{rows}</MDBTableBody>
                </MDBTable>
        )
    }
}

// const GainOverNumberOfInstructionsPanel = props =>{
//   return (
// 	<PagePanel header="Gain over number of Instructions Between Checkpoints" linkTo="/dependability/gain">
// 	<MDBRow className="mb-3">
// 		<MDBCol size="6">
// 			<PlotlyChart title="Gain over number of Instructions Between Checkpoints" data={props.gain}
//                       layout={{xaxis: {type: 'log', autorange: true}, {yaxis: {type: 'log', autorange: true}, width: 650, margin: {l:40, r:40, t:50, b:50}}} />
//         </MDBCol>
// 		<MDBCol>
// 			<MDBRow className="mb-3">
// 				<MDBCol>
//     		        <ProgressCard title="Maximum Gain" color="blue darken-3" icon="gain" progress={props.calculationSummary.maximumGain}/>
//     		    </MDBCol>
// 				<MDBCol>
//     		        <CountCard title="Number of instructions between checkpoints" color="blue darken-3" icon="cube" value={props.calculationSummary.valueKIndex} description="Instructions"/>
//     		    </MDBCol>
// 			</MDBRow>
// 			<MDBRow className="mb-3">
// 	            <MDBCol className="mb-12">
// 	                <MDBCard className="mb-12">
// 	                <MDBCardHeader>Gain in respect to Number of Instructions</MDBCardHeader>
// 	                <MDBCardBody>
// 	                    <BasicTable title="Gain" data={props.gainTable}/>
// 	                </MDBCardBody>
// 	                </MDBCard>
// 	            </MDBCol>
// 			</MDBRow>
// 		</MDBCol>
// 	</MDBRow>
// 	</PagePanel>
//  )
// }

// const ExecutionTimeOverNumberOfInstructionsPanel = props =>{
//   return (
// 	<PagePanel header="Execution Time over number of Instructions Between Checkpoints" linkTo="/dependability/ExecutionTime">
// 	<MDBRow className="mb-3">
// 		<MDBCol size="6">
// 			<PlotlyChart title="Execution Time over number of Instructions Between Checkpoints" data={props.executionTime}
//                       layout={{xaxis: {type: 'log', autorange: true}, {yaxis: {type: 'log', autorange: true}, width: 650, margin: {l:40, r:40, t:50, b:50}}} />
//         </MDBCol>
// 		<MDBCol>
// 			<MDBRow className="mb-3">
// 					<MDBCol>
//     			        <CountCard title="Minimum Execution Time" color="blue darken-3" icon="clock" value={props.calculationSummary.minimumEcp} description="Unit Time"/>
//     			    </MDBCol>
// 					<MDBCol>
//     			        <CountCard title="Number of instructions between checkpoints" color="blue darken-3" icon="cube" value={props.calculationSummary.valueKIndex} description="Instructions"/>
//     			    </MDBCol>
// 			</MDBRow>
// 			<MDBRow className="mb-3">
// 					<MDBCol className="mb-12">
// 	                <MDBCard className="mb-12">
// 	                <MDBCardHeader>Execution Time in respect to Number of Instructions</MDBCardHeader>
// 	                <MDBCardBody>
// 	                    <BasicTable title="Gain" data={props.executionTimeTable}/>
// 	                </MDBCardBody>
// 	                </MDBCard>
// 	            </MDBCol>
// 			</MDBRow>
// 		</MDBCol>
// 	</MDBRow>
// 	</PagePanel>
//  )
// }

const ExecutionTimeOverNumberOfInstructionsv2Panel = props =>{
  return (
	<PagePanel header="Execution Time over number of loop repetitions Between Checkpoints" linkTo="/optimalcheckpoint">
	<MDBRow className="mb-3">
		<MDBCol size="6">
			<PlotlyChart title="Execution Time over number of loop repetitions Between Checkpoints" data={props.executionTime}
                      layout={{xaxis: {type: 'log', autorange: true}, yaxis: {type: 'log', autorange: true}, width: 650, margin: {l:40, r:40, t:50, b:50}}} />
        </MDBCol>
		<MDBCol>
			<MDBRow className="mb-3">
					<MDBCol>
    			        <CountCard title="Minimum Execution Time" color="blue darken-3" icon="clock" value={props.calculationSummary.nStarValue} description="Time Unit"/>
    			    </MDBCol>
					<MDBCol>
    			        <CountCard title="Number of loop repetitions Between Checkpoints" color="blue darken-3" icon="cube" value={props.calculationSummary.nStarIndex} description="Loop repetitions"/>
    			    </MDBCol>
			</MDBRow>
			<MDBRow className="mb-3">
					<MDBCol className="mb-12">
	                <MDBCard className="mb-12">
	                <MDBCardHeader>Execution Time in respect to number of loop repetitions Between Checkpoints</MDBCardHeader>
	                <MDBCardBody>
	                    <BasicTable title="Gain" data={props.executionTimeTable}/>
	                </MDBCardBody>
	                </MDBCard>
	            </MDBCol>
			</MDBRow>
		</MDBCol>
	</MDBRow>
	</PagePanel>
 )
}

const EnergyConsumptionOverNumberOfInstructionsPanel = props =>{
  return (
	<PagePanel header="Energy Consumption over number of loop repetitions Between Checkpoints" linkTo="/optimalcheckpoint">
	<MDBRow className="mb-3">
		<MDBCol size="6">
			<PlotlyChart title="Energy Consumption over number of loop repetitions Between Checkpoints" data={props.energyConsumption}
                      layout={{xaxis: {type: 'log', autorange: true}, yaxis: {type: 'log', autorange: true}, width: 650, margin: {l:40, r:40, t:50, b:50}}} />
        </MDBCol>
		<MDBCol>
			<MDBRow className="mb-3">
					<MDBCol>
    			        <CountCard title="Minimum Energy Consumption" color="blue darken-3" icon="clock" value={props.calculationSummary.nPlusValue} description="Energy Unit"/>
    			    </MDBCol>
					<MDBCol>
    			        <CountCard title="Number of loop repetitions between checkpoints" color="blue darken-3" icon="cube" value={props.calculationSummary.nPlusIndex} description="Loop repetitions"/>
    			    </MDBCol>
			</MDBRow>
			<MDBRow className="mb-3">
					<MDBCol className="mb-12">
	                <MDBCard className="mb-12">
	                <MDBCardHeader>Energy Consumption in respect to number of loop repetitions</MDBCardHeader>
	                <MDBCardBody>
	                    <BasicTable title="Energy" data={props.energyConsumptionTable}/>
	                </MDBCardBody>
	                </MDBCard>
	            </MDBCol>
			</MDBRow>
		</MDBCol>
	</MDBRow>
	</PagePanel>
 )
}

const ProjectPanel = props => {

    return (
        <MDBRow className="mb-4">
            <MDBCol md="12" lg="12" className="mb-12">
                <MDBCard className="mb-12">
                <MDBCardBody>
                    <MDBRow>
                        <MDBCol>
                            <h3 style={{color:'#548235'}}>Project: <span style={{color:'#000000'}}>{props.myprojectName}</span></h3>
                        </MDBCol>
                        <MDBCol>
                            <MDBDropdown>
                                <MDBDropdownToggle caret className="white-text" color="  light-green darken-4">
                                    Select Project
                                </MDBDropdownToggle>
                                <MDBDropdownMenu basic>
                                    <MDBDropdownItem onClick={(param) => props.updateSelectedProject('Holisun')}>Holisun</MDBDropdownItem>
                                    <MDBDropdownItem onClick={(param) => props.updateSelectedProject('Neurasmus')}>Neurasmus</MDBDropdownItem>
                                    <MDBDropdownItem onClick={(param) => props.updateSelectedProject('Airbus')}>Airbus</MDBDropdownItem>
                                </MDBDropdownMenu>
								<MDBBtn className="white-text" color="  light-green darken-4" onClick={(param) => props.updateProjectData(props.myprojectName)}><MDBIcon icon="sync-alt" className="mr-1" size="lg"/>Compute Checkpoint Interval</MDBBtn>
                            </MDBDropdown>
                        </MDBCol>
                    </MDBRow>
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </MDBRow>
    )
}

const ProjectNamePanel = props => {
    return (
      <MDBRow className="mb-4">
          <MDBCol md="12" lg="12" className="mb-12">
              <MDBCard className="mb-12">
              <MDBCardBody>
                  <MDBRow>
                      <MDBCol>
                          <h3 style={{color:'#548235'}}>Project: <span style={{color:'#000000'}}>{props.myProjectName}</span></h3>
                      </MDBCol>
                      <MDBCol>
                          	<MDBBtn className="white-text" color="  light-green darken-4" onClick={(param) => props.updateProjectData(props.myProjectName)}><MDBIcon icon="sync-alt" className="mr-1" size="lg"/>Compute Checkpoint Interval</MDBBtn>
                      </MDBCol>
                  </MDBRow>
              </MDBCardBody>
              </MDBCard>
          </MDBCol>
      </MDBRow>
    )
}

const ErrorPanel = props => {
    return (
      <MDBRow className="mb-4">
          <MDBCol md="12" lg="12" className="mb-12">
              <MDBCard className="mb-12">
              <MDBCardBody>
                  <MDBRow>
                    <MDBCol>
                    </MDBCol>
                      <MDBCol>
                          <h3 align='center' style={{color:'#548235'} }>Error: <span style={{color:'#000000'}}>{props.errorMessage}</span> </h3>
                      </MDBCol>
                      <MDBCol>
                      </MDBCol>
                  </MDBRow>
              </MDBCardBody>
              </MDBCard>
          </MDBCol>
      </MDBRow>
    )
}

const LastAnalysisPanel = props => {
    return (
      <MDBRow className="mb-4">
          <MDBCol md="12" lg="12" className="mb-12">
              <MDBCard className="mb-12">
              <MDBCardBody>
                  <MDBRow>
                    <MDBCol>
                    </MDBCol>
                      <MDBCol>
                          <h3 align='center' style={{color:'#548235'} }>Last Analysis: <span style={{color:'#000000'}}>{props.lastAnalysis}</span> </h3>
                      </MDBCol>
                      <MDBCol>
                      </MDBCol>
                  </MDBRow>
              </MDBCardBody>
              </MDBCard>
          </MDBCol>
      </MDBRow>
    )
}


class OptimalCheckpointPage extends React.Component {

  constructor(props){
    super(props);

    this.Holisun = {}
    this.Holisun.ProgramType = 'OptimalCheckpoints'
    this.Holisun.g = '0.000005'
    this.Holisun.B0e = '500.0'
    this.Holisun.B0c = '100000.0'
    this.Holisun.L = '100.0'
    this.Holisun.ce = '0.00001'
    this.Holisun.cc = '1.0'
    this.Holisun.b0c = '100.0'
    this.Holisun.b1c = '10.0'
    this.Holisun.b0e = '100.0'
    this.Holisun.b1e = '10.0'
    this.Holisun.N = '10000.0'
    this.Holisun.alfa = '0.0'
    this.Holisun.beta = '1.0'
    this.Holisun.B1e = '0.0'
    this.Holisun.B1c = '0.0'
    this.Holisun.Y = '1.0'

    this.Neurasmus = {}
    this.Neurasmus.ProgramType = 'OptimalCheckpoints'
    this.Neurasmus.g = '0.000005'
    this.Neurasmus.B0e = '0.00000059'
    this.Neurasmus.B0c = '0.00000347'
    this.Neurasmus.L = '2826.0'
    this.Neurasmus.ce = '0.000000000445'
    this.Neurasmus.cc = '0.000000000074231'
    this.Neurasmus.b0c = '0.000000077'
    this.Neurasmus.b1c = '0.0000000007'     //theoreticall value
    this.Neurasmus.b0e = '0.000000367'
    this.Neurasmus.b1e = '0.00000000367'    //theoreticall value
    this.Neurasmus.N = '200.0'
    this.Neurasmus.alfa = '0.0'
    this.Neurasmus.beta = '1.0'
    this.Neurasmus.B1e = '0.0'
    this.Neurasmus.B1c = '0.0'
    this.Neurasmus.Y = '19782.0'

    this.Airbus = {}
    this.Airbus.ProgramType = 'OptimalCheckpoints'
    this.Airbus.g = '0.000005'
    this.Airbus.B0e = '0.00000059'
    this.Airbus.B0c = '0.00000347'
    this.Airbus.L = '2826.0'
    this.Airbus.ce = '0.000000000445'
    this.Airbus.cc = '0.000000000074231'
    this.Airbus.b0c = '0.000000077'
    this.Airbus.b1c = '0.0000000007'
    this.Airbus.b0e = '0.000000367'
    this.Airbus.b1e = '0.00000000367'
    this.Airbus.N = '200.0'
    this.Airbus.alfa = '0.0'
    this.Airbus.beta = '1.0'
    this.Airbus.B1e = '0.0'
    this.Airbus.B1c = '0.0'
    this.Airbus.Y = '19782.0'


    this.state = {
	  isError: false,
	  selectedProject: null,
	  isProjectVisible: false,
	  isLoadingProject: false,
	  gainOverNumberOfInstructions: null,
	  executionTimeOverNumberOfInstructions: null,
	  calculationSummary: null,
	  gainTable: null,
	  executionTimeTable: null,
	  energyConsumptionOverNumberOfInstructions: null,
	  energyConsumptionTable: null,
    }
  }


  getHotspots(){
    let parameter_B1c;
    let parameter_B1e;
    let energy_fetch_link_hotspots = `${ENERGY_TOOLBOX_ENDPOINT}/analysis?new=${this.state.energy_new_analysis}&user=${this.state.user_name}&token=${this.state.energy_github_token}&url=${this.state.energy_github_url}&commit=${this.state.energy_commit}&type=hotspots`;
    fetch(energy_fetch_link_hotspots, {method: "GET", mode: 'cors'})
      .then(resp => resp.json())
        .then(resp => {
          let hotspotsLoop = resp.topHotspotsLoop.rows['1']
          console.log(hotspotsLoop['checkpoint_time'])
          parameter_B1c = hotspotsLoop['checkpoint_time']
          parameter_B1e = hotspotsLoop['checkpoint_energy']
          this.setState(prevState => ({
            topHotspotsLoopB1c: parameter_B1c,
            topHotspotsLoopB1e: parameter_B1e,
          }))
              var myString = "Go to getData";
              this.getData(myString);
          })
  }

  getData(requestJSON){
	//return fetch("http://160.40.52.130:8082/DependabilityToolbox/OptimalCheckpoint",{
    //return fetch("http://localhost:8080/DependabilityTollbox/OptimalCheckpoint",{    

  let energy_fetch_link = `${ENERGY_TOOLBOX_ENDPOINT}/analysis?new=${this.state.energy_new_analysis}&user=${this.state.user_name}&token=${this.state.energy_github_token}&url=${this.state.energy_github_url}&commit=${this.state.energy_commit}&type=${this.state.energy_run_type}`;
  fetch(energy_fetch_link, {method: "GET", mode: 'cors'})
    .then(resp => resp.json())
      .then(resp => {
        this.setState(prevState => ({
          topStaticsLoop: resp.topStaticsLoop
        }), function() {
            let topLoop = null;
            try {
              topLoop = this.state.topStaticsLoop.topStaticsLoop1
            } catch(e)  {
              if (this.state.project_name != "Holisun"){
                this.setState({ 
                      error: {message: 'Parameters from Energy Toolbox could not be obtained'}, 
                      errorMessage:'Parameters from Energy Toolbox could not be obtained',
                      isLoadingProject: false,
                      isError: true
                    })
                return;
              }
            }
            let parameter_cc;
            let parameter_ce;
            let requestBody; 
            let parameter_L_Number;
            let parameter_L = ""
            // change
            let parameter_B1e;
            let parameter_B1c;

            if (this.state.project_name != "Holisun") {
              let energy_rows = topLoop.rows
              let energy_row = energy_rows['1']
              
              try {
                parameter_L_Number = parseInt(energy_row['end line'],10) - parseInt(energy_row['start line'],10);
                parameter_L = parameter_L_Number.toString() + ".0"
              } catch(e) {
                parameter_L = "1"
              }

              parameter_cc = energy_row['time prediction']
              parameter_ce = energy_row['energy prediction']
              try {
                parameter_B1c = this.state.topHotspotsLoopB1c;
                parameter_B1e = this.state.topHotspotsLoopB1e;
                parameter_B1c = parameter_B1c / parameter_L_Number;
                parameter_B1e = parameter_B1e / parameter_L_Number;
                parameter_B1c = parameter_B1c.toString();
                parameter_B1e = parameter_B1e.toString();  
              } catch(e) {
                parameter_B1c = this.state.topHotspotsLoopB1c;
                parameter_B1e = this.state.topHotspotsLoopB1e;
              }

              console.log(parameter_B1c)
              console.log(parameter_B1e)


            } else {
              parameter_cc = "0.000002"
              parameter_ce = "0.000001"
              parameter_L = "20"
            }

            requestBody = ""
            this.setState(prevState => ({
              optimalCheckpointInfo: {
              ...prevState.optimalCheckpointInfo,
              L: parameter_L,
              cc: parameter_cc,
              ce: parameter_ce,
              B1c: parameter_B1c,
              B1e: parameter_B1e,
              alfa: "1.0",
              beta: "1.0",
              username: prevState.user_name,
              project_name: prevState.project_name,
              ProgramType: "OptimalCheckpoints"
              }          
            }), function() {
              requestBody = JSON.stringify(this.state.optimalCheckpointInfo)

              return fetch(SERVER_IP+"/DependabilityToolbox/OptimalCheckpoint",{
                method: "POST",
                mode: 'cors', // no-cors, cors, *same-origin
                body: requestBody
              })
              .then(resp => {
                // console.log(resp)
                return resp.json()
              })
              .then (data => {
                // console.log(data)
                if (data.Error){
                  console.log("Error")
                  // console.log(this.state.isError)
                  // console.log(this.state.errorMessage)
                  this.setState({isError : true,
                    errorMessage : data.Error})
                } else {
                  // console.log("No Error")
                  this.setState({
                    calculationSummary: data.calculationSummary,
                    executionTimeTable: data.executionTimeTable,
                    executionTimeOverNumberOfInstructions: data.executionTimeOverNumberOfInstructions,
                    energyConsumptionTable: data.energyConsumptionTable,
                    energyConsumptionOverNumberOfInstructions: data.energyConsumptionOverNumberOfInstructions,
                    lastAnalysis: data.timestamp,
                    isProjectVisible: true
                })
                this.setState({isLoadingProject : false})
                }
                this.setState({
                  isLoadingProject: false
                })
              })
              .catch(error => {
                this.setState({ 
                    error: {message: 'Problem with DependabilityToolbox connection'}, 
                    errorMessage:'Problem with DependabilityToolbox connection',
                    isLoadingProject: false,
                    isError: true
                  })
              })

            })

              


        })
      })
      .catch(error => {
        this.setState({ 
                    error: {message: 'hotstatic analysis from Energy Toolbox could not be obtained'}, 
                    errorMessage:'hotstatic analysis from Energy Toolbox could not be obtained',
                    isLoadingProject: false,
                    isError: true
                  })
      })
  }


  updateSelectedProject = (projectName) => {
    this.setState(prevState => ({
        selectedProject: projectName,
        isProjectVisible: false,
        isError:false,
        isLoadingProject:true,
        optimalCheckpointInfo: {
          ...prevState.optimalCheckpointInfo,
          history_data: '1.0'
        }
    }));
    var myString = "Go to getData";
    this.getData(myString);
  }




  updateProjectData = (projectName) => {
      if (projectName){
	  this.setState(prevState => ({
    		isLoadingProject: true,
        isError: false,
        optimalCheckpointInfo: {
          ...prevState.optimalCheckpointInfo,
          history_data: '0.0'
        }
	  }));

    
    this.getHotspots()
    }   
  }

  componentDidMount(){
    // console.log("componentDidMount")
    // var selectedProjectSession = 'Neurasmus'
    // this.updateSelectedProject(selectedProjectSession)
    if (sessionStorage.getItem('selected_project') === null){
      this.setState({ 
        error: {message: 'No project selected. Please select a project from the "Projects" panel and retry.'}, 
        errorMessage:'No project selected. Please select a project from the "Projects" panel and retry.',
        isLoadingProject: false,
        isError: true
      })
    } else {
        //if (sessionStorage.getItem('user_name')===null){
          //this.setState({ error: {message: 'User is not specified, contact administrator of the webpage.'}  })
          //} else {
              try {
                var selectedProjectSession = JSON.parse(sessionStorage.getItem('selected_project'))
              } catch(e) {
                this.setState({ 
                    error: {message: 'Problem with project selection.'}, 
                    errorMessage:'Problem with project selection.',
                    isLoadingProject: false,
                    isError: true
                  })
                return
              }
                this.setState({
                  energy_github_url: selectedProjectSession['endpoint'],
                  user_name: selectedProjectSession['username'],
                  energy_github_token: selectedProjectSession['password'],
                  energy_new_analysis: '',
                  energy_run_type: 'full',
                  project_name: selectedProjectSession['name'],
                  optimalCheckpointInfo: ''
                })
                let energy_commit_temp = "" 
                try {
                  energy_commit_temp = JSON.parse(selectedProjectSession['energy']).commit
                } catch(e) {
                  energy_commit_temp = ""
                }
                this.setState(prevState => ({
                    energy_commit: energy_commit_temp
                  }))
              
              if (selectedProjectSession['dependability'] !== '') {
                let dependabilityInfo = ""
                try {
                  dependabilityInfo = JSON.parse(selectedProjectSession['dependability']);
                } catch (e) {
                  this.setState({ 
                    error: {message: 'Problem with project selection.'}, 
                    errorMessage:'Problem with project selection.',
                    isLoadingProject: false,
                    isError: true
                  })
                  return
                }
                if('optimal_checkpoint' in dependabilityInfo) {
                  this.setState(prevState => ({
                    optimalCheckpointInfo: dependabilityInfo['optimal_checkpoint']
                  }), function() {
                      this.updateSelectedProject(selectedProjectSession['name'])
                  })
                } else {
                  this.setState({ 
                    error: {message: 'Check the "projects" page for possible errors.'}, 
                    errorMessage:'Check the "projects" page for possible errors.',
                    isLoadingProject: false,
                    isError: true
                  })
                }
              } else {
                this.setState({ 
                    error: {message: 'Check the "projects" page for possible errors.'}, 
                    errorMessage:'Check the "projects" page for possible errors.',
                    isLoadingProject: false,
                    isError: true
                  })
              }
            //}
        }
  }

  render(){
	const {error, isError,errorMessage,isLoadingProject,isProjectVisible,selectedProject,calculationSummary} = this.state

  if (isError) {
      return (
        <React.Fragment>
        <ProjectNamePanel
              myProjectName={selectedProject}
              updateProjectData={this.updateProjectData}
          />
          <div class="alert alert-danger" role="alert">
              {errorMessage}
          </div>
          </React.Fragment>
      )
  }

  // if (isError){
  //   return (<React.Fragment>
  //     <ProjectNamePanel
  //           myProjectName={selectedProject}
  //       />
  //             <ErrorPanel
  //                 errorMessage = errorMessage
  //             />
  //           </React.Fragment>)
  // }

	if(isLoadingProject){
		return (<React.Fragment>
      <ProjectNamePanel
            myProjectName={selectedProject}
            updateProjectData={this.updateProjectData}
        />
      <Loader/>
      </React.Fragment>)
	}

	if(!isProjectVisible) {
		return (
      <React.Fragment>
      <ProjectNamePanel
            myProjectName={selectedProject}
            updateProjectData={this.updateProjectData}
        />
      <Loader/>
      </React.Fragment>)
	}

  if(selectedProject) {
    return(
      <React.Fragment>
        <ProjectNamePanel
              myProjectName={selectedProject}
              updateProjectData={this.updateProjectData}
          />
        <LastAnalysisPanel
              lastAnalysis={this.state.lastAnalysis}
        />
  <ExecutionTimeOverNumberOfInstructionsv2Panel
  executionTime={this.state.executionTimeOverNumberOfInstructions}
    calculationSummary={this.state.calculationSummary}
  executionTimeTable={this.state.executionTimeTable}
  />
  <EnergyConsumptionOverNumberOfInstructionsPanel
  energyConsumption={this.state.energyConsumptionOverNumberOfInstructions}
  calculationSummary={this.state. calculationSummary}
  energyConsumptionTable={this.state.energyConsumptionTable}
  />
    </React.Fragment>)
  }

  }

}

export default OptimalCheckpointPage;