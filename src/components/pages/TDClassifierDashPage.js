import React from 'react';
import { MDBAlert, MDBBtnGroup, MDBInput, MDBCol, MDBDropdownItemMDBCol, MDBCard, MDBCardBody, MDBCardHeader, MDBFormInline, MDBRow, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBContainer, MDBDataTable, MDBBtn, MDBIcon, MDBTooltip } from 'mdbreact';
import Loader from './sections/Loading';
import PropTypes from 'prop-types'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import heatmap from 'highcharts/modules/heatmap.js';
import treemap from 'highcharts/modules/treemap.js';
heatmap(Highcharts);
treemap(Highcharts);

var controller = new AbortController();
var signal = controller.signal;

// const SERVER_IP = process.env.REACT_APP_TD_CLASSIFIER_TOOL_SERVER_IP // Update inside .env file
const SERVER_IP = process.env.REACT_APP_TD_CLASSIFIER_SERVER_IP // Update inside .env file

// Function to pause execution for a fixed amount of milliseconds
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

// Function to extract values from json
function returnValues(data) {
    var values = []
    for(var i = 0; i < data.length; i++) {
        values.push({
            'name': data[i]['class_name'],
            'value': 1,
            'colorValue': data[i]['high_td_proba']
        })
    }
    return values
}

// Function to check if an object is empty
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// The Loading Panel
const LoadingPanel = props => {
    return (
        <MDBRow className="justify-content-md-center">
            <MDBCol md="12" lg="4" className="mb-12">
                <MDBCard className="mb-12">
                    <MDBCardHeader className="sdk4ed-color">Analysis Progress</MDBCardHeader>
                    <MDBCardBody>
                        <MDBRow>
                            <MDBCol>
                                {props.myanalysisMessage}
                            </MDBCol>
                        </MDBRow>
                        <MDBRow>
                            <MDBCol>
                                <hr></hr>
                            </MDBCol>
                        </MDBRow>
                        <MDBCard className="mb-12">
                            <MDBCardBody>
                                <MDBRow>
                                    <MDBCol>
                                        <div align="left" style={{color:'#548235'}}><strong>- Cloning Project</strong>:</div>
                                    </MDBCol>
                                    <MDBCol>
                                        <div align="right"><i class={props.myiconClone}></i> <span align="center" style={{color:'#000000'}}>{props.mystateClone}</span></div>
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol>
                                        <div align="left" style={{color:'#548235'}}><strong>- Collecting data</strong>:</div>
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol>
                                        <div align="left" style={{color:'#548235'}}>&nbsp;&nbsp;- Running CK tool:</div>
                                    </MDBCol>
                                    <MDBCol>
                                        <div align="right"><i class={props.myiconCK}></i> <span align="center" style={{color:'#000000'}}>{props.mystateCK}</span></div>
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol>
                                        <div align="left" style={{color:'#548235'}}>&nbsp;&nbsp;- Running CPD tool:</div>
                                    </MDBCol>
                                    <MDBCol>
                                        <div align="right"><i class={props.myiconCPD}></i> <span align="center" style={{color:'#000000'}}>{props.mystateCPD}</span></div>
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol>
                                        <div align="left" style={{color:'#548235'}}>&nbsp;&nbsp;- Running CLOC tool:</div>
                                    </MDBCol>
                                    <MDBCol>
                                        <div align="right"><i class={props.myiconCLOC}></i> <span align="center" style={{color:'#000000'}}>{props.mystateCLOC}</span></div>
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol>
                                        <div align="left" style={{color:'#548235'}}>&nbsp;&nbsp;- Running PyDriller tool:</div>
                                    </MDBCol>
                                    <MDBCol>
                                        <div align="right"><i class={props.myiconPyDriller}></i> <span align="center" style={{color:'#000000'}}>{props.mystatePyDriller}</span></div>
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol>
                                        <div align="left" style={{color:'#548235'}}><strong>- Running Classifier</strong>:</div>
                                    </MDBCol>
                                    <MDBCol>
                                        <div align="right"><i class={props.myiconClassifier}></i> <span align="center" style={{color:'#000000'}}>{props.mystateClassifier}</span></div>
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow className="justify-content-md-center">
                                    <MDBBtn color="orange" size="sm" onClick={(param) => props.cancelAnalysis()}><MDBIcon icon="times-circle" className="mr-1" size="lg"/>Cancel</MDBBtn>
                                </MDBRow>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </MDBRow>
    )
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
                        <MDBCol>
                            <div align="right">
                                <MDBBtnGroup>
                                    <MDBDropdown dropdown>
                                        <MDBDropdownToggle caret className="white-text px-3" color="  light-green darken-4"/>
                                        <MDBDropdownMenu color="primary">
                                            <MDBDropdownItem header>
                                                Analysis Type <MDBTooltip domElement placement="left">
                                                    <i className="fa fa-info-circle blue-text" aria-hidden="true"></i>
                                                    <div class="text-left" style={{width:600}}>
                                                        The tool supports 3 types of analysis:<br></br> - A Fast analysis will take into account
                                                        classes that were modified during the last 100 commits<br></br> - A Normal analysis will
                                                        take into account classes that were modified during the last 1000 commits<br></br> - A 
                                                        Full analysis will take into account the whole project history. <br></br><br></br>Changing
                                                        the analysis type will affect execution time. In cases when Full analysis is selected and
                                                        a project has a significantly large number of commits (much greater than 1000), the tool 
                                                        may behave in unexpected ways. In cases when a project has less than 100 commits, all commits
                                                        will be considered regardless of the analysis type.
                                                    </div>
                                                </MDBTooltip>
                                            </MDBDropdownItem>
                                            <MDBDropdownItem toggle={false} type="button">
                                                <input type="radio" checked={props.myanalysisType===1 ? true : false} onClick={(param) => props.toggleAnalysisRadio(1)}/> Fast
                                            </MDBDropdownItem>
                                            <MDBDropdownItem toggle={false} type="button">
                                                <input type="radio" checked={props.myanalysisType===2 ? true : false} onClick={(param) => props.toggleAnalysisRadio(2)}/> Normal
                                            </MDBDropdownItem>
                                            <MDBDropdownItem toggle={false} type="button">
                                                <input type="radio" checked={props.myanalysisType===3 ? true : false} onClick={(param) => props.toggleAnalysisRadio(3)}/> Full
                                            </MDBDropdownItem>                            
                                        </MDBDropdownMenu>                       
                                    </MDBDropdown>
                                    
                                    <MDBBtn className="white-text" color="  light-green darken-4" disabled={props.mydisabledButton} onClick={(param) => props.startAnalysis(props.myprojectURL, props.myanalysisType)}><MDBIcon icon="play" className="mr-1" size="lg"/>Run Analysis</MDBBtn>
                                </MDBBtnGroup>
                            </div>
                        </MDBCol>
                    </MDBFormInline>
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </MDBRow>
    )
}

// The Message Panel
const MessagePanel = props => {

    return (
        <MDBAlert color="success" dismiss>
            Analysis finished successfully for {props.myprojectName}. Found <strong>{props.myhighTdClasses}</strong> high-TD classes (out of {props.mytotalClasses}).
        </MDBAlert>
    )
}

// The MessageDB Panel
const MessageDBPanel = props => {

    return (
        <MDBAlert color="warning" dismiss>
            The analysis results for {props.myprojectName} were retrieved from the database and may therefore be outdated. Consider executing the analysis again.
        </MDBAlert>
    )
}

// The Heatmam Panel
const HeatmamPanel = props => {
    
    var heatmapData = {
        colorAxis: {
            minColor: '#FFFFFF',
            maxColor: 'rgba(84,130,53,1)'
        },
        series: [{
            animation: false,
            type: 'treemap',
            layoutAlgorithm: 'squarified',
            data: returnValues(props.myResults),
            tooltip: {
                pointFormat: '<b>Probability Score:</b> {point.colorValue}'
            }
        }],
        title: {
            text: 'Heatmap of High-TD Probability per Class'
        }
    }
    
    if (isEmpty(props.myResults)){return null}

    return (
        <MDBRow className="mb-4">
            <MDBCol md="12" lg="12" className="mb-12">
                <MDBCard className="mb-12">
                <MDBCardHeader className="sdk4ed-color">High-TD Probability Heatmap <MDBTooltip domElement tag="span" placement="top"><i className="fa fa-info-circle" aria-hidden="true"></i><span>A heatmap with the software classes that are likely to have high TD. The greener the color of a rectangle, the higher the probability of the associated class to have high TD.</span></MDBTooltip></MDBCardHeader>
                <MDBCardBody>
                    <HighchartsReact highcharts={Highcharts} options={heatmapData} immutable = {true} />
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </MDBRow>
    )
}

// The Table Panel
const TablePanel = props => {
    
    var tableData = {
        columns: [
            {
                'label': ['Class Name ', <MDBTooltip domElement placement="top"><i className="fa fa-info-circle blue-text" aria-hidden="true"></i><div style={{width:600}}>The name of the class</div></MDBTooltip>],
                'field': 'className',
                'sort': 'asc',
            },
            {
                'label': ['Path ', <MDBTooltip domElement placement="top"><i className="fa fa-info-circle blue-text" aria-hidden="true"></i><div style={{width:600}}>The path of the class</div></MDBTooltip>],
                'field': 'classPath',
                'sort': 'asc',
            },
            {
                'label': ['Probability Score ', <MDBTooltip domElement placement="top"><i className="fa fa-info-circle blue-text" aria-hidden="true"></i><div style={{width:600}}>The probability that the class has high TD</div></MDBTooltip>],
                'field': 'highTDProb',
                'sort': 'asc',
            },
            {
                'label': ['Is High-TD ', <MDBTooltip domElement placement="top"><i className="fa fa-info-circle blue-text" aria-hidden="true"></i><div style={{width:600}}>"0": The class is not likely to have high TD. "1": The class is likely to have high TD</div></MDBTooltip>],
                'field': 'highTD',
                'sort': 'asc',
            },
            {
                'label': ['Commits Count ', <MDBTooltip domElement placement="top"><i className="fa fa-info-circle blue-text" aria-hidden="true"></i><div style={{width:600}}>Total number of commits made to the class in the evolution period</div></MDBTooltip>],
                'field': 'commitsCount',
                'sort': 'asc',
            },
            {
                'label': ['Code Churn Avg ', <MDBTooltip domElement placement="top"><i className="fa fa-info-circle blue-text" aria-hidden="true"></i><div style={{width:600}}>Average size of a code churn of the class in the evolution period</div></MDBTooltip>],
                'field': 'codeChurnAvg',
                'sort': 'asc',
            },
            {
                'label': ['Contributors Count ', <MDBTooltip domElement placement="top"><i className="fa fa-info-circle blue-text" aria-hidden="true"></i><div style={{width:600}}>Total number of contributors who modified the class in the evolution period</div></MDBTooltip>],
                'field': 'contributorsCount',
                'sort': 'asc',
            },
            {
                'label': ['Contributors Experience ', <MDBTooltip domElement placement="top"><i className="fa fa-info-circle blue-text" aria-hidden="true"></i><div style={{width:600}}>Percentage of the lines authored by the highest contributor of the class in the evolution period</div></MDBTooltip>],
                'field': 'contributorsExperience',
                'sort': 'asc',
            },
            {
                'label': ['Hunks Count ', <MDBTooltip domElement placement="top"><i className="fa fa-info-circle blue-text" aria-hidden="true"></i><div style={{width:600}}>Median number of hunks made to the class in the evolution period. A hunk is a continuous block of changes in a diff. This number assesses how fragmented the commit file is (i.e., lots of changes all over the file versus one big change)</div></MDBTooltip>],
                'field': 'hunksCount',
                'sort': 'asc',
            },
            {
                'label': ['CBO ', <MDBTooltip domElement placement="top"><i className="fa fa-info-circle blue-text" aria-hidden="true"></i><div style={{width:600}}>Coupling between objects. This metric counts the number of dependencies the class has</div></MDBTooltip>],
                'field': 'cbo',
                'sort': 'asc',
            },
            {
                'label': ['WMC ', <MDBTooltip domElement placement="top"><i className="fa fa-info-circle blue-text" aria-hidden="true"></i><div style={{width:600}}>Weight Method Class or McCabe’s complexity. This metric counts the number of branch instructions in the class</div></MDBTooltip>],
                'field': 'wmc',
                'sort': 'asc',
            },
            {
                'label': ['DIT ', <MDBTooltip domElement placement="top"><i className="fa fa-info-circle blue-text" aria-hidden="true"></i><div style={{width:600}}>Depth Inheritance Tree. This metric counts the number of "fathers" the class has. All classes have DIT at least 1</div></MDBTooltip>],
                'field': 'dit',
                'sort': 'asc',
            },
            {
                'label': ['RFC ', <MDBTooltip domElement placement="top"><i className="fa fa-info-circle blue-text" aria-hidden="true"></i><div style={{width:600}}>Response for a Class. This metric counts the number of unique method invocations in the class</div></MDBTooltip>],
                'field': 'rfc',
                'sort': 'asc',
            },
            {
                'label': ['LCOM ', <MDBTooltip domElement placement="top"><i className="fa fa-info-circle blue-text" aria-hidden="true"></i><div style={{width:600}}>Lack of Cohesion in Methods. This metric counts the sets of methods in the class that are not related through the sharing of some of the class’s fields</div></MDBTooltip>],
                'field': 'lcom',
                'sort': 'asc',
            },
            {
                'label': ['Max Nested Blocks ', <MDBTooltip domElement placement="top"><i className="fa fa-info-circle blue-text" aria-hidden="true"></i><div style={{width:600}}>Highest number of code blocks nested together in the class</div></MDBTooltip>],
                'field': 'maxNestedBlocks',
                'sort': 'asc',
            },
            {
                'label': ['Total Methods ', <MDBTooltip domElement placement="top"><i className="fa fa-info-circle blue-text" aria-hidden="true"></i><div style={{width:600}}>Total number of methods in the class</div></MDBTooltip>],
                'field': 'totalMethods',
                'sort': 'asc',
            },
            {
                'label': ['Total Variables ', <MDBTooltip domElement placement="top"><i className="fa fa-info-circle blue-text" aria-hidden="true"></i><div style={{width:600}}>Total number of declared variables in the class</div></MDBTooltip>],
                'field': 'totalVariables',
                'sort': 'asc',
            },
            {
                'label': ['Duplicated Lines ', <MDBTooltip domElement placement="top"><i className="fa fa-info-circle blue-text" aria-hidden="true"></i><div style={{width:600}}>Lines in the class involved in duplications. The minimum token length which should be reported as a duplicate is set to 100</div></MDBTooltip>],
                'field': 'duplicatedLines',
                'sort': 'asc',
            },
            {
                'label': ['Comment Lines ', <MDBTooltip domElement placement="top"><i className="fa fa-info-circle blue-text" aria-hidden="true"></i><div style={{width:600}}>Lines in the class containing either comment or commented-out code</div></MDBTooltip>],
                'field': 'commentLines',
                'sort': 'asc',
            },
            {
                'label': ['Code Lines ', <MDBTooltip domElement placement="top"><i className="fa fa-info-circle blue-text" aria-hidden="true"></i><div style={{width:600}}>Total number of lines of code in the class, ignoring empty lines and comments</div></MDBTooltip>],
                'field': 'ncloc',
                'sort': 'asc',
            },
        ],
        rows: props.myTableData
    }
    
    // if (isEmpty(props.myTableData)){return null}
     
    return (
        <MDBRow className="mb-4">
            <MDBCol md="12" lg="12" className="mb-12">
                <MDBCard className="mb-12">
                <MDBCardHeader className="sdk4ed-color">High-TD Classification Results <MDBTooltip domElement tag="span" placement="top"><i className="fa fa-info-circle" aria-hidden="true"></i><span>The detailed results of the TD Classifier service along with the metrics that were used as input. "0": The class is not likely to have high TD. "1": The class is likely to have high TD.</span></MDBTooltip></MDBCardHeader>
                <MDBCardBody>
                    <div className='custom-control custom-switch' align="center">
                        <input
                            type='checkbox'
                            className='custom-control-input'
                            id='customSwitches'
                            checked={props.mytabledisabledButton}
                            onChange={(param) => props.toggleTableSwitch()}
                            readOnly
                        />
                        <label className='custom-control-label' htmlFor='customSwitches'>
                            <strong>Show only high-TD classes</strong>
                        </label>
                    </div>
                    
                    <MDBDataTable style={{whiteSpace: 'nowrap'}} striped bordered responsive data={tableData} /> 
                    
                    <div align="right">
                        <MDBBtn className="white-text" color="  light-green darken-4" href={props.downloadJSONResults(props.myprojectURL)}><MDBIcon icon="download" className="mr-1" size="lg"/>Download JSON</MDBBtn>
                        <MDBBtn className="white-text" color="  light-green darken-4" href={props.downloadCSVResults(props.myprojectURL)}><MDBIcon icon="download" className="mr-1" size="lg"/>Download CSV</MDBBtn>
                    </div>
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </MDBRow>
    )
}

class TDClassifierDashPage extends React.Component {
    
    constructor(props){
        super(props);
        
        // Initialize state here. Now hardcoded values are assigned (should be :null otherwise)
        this.state = {
            disabledButton: false,
            isLoadingDB: false,
            isLoadingAnalysis: false,
            isAnalysisFromDB: false,
            isProjectVisible: false,
            tabledisabledButton: false,
            selectedProject: '',
            selectedProjectURL: '',
            results: {},
            projectTableData: {},
            analysisType: 1,
            analysisMessage: 'You have selected a Fast analysis. The process will take into account the classes that were modified during the last 100 commits',
            highTdClasses: 0,
            totalClasses: 0,
            stateClone: 'pending',
            statePyDriller: 'pending',
            stateCK: 'pending',
            stateCPD: 'pending',
            stateCLOC: 'pending',
            stateClassifier: 'pending',
            iconClone: 'fas fa-history blue-text',
            iconPyDriller: 'fas fa-history blue-text',
            iconCK: 'fas fa-history blue-text',
            iconCPD: 'fas fa-history blue-text',
            iconCLOC: 'fas fa-history blue-text',
            iconClassifier: 'fas fa-history blue-text',
        }
    }
    
    // Handle click on analysis type radio buttons
    toggleAnalysisRadio = (selection) => {
        var analysis_message = ''
        
        if (selection === 1){
            analysis_message = 'You have selected a Fast analysis. The process will take into account the classes that were modified during the last 100 commits.'
        } else if (selection === 2){
            analysis_message = 'You have selected a Normal analysis. The process will take into account classes that were modified during the last 1000 commits.'
        } else if (selection === 3){
            analysis_message = 'You have selected a Full analysis. The process will take into account the whole project commit history.'
        }

        this.setState({
            analysisType: selection,
            analysisMessage: analysis_message
        })
    }
    
    // Handle click on table switch button
    toggleTableSwitch = () => {
        const { results, tabledisabledButton } = this.state
        
        this.setState({
            tabledisabledButton: !tabledisabledButton,
        })
        
        this.updateTabledData(results, !tabledisabledButton)
    }
    
    // Handle click on analysis cancel buttons
    cancelAnalysis = () => {
        this.setState({
            disabledButton:false,
        })
        
        controller.abort()
        
        controller = new AbortController();
        signal = controller.signal;
    }
    
    // Update 'selectedProject' object
    updateSelectedProject = (projectName, projectURL) => {
        this.setState({ 
            selectedProject: projectName,
            selectedProjectURL: projectURL,
            isProjectVisible: false
        })
    }
    
    // Update state with analysis results
    updateStateAnalysis = (result, state, icon) => {
        // Update analysis state
        if(result === 'running'){
            this.setState({
                [state]: 'running',
                [icon]: 'fas fa-circle-notch fa-spin',
            })
        }else if(result === 'finished'){
            this.setState({
                [state]: 'finished',
                [icon]: 'fas fa-check-circle green-text',
            })
        }else if(result === 'failed'){
            this.setState({
                [state]: 'failed',
                [icon]: 'fas fa-exclamation-circle red-text',
            })
        }else if(result === 'cancelled'){
            this.setState({
                [state]: 'cancelled',
                [icon]: 'fas fa-exclamation-circle orange-text',
            })
        }
    }
    
    // Perform GET call for CheckRetrieveDB API
    getCheckRetrieveDB = (url, git_url) => {
        // Default options are marked with *
        return fetch(url+'?git_url='+git_url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'include', // include, *same-origin, omit
            //headers: new Headers({
            //    'Authorization': key
            //})
        })
        .then(response => response.json()); // parses JSON response into native JavaScript objects 
    }
    
    // Perform GET call for CompleteAnalysis API
    getCompleteAnalysis(url, git_url, analysis_type) {
        // Default options are marked with *
        return fetch(url+'?git_url='+git_url+'&analysis_type='+analysis_type, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            signal,
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'include', // include, *same-origin, omit
            //headers: new Headers({
            //    'Authorization': key
            //})
        })
        .then(response => response.json()); // parses JSON response into native JavaScript objects 
    }
    
    // Perform GET call for CloneProject API
    getCloneProject = (url, git_url, analysis_type) => {
        this.setState({
            stateClone: 'running',
            iconClone: 'fas fa-circle-notch fa-spin',
        })
        // Default options are marked with *
        return fetch(url+'?git_url='+git_url+'&analysis_type='+analysis_type, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            signal,
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'include', // include, *same-origin, omit
            //headers: new Headers({
            //    'Authorization': key
            //})
        })
        .then(response => response.json()); // parses JSON response into native JavaScript objects 
    }
    
    // Perform GET call for RunPydriller API
    getRunPydriller = (url, git_url, first_commit, last_commit) => {
        this.setState({
            statePyDriller: 'running',
            iconPyDriller: 'fas fa-circle-notch fa-spin',
        })
        // Default options are marked with *
        return fetch(url+'?git_url='+git_url+'&first_commit='+first_commit+'&last_commit='+last_commit, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            signal,
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'include', // include, *same-origin, omit
            //headers: new Headers({
            //    'Authorization': key
            //})
        })
        .then(response => response.json()); // parses JSON response into native JavaScript objects 
    }
    
    // Perform GET call for RunCK API
    getRunCK = (url, git_url) => {
        this.setState({
            stateCK: 'running',
            iconCK: 'fas fa-circle-notch fa-spin',
        })
        // Default options are marked with *
        return fetch(url+'?git_url='+git_url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            signal,
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'include', // include, *same-origin, omit
            //headers: new Headers({
            //    'Authorization': key
            //})
        })
        .then(response => response.json()); // parses JSON response into native JavaScript objects 
    }
    
    // Perform GET call for RunCPD API
    getRunCPD = (url, git_url) => {
        this.setState({
            stateCPD: 'running',
            iconCPD: 'fas fa-circle-notch fa-spin',
        })
        // Default options are marked with *
        return fetch(url+'?git_url='+git_url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            signal,
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'include', // include, *same-origin, omit
            //headers: new Headers({
            //    'Authorization': key
            //})
        })
        .then(response => response.json()); // parses JSON response into native JavaScript objects 
    }
    
    // Perform GET call for RunCLOC API
    getRunCLOC = (url, git_url) => {
        this.setState({
            stateCLOC: 'running',
            iconCLOC: 'fas fa-circle-notch fa-spin',
        })
        // Default options are marked with *
        return fetch(url+'?git_url='+git_url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            signal,
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'include', // include, *same-origin, omit
            //headers: new Headers({
            //    'Authorization': key
            //})
        })
        .then(response => response.json()); // parses JSON response into native JavaScript objects 
    }
    
    // Perform GET call for RunClassifier API
    getRunClassifier = (url, git_url) => {
        this.setState({
            stateClassifier: 'running',
            iconClassifier: 'fas fa-circle-notch fa-spin',
        })
        // Default options are marked with *
        return fetch(url+'?git_url='+git_url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            signal,
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'include', // include, *same-origin, omit
            //headers: new Headers({
            //    'Authorization': key
            //})
        })
        .then(response => response.json()); // parses JSON response into native JavaScript objects 
    }
    
    // Update panel by fetching results from DB
    fetchFromDB = (projectURL) => {
        const { tabledisabledButton } = this.state
        
        this.setState({
            disabledButton:true,
            isLoadingDB: true,
        })
        
        this.getCheckRetrieveDB(SERVER_IP+'/TDClassifier/CheckRetrieveDB', projectURL)
        .then(resp => {
            if (resp.results !== -1) {
                console.log("CheckRetrieveDB Data received")
                this.setState({
                    disabledButton:false,
                    isLoadingDB: false,
                    isAnalysisFromDB: true,
                    isProjectVisible: true,
                    results: resp.results,
                })
                this.updateTabledData(resp.results, tabledisabledButton)
                this.createMessage(resp.results)
            }else{
                console.log("CheckRetrieveDB received no records")
                this.setState({ 
                    disabledButton:false,
                    isLoadingDB: false
                })
            }
        }).catch(error => {
            console.log('CheckRetrieveDB error: ' + error)
            this.setState({ 
                disabledButton:false,
                isLoadingDB: false
            })
        })
    }
    
    // Update panel by performing new analysis
    startAnalysis = (projectURL, analysisType) => {
        this.setState({
            disabledButton:true,
            isLoadingAnalysis: true,
            isAnalysisFromDB: false,
            stateClone: 'pending',
            statePyDriller: 'pending',
            stateCK: 'pending',
            stateCPD: 'pending',
            stateCLOC: 'pending',
            stateClassifier: 'pending',
            iconClone: 'fas fa-history blue-text',
            iconPyDriller: 'fas fa-history blue-text',
            iconCK: 'fas fa-history blue-text',
            iconCPD: 'fas fa-history blue-text',
            iconCLOC: 'fas fa-history blue-text',
            iconClassifier: 'fas fa-history blue-text',
        })
        
        // Code for fetching json data from API
        // this.getCompleteAnalysis(SERVER_IP+'/TDClassifier/CompleteAnalysis', projectURL, analysisType)
        // .then(resp => {
        //     console.log("Data received")
        //     this.setState({
        //         isLoadingAnalysis: false,
        //         isProjectVisible: true,
        //         results: resp.results,
        //     })
        //     this.updateTabledData(resp.results)
        // }).catch(error => this.setState({ error, isLoadingAnalysis: false }))
        
        // First clone project
        this.getCloneProject(SERVER_IP+'/TDClassifier/CloneProject', projectURL, analysisType)
        .then(resp => {
            console.log("CloneProject Data received")
            this.setState({
                results: resp.results,
            })
            this.updateStateAnalysis('finished', 'stateClone', 'iconClone')
            // Then call RunPydriller API
            this.getRunPydriller(SERVER_IP+'/TDClassifier/RunPydriller', projectURL, resp.results.first_commit, resp.results.last_commit)
            .then(resp => {
                console.log("RunPydriller Data received")
                this.updateStateAnalysis('finished', 'statePyDriller', 'iconPyDriller')
                this.checkDataCollectionFinished(projectURL)
            }).catch(error => {
                console.log('RunPydriller error: ' + error)
                if(error.name === "AbortError") {
                    this.updateStateAnalysis('cancelled', 'statePyDriller', 'iconPyDriller')
                }else{
                    this.updateStateAnalysis('failed', 'statePyDriller', 'iconPyDriller')
                    this.cancelAnalysis()
                }
            })
            // ... and RunCPD API
            this.getRunCPD(SERVER_IP+'/TDClassifier/RunCPD', projectURL)
            .then(resp => {
                console.log("RunCPD Data received")
                this.updateStateAnalysis('finished', 'stateCPD', 'iconCPD')
                this.checkDataCollectionFinished(projectURL)
            }).catch(error => {
                console.log('RunCPD error: ' + error)
                if(error.name === "AbortError") {
                    this.updateStateAnalysis('cancelled', 'stateCPD', 'iconCPD')
                }else{
                    this.updateStateAnalysis('failed', 'stateCPD', 'iconCPD')
                    this.cancelAnalysis()
                }
            })
            // ... and RunCLOC API
            this.getRunCLOC(SERVER_IP+'/TDClassifier/RunCLOC', projectURL)
            .then(resp => {
                console.log("RunCLOC Data received")
                this.updateStateAnalysis('finished', 'stateCLOC', 'iconCLOC')
                this.checkDataCollectionFinished(projectURL)
            }).catch(error => {
                console.log('RunCLOC error: ' + error)
                if(error.name === "AbortError") {
                    this.updateStateAnalysis('cancelled', 'stateCLOC', 'iconCLOC')
                }else{
                    this.updateStateAnalysis('failed', 'stateCLOC', 'iconCLOC')
                    this.cancelAnalysis()
                }
            })
            // ... and RunCK API
            this.getRunCK(SERVER_IP+'/TDClassifier/RunCK', projectURL)
            .then(resp => {
                console.log("RunCK Data received")
                this.updateStateAnalysis('finished', 'stateCK', 'iconCK')
                this.checkDataCollectionFinished(projectURL)
            }).catch(error => {
                console.log('RunCK error: ' + error)
                if(error.name === "AbortError") {
                    this.updateStateAnalysis('cancelled', 'stateCK', 'iconCK')
                }else{
                    this.updateStateAnalysis('failed', 'stateCK', 'iconCK')
                    this.cancelAnalysis()
                }
            })
        }).catch(error => {
            console.log('CloneProject error: ' + error)
            if(error.name === "AbortError") {
                this.updateStateAnalysis('cancelled', 'stateClone', 'iconClone')
            }else{
                this.updateStateAnalysis('failed', 'stateClone', 'iconClone')
                this.cancelAnalysis()
            }
        })
    }
    
    // Check if data collection step is finished and call RunClassifier API
    checkDataCollectionFinished = (projectURL) => {
        const { stateClone, statePyDriller, stateCK, stateCPD, stateCLOC, tabledisabledButton } = this.state
        
        if (stateClone === 'finished' && statePyDriller === 'finished' && stateCK === 'finished' && stateCPD === 'finished' && stateCLOC === 'finished') {
            this.getRunClassifier(SERVER_IP+'/TDClassifier/RunClassifier', projectURL)
            .then(resp => {
                console.log("RunClassifier Data received")
                this.setState({
                    disabledButton:false,
                    isLoadingAnalysis: false,
                    isProjectVisible: true,
                    results: resp.results,
                })
                this.updateStateAnalysis('finished', 'stateClassifier', 'iconClassifier')
                this.updateTabledData(resp.results, tabledisabledButton)
                this.createMessage(resp.results)
            }).catch(error => {
                console.log('RunClassifier error: ' + error)
                if(error.name === "AbortError") {
                    this.updateStateAnalysis('cancelled', 'stateClassifier', 'iconClassifier')
                }else{
                    this.updateStateAnalysis('failed', 'stateClassifier', 'iconClassifier')
                    this.cancelAnalysis()
                }
            })
        }
    }
    
    // Update table 
    updateTabledData = (data, tabledisabledButton) => {
        var tableData = []
        
        for(var i = 0; i < data.length; i++) {
            if (tabledisabledButton && data[i]['high_td'] === 0) { continue }
            tableData.push({
                'className': data[i]['class_name'],
                'classPath': data[i]['class_path'],
                'highTDProb': data[i]['high_td_proba'],
                'highTD': data[i]['high_td'],
                'commitsCount': data[i]['commits_count'],
                'codeChurnAvg': data[i]['code_churn_avg'],
                'contributorsCount': data[i]['contributors_count'],
                'contributorsExperience': data[i]['contributors_experience'],
                'hunksCount': data[i]['hunks_count'],
                'cbo': data[i]['cbo'],
                'wmc': data[i]['wmc'],
                'dit': data[i]['dit'],
                'rfc': data[i]['rfc'],
                'lcom': data[i]['lcom'],
                'maxNestedBlocks': data[i]['max_nested_blocks'],
                'totalMethods': data[i]['total_methods'],
                'totalVariables': data[i]['total_variables'],
                'duplicatedLines': data[i]['duplicated_lines'],
                'commentLines': data[i]['comment_lines'],
                'ncloc': data[i]['ncloc'],
            })
        }
        
        this.setState({
            projectTableData: tableData,
        })
    }
    
    // Create message
    createMessage = (data) => {        
        var high_td_classes = 0
        
        for(var i = 0; i < data.length; i++) {
            if (data[i]['high_td'] === 1) {
                high_td_classes = high_td_classes + 1
            }
        }
        
        this.setState({
            highTdClasses: high_td_classes,
            totalClasses: data.length,
        })
    }

    // Download CSV results
    downloadCSVResults = (projectURL) => {
        var url = SERVER_IP+'/TDClassifier/DownloadCSV'+'?git_url='+projectURL
        return url
    }
    
    // Download JSON results
    downloadJSONResults = (projectURL) => {
        var url = SERVER_IP+'/TDClassifier/DownloadJSON'+'?git_url='+projectURL
        return url
    }
    
    componentDidMount(){
        // Check if session storage contains selected project
        if (sessionStorage.getItem('selected_project') === null){
            this.setState({
                error: {message: 'No project selected. Please select a project from the "Projects" panel and revisit the page.'},
            })
        }else{
            var selectedProjectSession = JSON.parse(sessionStorage.getItem('selected_project'))
            var nameInfo = selectedProjectSession['name']
            var urlInfo = selectedProjectSession['endpoint']  
            
            this.updateSelectedProject(nameInfo, urlInfo)
            this.fetchFromDB(urlInfo)
        }
    }
    
    render(){
        const { isLoadingDB, error, disabledButton, isLoadingAnalysis, isAnalysisFromDB, tabledisabledButton, isProjectVisible, selectedProject, selectedProjectURL, results, 
                projectTableData, analysisType, analysisMessage, highTdClasses, totalClasses, stateClone, statePyDriller, stateCK, stateCPD, stateCLOC, stateClassifier, iconClone,
                iconPyDriller, iconCK, iconCPD, iconCLOC, iconClassifier } = this.state
        
        if(isLoadingDB){
            return (
                <React.Fragment>
                    <ProjectPanel
                        myprojectName={selectedProject}
                        myprojectURL={selectedProjectURL}
                        myanalysisType={analysisType}
                        mydisabledButton={disabledButton}
                        startAnalysis={this.startAnalysis}
                        updateSelectedProject={this.updateSelectedProject}
                        toggleAnalysisRadio={this.toggleAnalysisRadio}
                    />
                    <Loader/>
                </React.Fragment>
            )
        }
        
        if (error) {
            return (
                <div class="alert alert-danger" role="alert">
                    {error.message}
                </div>
            )
        }
    
        if (isLoadingAnalysis) {
            return (
                <React.Fragment>
                    <ProjectPanel
                        myprojectName={selectedProject}
                        myprojectURL={selectedProjectURL}
                        myanalysisType={analysisType}
                        mydisabledButton={disabledButton}
                        startAnalysis={this.startAnalysis}
                        updateSelectedProject={this.updateSelectedProject}
                        toggleAnalysisRadio={this.toggleAnalysisRadio}
                    />
                    <LoadingPanel
                        myanalysisMessage={analysisMessage}
                        mystateClone={stateClone}
                        mystatePyDriller={statePyDriller}
                        mystateCK={stateCK}
                        mystateCPD={stateCPD}
                        mystateCLOC={stateCLOC}
                        mystateClassifier={stateClassifier}
                        myiconClone={iconClone}
                        myiconPyDriller={iconPyDriller}
                        myiconCK={iconCK}
                        myiconCPD={iconCPD}
                        myiconCLOC={iconCLOC}
                        myiconClassifier={iconClassifier}
                        cancelAnalysis={this.cancelAnalysis}
                    />
                </React.Fragment>
            )
        }
        
        if (!isProjectVisible) {
            return (
                <React.Fragment>
                    <ProjectPanel
                        myprojectName={selectedProject}
                        myprojectURL={selectedProjectURL}
                        myanalysisType={analysisType}
                        mydisabledButton={disabledButton}
                        startAnalysis={this.startAnalysis}
                        updateSelectedProject={this.updateSelectedProject}
                        toggleAnalysisRadio={this.toggleAnalysisRadio}
                    />
                </React.Fragment>
            )
        }
                
        // Code for rendering the dashboard
        if (isAnalysisFromDB) {
            return(
                <React.Fragment>
                    <ProjectPanel
                        myprojectName={selectedProject}
                        myprojectURL={selectedProjectURL}
                        myanalysisType={analysisType}
                        mydisabledButton={disabledButton}
                        startAnalysis={this.startAnalysis}
                        updateSelectedProject={this.updateSelectedProject}
                        toggleAnalysisRadio={this.toggleAnalysisRadio}
                    />
                    <MessageDBPanel
                        myprojectName={selectedProject}
                    />
                    <MessagePanel
                        myprojectName={selectedProject}
                        myhighTdClasses={highTdClasses}
                        mytotalClasses={totalClasses}
                    />
                    <HeatmamPanel
                        myResults={results}
                    />
                    <TablePanel
                        myTableData={projectTableData}
                        mytabledisabledButton={tabledisabledButton}
                        myprojectURL={selectedProjectURL}
                        updateTabledData={this.updateTabledData}
                        toggleTableSwitch={this.toggleTableSwitch}
                        downloadCSVResults={this.downloadCSVResults}
                        downloadJSONResults={this.downloadJSONResults}
                    />
                </React.Fragment>
            )
        }
        
        return(
            <React.Fragment>
                <ProjectPanel
                    myprojectName={selectedProject}
                    myprojectURL={selectedProjectURL}
                    myanalysisType={analysisType}
                    mydisabledButton={disabledButton}
                    startAnalysis={this.startAnalysis}
                    updateSelectedProject={this.updateSelectedProject}
                    toggleAnalysisRadio={this.toggleAnalysisRadio}
                />
                <MessagePanel
                    myprojectName={selectedProject}
                    myhighTdClasses={highTdClasses}
                    mytotalClasses={totalClasses}
                />
                <HeatmamPanel
                    myResults={results}
                />
                <TablePanel
                    myTableData={projectTableData}
                    mytabledisabledButton={tabledisabledButton}
                    myprojectURL={selectedProjectURL}
                    updateTabledData={this.updateTabledData}
                    toggleTableSwitch={this.toggleTableSwitch}
                    downloadCSVResults={this.downloadCSVResults}
                    downloadJSONResults={this.downloadJSONResults}
                />
            </React.Fragment>
        )
    }
}

export default TDClassifierDashPage;