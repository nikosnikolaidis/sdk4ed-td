import React from 'react';
import { MDBInput, MDBCol, MDBCard, MDBCardBody, MDBCardHeader, MDBFormInline, MDBRow, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBContainer, MDBDataTable, MDBBtn, MDBIcon, MDBTooltip } from 'mdbreact';
import Loader from './sections/Loading';
//import BasicTable from './sections/Table';
import { Line, Radar } from 'react-chartjs-2';
import PropTypes from 'prop-types'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import heatmap from 'highcharts/modules/heatmap.js';
import treemap from 'highcharts/modules/treemap.js';
import star from "../../assets/star.png";
import star_full from "../../assets/star_full.png";
import { Row, Col} from "reactstrap";

heatmap(Highcharts);
treemap(Highcharts);

const SERVER_IP = process.env.REACT_APP_DEPENDABILITY_EVIT_SERVER_IP // Update inside .env file

// Styling options for Table that @overrides BasicTable - Edit only for styling modifications 
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
			//r.push(<td key={uniqueId++}>{row['field']}</td>)
            rows.push(<tr key={uniqueId++}>{r}</tr>)
        }
        var header = []
        for(var h in data.columns)
            header.push(<th key={uniqueId++}>{data.columns[h]['label']}</th>)

        return(
            <MDBDataTable striped small bordered responsive hover data={data}/>
        )
    }
}

// The Project Panel
const ProjectPanel = props => {
 
    return (
        <MDBRow className="mb-4">
            <MDBCol md="12" lg="12" className="mb-12">
                <MDBCard className="mb-12">
                <MDBCardBody>
                    <MDBFormInline className="md-form m-0">
                        <MDBCol>
                            <h3 align="left" style={{color:'#548235'}}>Project: <span style={{color:'#000000'}}>{props.myprojectName}</span></h3>
                        </MDBCol>
                        {/* 
                        <MDBDropdown>
                            <MDBDropdownToggle caret className="white-text" color="  light-green darken-4">
                                Select Project
                            </MDBDropdownToggle>
                            <MDBDropdownMenu basic>
                                <MDBDropdownItem onClick={(param) => props.updateSelectedProject('Holisun')}>Holisun</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateSelectedProject('Neurasmus')}>Neurasmus</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateSelectedProject('Airbus')}>Airbus</MDBDropdownItem>
                            </MDBDropdownMenu>
                            <MDBBtn className="white-text" color="  light-green darken-4" onClick={(param) => props.updateHardcodedProjectData(props.myprojectName)}><MDBIcon icon="eye" className="mr-1" size="lg"/>Last Analysis</MDBBtn>
                            <MDBBtn className="white-text" color="  light-green darken-4" onClick={(param) => props.updateProjectData(props.myprojectName)}><MDBIcon icon="sync-alt" className="mr-1" size="lg"/>New Analysis</MDBBtn>
                        </MDBDropdown>
                        */}
                        {/*
                        <MDBCol>
                            <h5 align="center" style={{color:'#548235'}}><MDBIcon icon="calendar-check" className="mr-1" size="sm"/>Last Analysis: <span style={{color:'#000000'}}>{props.mylastAnalysis}</span></h5>
                        </MDBCol>
                        */}
                    </MDBFormInline>
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </MDBRow>
    )
}


// The Table Panel
const TablePanel = props => {
    
    // Populate dropdown button
    var dropdownLabels = []
    for(var i = 0; i < props.mySecurityIssues.length; i++) (function(i){
        dropdownLabels.push(<MDBDropdownItem onClick={(param) => props.updateTabledData(props.mySecurityIssues, props.mySecurityIssues[i].propertyName)}>{props.mySecurityIssues[i].propertyName}</MDBDropdownItem>)
    })(i)

    var tableData = {
        columns: [
			{
                'label': 'Validate Prediction',
                'field': 'feedback'
            },
            {
                'label': 'Rule Name',
                'field': 'ruleName',
                'sort': 'asc',
            },
			{
				'label': 'Info',
				'field': 'AsaLink'
			},
            {
                'label': 'RuleSet Name',
                'field': 'ruleSetName'
            },
            {
                'label': 'Package Name',
                'field': 'packageName'
            },
			{
                'label': 'Begin Line',
                'field': 'beginLine'
            },
            {
                'label': 'Class Name',
                'field': 'classPath'
            },
            {
                'label': 'Priority',
                'field': 'priority'
            },
			{
                'label': 'Vulnerability Score',
                'field': 'vulnerability_score'
            },
            {
                'label': 'Criticality',
                'field': 'is_critical'
            },
			{
                'label': 'Criticality Score',
                'field': 'criticality_score'
            }
        ],
        rows: props.mytableData
    }
    
    return (
        <MDBRow className="mb-4">
            <MDBCol md="12" lg="12" className="mb-12">
                <MDBCard>
                    <MDBCardHeader className="sdk4ed-color">                       
					<MDBFormInline className="md-form m-0">	
						<MDBDropdown>
                            <MDBDropdownToggle caret className="white-text" color="  light-green darken-4">
                                {props.mytableSelectedProperty}
                            </MDBDropdownToggle>
                            <MDBDropdownMenu basic>{dropdownLabels}</MDBDropdownMenu>							
						</MDBDropdown>
						<MDBCol>					
							<MDBDropdown>
								<h5 align="right" style={{color:'#548235'}}><MDBBtn className="white-text" color="  light-green darken-4" disabled={props.mydisabledButton} onClick={(param) => props.reseting()}><MDBIcon icon="fas fa-history blue-text" className="mr-1" size="lg"/>Reset</MDBBtn></h5>
							</MDBDropdown>
						</MDBCol>
						<MDBCol>					
							<MDBDropdown>
								<h5 align="right" style={{color:'#548235'}}><MDBBtn className="white-text" color="  light-green darken-4" disabled={props.mydisabledButton} onClick={(param) => props.predicting()}><MDBIcon icon="sync-alt grey-text" className="mr-1" size="lg"/>Re-predict</MDBBtn></h5>
							</MDBDropdown>
						</MDBCol>
						<MDBCol>					
							<MDBDropdown>
								<h5 align="right" style={{color:'#548235'}}><MDBBtn className="white-text" color="  light-green darken-4" disabled={props.mydisabledButton} onClick={(param) => props.retraining()}><MDBIcon icon="sync-alt yellow-text" spin={!props.myanalysisFinished} className="mr-1" size="lg"/>Retrain Model</MDBBtn></h5>
							</MDBDropdown>
						</MDBCol>
						<MDBCol>
							<MDBDropdown>
								<h5 align="right" style={{color:'#548235'}}><MDBBtn className="white-text" color="  light-green darken-4" disabled={props.mydisabledButton} onClick={(param) => props.tableToDB(props.mySecurityIssues)}><MDBIcon icon="fa fa-paper-plane purple-text" spin={!props.myanalysis2Finished} className="mr-1" size="lg"/>Confirm Edit</MDBBtn></h5>
							</MDBDropdown>
						</MDBCol>					
					</MDBFormInline>
					<MDBFormInline className="md-form m-0">
						<MDBCol lg="8" className="pull-right">
								<h5 align="right">{props.myMsg}</h5>
						</MDBCol>
					</MDBFormInline>
                    </MDBCardHeader>
                    <MDBCardBody>
                        <BasicTable data={tableData} /> 
                    </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </MDBRow>
    )
}


class EvitDashPage extends React.Component {
    
    constructor(props){
        super(props);
        
        // Initialize state here. Now hardcoded values are assigned (should be :null otherwise)
        this.state = {
			isLoadingSecurity: false,
			error: null,
			msg: '',
			isProjectVisible: false,
            selectedProject: '',
			selectedUser: '',
            issues: {},
			jsonInput: {},
            projectTableData: {},
            projectTableSelectedProperty: '',
			analysisFinished: true,
			analysis2Finished: true,
			disabledButton: false,
			selectedLanguage: '',
        }
    }
    
    
    // Perform GET call for fetching results from DB
    getDBData(url, project_name, user_name, language) {
        // Default options are marked with *
        return fetch(url+'?project_name='+project_name+'&user_name='+user_name+'&language='+language, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'include', // include, *same-origin, omit
        })
        .then(response => response.json()); // parses JSON response into native JavaScript objects 
    }
	
	getDBDataPredict(url, project_name, user_name, commit_sha, language) {
        // Default options are marked with *
        return fetch(url+'?project_name='+project_name+'&user_name='+user_name+'&commit_sha='+commit_sha+'&language='+language, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'include', // include, *same-origin, omit
        })
        .then(response => response.json()); // parses JSON response into native JavaScript objects 
    }
    
    // Update 'selectedProject' object
    updateSelectedProject = (projectName, userName, language) => {
		//console.log("names:"+projectName + " "+userName)
        this.setState({ 
            selectedProject: projectName,
			selectedUser: userName,
            isProjectVisible: false,
			selectedLanguage: language
        });
    }
    
    
    // Update panel by fetching past analysis data from DB
    updateProjectDataDB = (projectName, userName, language) => {
         this.setState({ 
            isLoadingSecurity: true,
			error: null,
        });
        
        if(projectName === 'Holisun'){
            // Code for fetching json data from DB API
            this.getDBData(SERVER_IP+'/DependabilityToolbox/UpdateEVITTable','holisun_use_case_ar_assistance','',language)
            .then(resp => {
				if (resp.status === 400) {
					console.log(resp.message)
					
					this.setState({
						isLoadingSecurity: false,
						error: resp,
					})
				}else if (resp.status === 500) {
					console.log(resp.message)
					
					this.setState({
						isLoadingSecurity: false,
						error: resp,
					})
				}else if (resp.status === 200) {
					console.log(resp.message)
					
					this.setState({
						msg: resp.message,
						isLoadingSecurity: false,
						error: resp,
					})
				}else if (resp.status === 201){
					console.log("Data received")
					//console.log("Data:"+resp.results.report.name)
					this.setState({
						isLoadingSecurity: false,
						name: resp.results.report.name,
						issues: resp.results.report.issues,	
						jsonInput: resp.results,
					})
					this.updateTabledData(resp.results.report.issues, resp.results.report.issues[0].propertyName)
				}
                
            }).catch(error => this.setState({ error, isLoadingSecurity: false }))
            
        }else if(projectName === 'Neurasmus'){
            // Code for fetching json data from DB API
            this.getDBData(SERVER_IP+'/DependabilityToolbox/UpdateEVITTable','sdk4ed-healthcare-use-case','',language)
            .then(resp => {
				if (resp.status === 400) {
					console.log(resp.message)
					
					this.setState({
						isLoadingSecurity: false,
						error: resp,
					})
				}else if (resp.status === 500) {
					console.log(resp.message)
					
					this.setState({
						isLoadingSecurity: false,
						error: resp,
					})
				}else if (resp.status === 200) {
					console.log(resp.message)
					
					this.setState({
						msg: resp.message,
						isLoadingSecurity: false,
						error: resp,
					})
				}else if (resp.status === 201){
					console.log("Data received")
					
					this.setState({
						isLoadingSecurity: false,
						name: resp.results.report.name,
						issues: resp.results.report.issues,	
						jsonInput: resp.results,
					})
					this.updateTabledData(resp.results.report.issues, resp.results.report.issues[0].propertyName)
				}               
            }).catch(error => this.setState({ error, isLoadingSecurity: false }))
            

        }else if(projectName === 'Airbus'){
            // Code for fetching json data from DB API
            this.getDBData(SERVER_IP+'/DependabilityToolbox/UpdateEVITTable','kameleon-sdk4ed','',language)
            .then(resp => {
				if (resp.status === 400) {
					console.log(resp.message)
					
					this.setState({
						isLoadingSecurity: false,
						error: resp,
					})
				}else if (resp.status === 500) {
					console.log(resp.message)
					
					this.setState({
						isLoadingSecurity: false,
						error: resp,
					})
				}else if (resp.status === 200) {
					console.log(resp.message)
					
					this.setState({
						msg: resp.message,
						isLoadingSecurity: false,
						error: resp,
					})
				}else if (resp.status === 201){
					console.log("Data received")
					
					this.setState({
						isLoadingSecurity: false,
						name: resp.results.report.name,
						issues: resp.results.report.issues,	
						jsonInput: resp.results,
					})
					this.updateTabledData(resp.results.report.issues, resp.results.report.issues[0].propertyName)
				}
            }).catch(error => this.setState({ error, isLoadingSecurity: false }))
            
        }else{
            // Code for fetching json data from DB API
            this.getDBData(SERVER_IP+'/DependabilityToolbox/UpdateEVITTable',projectName,userName,language)
            .then(resp => {
				if (resp.status === 400) {
					console.log(resp.message)
					
					this.setState({
						isLoadingSecurity: false,
						error: resp,
					})
				}else if (resp.status === 500) {
					console.log(resp.message)
					
					this.setState({
						isLoadingSecurity: false,
						error: resp,
					})
				}else if (resp.status === 200) {
					console.log(resp.message)
					
					this.setState({
						msg: resp.message,
						isLoadingSecurity: false,
						error: resp,
					})
				}else if (resp.status === 201){
					console.log("Data received")
					
					this.setState({
						isLoadingSecurity: false,
						name: resp.results.report.name,
						issues: resp.results.report.issues,	
						jsonInput: resp.results,
					})
					this.updateTabledData(resp.results.report.issues, resp.results.report.issues[0].propertyName)
				}
            }).catch(error => this.setState({ error, isLoadingSecurity: false }))
            
        }
    }
    
	
    // Update table 
    updateTabledData = (data, name) => {
		var type = "checkbox"
        var tableData = []
        for(var i = 0; i < data.length; i++) {
            if(data[i].propertyName === name){
                for(var j = 0; j < data[i]['issues'].length; j++) {
					//console.log("lala= "+this.state.issues[i]['issues'][j]['change'])
                    var package_name
					var url0 = "https://cwe.mitre.org/data/definitions/"
					var infoUrl
					if (this.state.selectedLanguage === 'java'){
						infoUrl = data[i]['issues'][j]['externalInfoUrl']
					} else if ((this.state.selectedLanguage === 'cpp') || (this.state.selectedLanguage === 'c')){
						infoUrl = url0 + data[i]['issues'][j]['packageName']+ '.html'
					}
					
					  if(data[i]['issues'][j]['packageName'] != undefined)
                        package_name = data[i]['issues'][j]['packageName'].includes('.') ? data[i]['issues'][j]['packageName'] : '-'
                    tableData.push({
						'feedback': 
									<div>
									  <input type="checkbox" checked={this.state.issues[i]['issues'][j]['change']} id="changing" name="feedback" value={i + "|" + j}
										onChange={this.handleChange}
									  />
									  <label for="changing"> Change Criticality </label>
									</div>,
                        'ruleName': data[i]['issues'][j]['ruleName'],
						'AsaLink': <a href={infoUrl} target="_blank"><i class="fa fa-link"></i></a>,
                        'ruleSetName': data[i]['issues'][j]['ruleSetName'],
                        'packageName': package_name,
						'beginLine': data[i]['issues'][j]['beginLine'],
                        'classPath': data[i]['issues'][j]['classPath'].split('/')[(data[i]['issues'][j]['classPath'].split('/')).length -1],
                        'priority': data[i]['issues'][j]['priority'],
						'vulnerability_score': Number.parseFloat(data[i]['issues'][j]['vulnerability_score']).toFixed(5),
                        'is_critical': data[i]['issues'][j]['is_critical'],
						'criticality_score': Number.parseFloat(data[i]['issues'][j]['criticality_score']).toFixed(5),
                    })
                }
            }
        }
        
        this.setState({
            projectTableData: tableData,
            projectTableSelectedProperty: name,
        })
    }
	
	
	
    //checked={this.state.issues[i]['issues'][j]['change']}
	//get checkbox value
	handleChange = (e) => {
		// to find out if it's checked or not; returns true or false
		const checked = e.target.checked
		const value = e.target.value
		var splitted = value.split("|")
		var propertyNo = splitted[0]
		var issueNo = splitted[1]
		
		var copyIssues = this.state.issues
		copyIssues[propertyNo]['issues'][issueNo]['change'] = checked
		this.setState({issues: copyIssues})
		console.log(("checked= "+this.state.issues[propertyNo]['issues'][issueNo]['change']+"\n"+"propertyNo= "+propertyNo+"\n"+"issueNo= "+issueNo))
		/*this.state.issues[propertyNo]['issues'][issueNo]['change'] = checked
		var c = this.state.issues[propertyNo]['issues'][issueNo]['change']
		console.log("checked= "+c+"\n"+"propertyNo= "+propertyNo+"\n"+"issueNo= "+issueNo)*/
		this.updateTabledData(this.state.issues, this.state.issues[propertyNo].propertyName)
	}
	
	// confirm function: inverse parsing of the table kai post fetch
	tableToDB = (data) => {
		this.setState({
			msg: '',
			analysis2Finished: false,
		})
		for(var i = 0; i < data.length; i++) {
                for(var j = 0; j < data[i]['issues'].length; j++) {
					if (data[i]['issues'][j]['change'] !== true){
						//data[i]['issues'][j]['change'] = false
						data[i]['issues'][j]['newCriticality'] = data[i]['issues'][j]['is_critical']
					}else {
						if (data[i]['issues'][j]['is_critical'] === '0'){
							data[i]['issues'][j]['newCriticality'] = '1'
						}else if (data[i]['issues'][j]['is_critical'] === '1'){
							data[i]['issues'][j]['newCriticality'] = '0'
						}
						
					}
				}
		}
		
		const requestJSON = 
		  {
			project_name: this.state.jsonInput['project_name'],
			username: this.state.jsonInput['username'],
			commit_sha: this.state.jsonInput['commit_sha'],
			issues: data,
		  }
		
		console.log(requestJSON)
		//POST
		var url = SERVER_IP+'/DependabilityToolbox/UpdateDataset'+'?language='+this.state.selectedLanguage
		fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
			body: JSON.stringify(requestJSON)
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'include', // include, *same-origin, omit
        })
		//window.location.reload(false)
		.then(response => response.json())
		.then(response => {
			if (response.status === 200) {
				console.log("response= "+response)
				this.setState({
					msg: response.message,
					analysis2Finished: true,
					})
				this.updateProjectDataDB(this.state.jsonInput['project_name'], this.state.jsonInput['username'], this.state.selectedLanguage)
				//this.updateTabledData(response.report.issues, response.report.issues[0].propertyName)
			}
		})// parses JSON response into native JavaScript objects
		
		
	}
	
	//new Predictions based on retrained model
	predicting = () => {
		var project_name = this.state.jsonInput['project_name']
		var username = this.state.jsonInput['username']
		var commit_sha = this.state.jsonInput['commit_sha']		
		var language = this.state.selectedLanguage
		this.setState({ 
			msg: '',
            isLoadingSecurity: true,
			error: null,
        });
		
		var url = SERVER_IP+'/DependabilityToolbox/EVIT/Repredicting'

		this.getDBDataPredict(url,project_name,username,commit_sha, language)
            .then(resp => {
				if (resp.status === 400) {
					console.log(resp.message)
					
					this.setState({
						isLoadingSecurity: false,
						error: resp,
					})
				}else if (resp.status === 500) {
					console.log(resp.message)
					
					this.setState({
						isLoadingSecurity: false,
						error: resp,
					})
				}else if (resp.status === 201) {
					this.setState({
						msg: resp.message,
						isLoadingSecurity: false,
					})
				}else if (resp.status === 200){					
					this.setState({
						isLoadingSecurity: false,
						name: resp.results.report.name,
						issues: resp.results.report.issues,	
						jsonInput: resp.results,
					})
					this.updateTabledData(resp.results.report.issues, resp.results.report.issues[0].propertyName)
				}
            }).catch(error => this.setState({ error, isLoadingSecurity: false }))
		
		//window.location.reload(false)
	}
	
	// Retraining
	retraining = () => {
		this.setState({
                    analysisFinished: false,
                    disabledButton: true,
                    msg: ''
                })
		var project_name = this.state.jsonInput['project_name']
		var username = this.state.jsonInput['username']
		var commit_sha = this.state.jsonInput['commit_sha']
		var url = SERVER_IP+'/DependabilityToolbox/EVIT/Retrain'
		fetch(url+'?project_name='+project_name+'&user_name='+username+'&commit_sha='+commit_sha+'&language='+this.state.selectedLanguage, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'include', // include, *same-origin, omit
        })
		.then(response => response.json())
		.then(response => {
			if (response.status === 200){
				//console.log(response)
				this.setState({
						analysisFinished: true,
						disabledButton: false,
						msg: response.message
					})
			}
		})// parses JSON response into native JavaScript objects	
		
	}
	
	// Reset
	reseting = () => {
		var project_name = this.state.jsonInput['project_name']
		var username = this.state.jsonInput['username']
		var commit_sha = this.state.jsonInput['commit_sha']

		var url = SERVER_IP+'/DependabilityToolbox/EVITDB'
		fetch(url+'?project_name='+project_name+'&user_name='+username+'&commit_sha='+commit_sha+'&language='+this.state.selectedLanguage, {
            method: 'delete', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'include', // include, *same-origin, omit
        })
		.then(response => response.json())
		.then(response => {
			if (response.status === 200){
			//console.log(response)
				this.setState({msg: response.message})
			}
		})// parses JSON response into native JavaScript objects
		
		this.updateProjectDataDB(project_name, username, this.state.selectedLanguage)
	}
	
    componentDidMount(){
        // Check if session storage contains selected project
        if (sessionStorage.getItem('selected_project') === null){
            this.setState({
                error: {message: 'No project selected. Please select a project from the "Projects" panel and retry.'},
            })
        }else{
            var selectedProjectSession = JSON.parse(sessionStorage.getItem('selected_project'))
            var nameInfo = selectedProjectSession['name']
			var usernameInfo = selectedProjectSession['username']
			var languageInfo = ''
            if(selectedProjectSession['common'] !== ''){
                var commonInfo = JSON.parse(selectedProjectSession['common']);
                if('language' in commonInfo){
                    languageInfo = commonInfo['language']
                }
			}
			//console.log("language= "+languageInfo)
            this.updateSelectedProject(nameInfo, usernameInfo, languageInfo)
            this.updateProjectDataDB(nameInfo, usernameInfo, languageInfo)
        }
    }
    
    render(){
        const { error, msg, isLoadingSecurity, isProjectVisible, selectedProject, selectedUser, name, issues, projectTableData, projectTableSelectedProperty, analysisFinished, analysis2Finished, disabledButton } = this.state
        
        if (error) {
			return (
				<div class="alert alert-danger" role="alert">
					{error.message}
				</div>
			)
        }
    
        if (isLoadingSecurity) {
            return (<Loader/>)
        }
        
        
        
        // Code for rendering the dashboard
        return(
            <React.Fragment>
                <ProjectPanel
                    myprojectName={selectedProject}
                    updateProjectData={this.updateProjectData}
                    updateSelectedProject={this.updateSelectedProject}
                />
                
                <TablePanel
                    mySecurityIssues={issues}
                    mytableData={projectTableData}
                    mytableSelectedProperty={projectTableSelectedProperty}
                    updateTabledData={this.updateTabledData}
					myprojectName={selectedProject}
					myuserName={selectedUser}
					tableToDB={this.tableToDB}
					retraining={this.retraining}
					reseting={this.reseting}
					predicting={this.predicting}
					myanalysisFinished={analysisFinished}
					myanalysis2Finished={analysis2Finished}
					myMsg={msg}
					mydisabledButton={disabledButton}
                />
                

            </React.Fragment>
        )
    }
}

export default EvitDashPage;