import React from 'react';
import { MDBCol, MDBCard, MDBCardBody, MDBCardHeader, MDBFormInline, MDBRow, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBContainer, MDBDataTable, MDBBtn, MDBIcon, MDBTooltip } from 'mdbreact';
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
heatmap(Highcharts);
treemap(Highcharts);

const SERVER_IP = process.env.REACT_APP_DEPENDABILITY_TOOL_SERVER_IP // Update inside .env file

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
    tooltips: {
        enabled: true,
        callbacks: {
            label: function(tooltipItem, data) {
                return 'Score: ' + (data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]).toFixed(2);
            }
        }
    }
}

// Styling options for LineChart - Edit only for styling modifications 
const lineChartOptions = {
    scales: {
        xAxes: [{
            display: true,
            gridLines: {
                display: true,
                color: 'rgba(0,0,0,.05)',
                drawBorder: true,
                lineWidth: 1,
            },
            scaleLabel: {
                display: true,
                labelString: 'Versions',
                fontSize: 15,
            },
        }],
        yAxes: [{
            display: true,
            ticks: {
                beginAtZero: true,
            },
            gridLines: {
                display: true,
                color: 'rgba(0,0,0,.05)',
                drawBorder: true,
                lineWidth: 1,
            },
            scaleLabel: {
                display: true,
                labelString: 'Security Index',
                fontSize: 15,
            },
        }]
    },
    maintainAspectRatio: false,
    responsive: true, 
}

// Function to pause execution for a fixed amount of milliseconds
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

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

// Function to extract labels from json
function returnLabels(data) {
    var labels = []
    for(var i = 0; i < data.length; i++) {
        labels.push(data[i].name)
    }
    return labels
}

// Function to extract values from json
function returnValues(data) {
    var values = []
    for(var i = 0; i < data.length; i++) {
        values.push(data[i].eval)
    }
    return values
}

// Function to extract values from vulnerabilities json
function returnVulnerabilityValues(data) {
    var values = []
    for(var i = 0; i < data.length; i++) {
        values.push({
            'name': data[i].class_name,
            'value': 1,
            'colorValue': data[i].sigmoid
        })
    }
    //parseFloat((data[i].confidence).replace('%',''))
    return values
}

// Function to check if an object is empty
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// Function to convert UNIX timestamp to date  if an object is empty
function toDate(data) {
    var date = new Date(parseInt(data))
    var dateString = date.toLocaleDateString()
    var timeString = date.toLocaleTimeString()
    return dateString + ' ' + timeString
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
                        {/*
                        <MDBCol>
                            <div align="right">
                                <MDBBtn className="white-text" color="  light-green darken-4" onClick={(param) => props.updateProjectData(props.myprojectName)}><MDBIcon icon="sync-alt" className="mr-1" size="lg"/>New Analysis</MDBBtn>
                            </div>
                        </MDBCol>
                        */}
                    </MDBFormInline>
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </MDBRow>
    )
}

// The Security Index Panel
const SecurityIndexPanel = props => {
 
    // code to render stars
    var mysecurityIndexStars = 0
    if (props.mysecurityIndexScore > 0.8) {
        mysecurityIndexStars = 5
    } else if (props.mysecurityIndexScore > 0.6) {
        mysecurityIndexStars = 4
    } else if (props.mysecurityIndexScore > 0.5) {
        mysecurityIndexStars = 3
    } else if (props.mysecurityIndexScore > 0.4) {
        mysecurityIndexStars = 2
    } else if (props.mysecurityIndexScore > 0.2) {
        mysecurityIndexStars = 1
    }
    
    var stars = []
    for(var i = 1; i <= 5; i++){
        var star_icon = i <= mysecurityIndexStars ? star_full : star
        stars.push(<img alt="SDK4ED logo" className="img-fluid" width="100" height="100" src={star_icon}/>)
    }
        
    return (
        <MDBRow className="mb-4">
            <MDBCol md="12" lg="12" className="mb-12">
                <MDBCard className="mb-12">
                <MDBCardBody>
                    <div align="center">
                        <MDBRow><MDBCol><h2>Security Index <MDBTooltip domElement tag="span" placement="top"><i className="fa fa-info-circle" aria-hidden="true"></i><span>The Security Index of the project both in a numerical and in a discrete form. The latter is a relative score that is determined based on the normal distribution of the security scores of popular open-source software projects.</span></MDBTooltip></h2></MDBCol></MDBRow>
                        <br></br>
                        <MDBRow><MDBCol>{stars}</MDBCol></MDBRow>
                        <br></br>
                        <MDBRow><MDBCol><h2>{(props.mysecurityIndexScore).toFixed(2) * 100}%</h2></MDBCol></MDBRow>
                    </div>
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </MDBRow>
    )
}

// The Scores Panel
const ScoresPanel = props => {
    // Data object of Security Characteristics RadarChart is constructed here - Edit only for styling modifications 
    var securityCharacteristicsData = {
        labels: returnLabels(props.mysecurityCharacteristicsScores), // labels values from prop var are loaded here
        datasets: [
            {
                label: 'Security Characteristics',
                backgroundColor: 'rgba(84,130,53,0.05)',
                borderColor: 'rgba(84,130,53,1)',
                pointRadius: 4,
                pointHitRadius: 4,
                pointBackgroundColor: 'rgba(84,130,53,1)',
                pointBorderColor: '#c1c7d1',
                pointHoverBackgroundColor : '#fff',
                pointHoverBorderColor: 'rgba(84,130,53,1)',
                data: returnValues(props.mysecurityCharacteristicsScores) // data values from prop var are loaded here
            }
        ]
    }
    
    // Data object of Properties RadarChart is constructed here - Edit only for styling modifications 
    var securityPropertiesData = {
        labels: returnLabels(props.mysecurityPropertiesScores), // labels values from prop var are loaded here
        datasets: [
            {
                label: 'Security Properties',
                backgroundColor: 'rgba(84,130,53,0.05)',
                borderColor: 'rgba(84,130,53,1)',
                pointRadius: 4,
                pointHitRadius: 4,
                pointBackgroundColor: 'rgba(84,130,53,1)',
                pointBorderColor: '#c1c7d1',
                pointHoverBackgroundColor : '#fff',
                pointHoverBorderColor: 'rgba(84,130,53,1)',
                data: returnValues(props.mysecurityPropertiesScores) // data values from prop var are loaded here
            }
        ]
    }
            
    return (
        <MDBRow className="mb-4">
            <MDBCol md="12" lg="6" className="mb-12">
                <MDBCard className="mb-6">
                <MDBCardHeader className="sdk4ed-color">Characteristics Scores <MDBTooltip domElement tag="span" placement="top"><i className="fa fa-info-circle" aria-hidden="true"></i><span>The scores of the Security Characteristics of the model</span></MDBTooltip></MDBCardHeader>
                <MDBCardBody>
                    <MDBContainer>
                        <Radar data={securityCharacteristicsData} options={radarChartOptions} />
                    </MDBContainer>
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
            <MDBCol md="12" lg="6" className="mb-12">
                <MDBCard className="mb-6">
                <MDBCardHeader className="sdk4ed-color">Properties Scores <MDBTooltip domElement tag="span" placement="top"><i className="fa fa-info-circle" aria-hidden="true"></i><span>The scores of the Security Properties of the model</span></MDBTooltip></MDBCardHeader>
                <MDBCardBody>
                    <MDBContainer>
                        <Radar data={securityPropertiesData} options={radarChartOptions} />
                    </MDBContainer>
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
                'label': 'Rule Name',
                'field': 'ruleName',
                'sort': 'asc',
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
                'label': 'Class Name',
                'field': 'classPath'
            },
            {
                'label': 'Line of Code',
                'field': 'lineOfCode'
            },
            {
                'label': 'Priority',
                'field': 'priority'
            }
        ],
        rows: props.mytableData
    }
    
    return (
        <MDBRow className="mb-4">
            <MDBCol md="12" lg="12" className="mb-12">
                <MDBCard>
                    <MDBCardHeader className="sdk4ed-color">
                        <MDBDropdown>
                            <MDBDropdownToggle caret className="white-text" color="  light-green darken-4">
                                {props.mytableSelectedProperty}
                            </MDBDropdownToggle>
                            <MDBDropdownMenu basic>{dropdownLabels}</MDBDropdownMenu>
                        </MDBDropdown>
                    </MDBCardHeader>
                    <MDBCardBody>
                        <BasicTable data={tableData} /> 
                    </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </MDBRow>
    )
}

// The Project History Panel
const ProjectHistoryPanel = props => {
    
    var projectHistoryData = {
        labels: props.myprojectHistoryIndexScore.labels, // labels values from prop var are loaded here
        datasets: [
            {
                label: 'Security Index',
                // line
                fill                      : true,
                lineTension               : 0.2,
                borderWidth               : 2,
                borderColor               : 'rgba(84,130,53,1)',
                backgroundColor           : 'rgba(84,130,53,0.05)',
                // point
                pointRadius               : 4,
                pointHitRadius            : 4,
                pointBackgroundColor      : 'rgba(84,130,53,1)',
                pointBorderColor          : 'rgba(84,130,53,1)',
                pointHoverBackgroundColor : '#fff',
                pointHoverBorderColor     : 'rgba(84,130,53,1)',
                // data
                data: props.myprojectHistoryIndexScore.data // data values from prop are loaded here
            }
        ]
    }
 
    return (
        <MDBRow className="mb-4">
            <MDBCol md="12" lg="12" className="mb-12">
                <MDBCard className="mb-12">
                <MDBCardHeader className="sdk4ed-color">Project History <MDBTooltip domElement tag="span" placement="top"><i className="fa fa-info-circle" aria-hidden="true"></i><span>The evolution of the Security Index of the project</span></MDBTooltip></MDBCardHeader>
                <MDBCardBody>
                    <Line data={projectHistoryData} options={lineChartOptions} height={500}/>
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </MDBRow>
    )
}

// The Vulnerability Prediction Heatmam Panel
const VulnerabilityPredictionHeatmamPanel = props => {
    
    var vulnerabilityPredictionData = {
        colorAxis: {
            minColor: '#FFFFFF',
            maxColor: 'rgba(84,130,53,1)'
        },
        series: [{
            animation: false,
            type: 'treemap',
            layoutAlgorithm: 'squarified',
            data: returnVulnerabilityValues(props.myvulnerabilityPredictionResults),
            tooltip: {
                pointFormat: '<b>Probability Score:</b> {point.colorValue}'
            }
        }],
        title: {
            text: 'Probability of Vulnerability'
        }
    }
    
    if (isEmpty(props.myvulnerabilityPredictionResults)){return null}

    return (
        <MDBRow className="mb-4">
            <MDBCol md="12" lg="12" className="mb-12">
                <MDBCard className="mb-12">
                <MDBCardHeader className="sdk4ed-color">Vulnerability Prediction Heatmap <MDBTooltip domElement tag="span" placement="top"><i className="fa fa-info-circle" aria-hidden="true"></i><span>A heatmap with the software components that are likely to contain vulnerabilities. The greener the color of a rectangle, the higher the probability of the associated component to contain a vulnerability.</span></MDBTooltip></MDBCardHeader>
                <MDBCardBody>
                    <HighchartsReact highcharts={Highcharts} options={vulnerabilityPredictionData} immutable = {true} />
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </MDBRow>
    )
}

// The Vulnerability Prediction Table Panel
const VulnerabilityPredictionTablePanel = props => {
    
    var tableData = {
        columns: [
            {
                'label': 'Class Name',
                'field': 'class_name'
            },
            {
                'label': 'Path',
                'field': 'package'
            },
            {
                'label': 'Probability Score',
                'field': 'sigmoid'
            },
            //{
            //    'label': 'Confidence',
            //    'field': 'confidence'
            //},
            {
                'label': 'Is Vulnerable',
                'field': 'is_vulnerable',
                'sort': 'asc',
            },
        ],
        rows: props.myVulnerabilityTableData
    }
    
    if (isEmpty(props.myVulnerabilityTableData)){return null}
     
    return (
        <MDBRow className="mb-4">
            <MDBCol md="12" lg="12" className="mb-12">
                <MDBCard className="mb-12">
                <MDBCardHeader className="sdk4ed-color">Vulnerability Prediction Results <MDBTooltip domElement tag="span" placement="top"><i className="fa fa-info-circle" aria-hidden="true"></i><span>The detailed results of the vulnerability prediction service. "0": The component is not likely to contain a vulnerability. "1": The component is likely to contain a vulnerability.</span></MDBTooltip></MDBCardHeader>
                <MDBCardBody>
                    <BasicTable data={tableData} /> 
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </MDBRow>
    )
}

class SecurityDashPage extends React.Component {
    
    constructor(props){
        super(props);
        
        // Initialize state here. Now hardcoded values are assigned (should be :null otherwise)
        this.state = {
            isLoadingSecurity: false,
            isLoadingVulnerability: false,
            isLoadingSecurityEvolution: false,
            isProjectVisible: false,
            selectedProject: '',
            lastAnalysis: '',
            name: '',
            securityIndex: 0,
            characteristics: {},
            properties: {},
            issues: {},
            vulnerabilityResults: {},
            projectTableData: {},
            projectTableSelectedProperty: '',
            projectVulnerabilityTableData: {},
            projectHistoryIndexScore: {},
        }
    }
    
    // Perform GET call for new analysis
    // getNewAnalysisData(url, project, lang, inspection, key) {
    //     // Default options are marked with *
    //     return fetch(url+'?project='+project+'&lang='+lang+'&inspection='+inspection, {
    //         method: 'GET', // *GET, POST, PUT, DELETE, etc.
    //         mode: 'cors', // no-cors, cors, *same-origin
    //         //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //         //credentials: 'include', // include, *same-origin, omit
    //         headers: new Headers({
    //             'Authorization': key
    //         })
    //     })
    //     .then(response => response.json()); // parses JSON response into native JavaScript objects 
    // }
    
    // Perform GET call for fetching results from DB
    getDBData(url, project_name, user_name, analysis_type) {
        // Default options are marked with *
        return fetch(url+'?project_name='+project_name+'&user_name='+user_name+'&analysis_type='+analysis_type, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'include', // include, *same-origin, omit
        })
        .then(response => response.json()); // parses JSON response into native JavaScript objects 
    }
    
    // Update 'selectedProject' object
    updateSelectedProject = (projectName) => {
        this.setState({ 
            selectedProject: projectName,
            isProjectVisible: false
        });
    }
    
    // Update panel by performing new analysis
    // updateProjectData = (projectName) => {
    //     this.setState({ 
    //         isLoadingSecurity: true,
    //         isLoadingVulnerability: true,
    //         isLoadingSecurityEvolution: true,
    //     });
        
    //     if(projectName === 'Holisun'){
    //         // Code for fetching Security Assessment data from API
    //         this.getNewAnalysisData(SERVER_IP+'/DependabilityToolbox/SecurityAssessment','https://gitlab.com/siavvasm/arassistance.git','java','yes','Basic bWlsdG9zLnNpYXZ2YXNAZ21haWwuY29tOjAyODdQQU9LNjYxMyEh')
    //         .then(resp => {
    //             console.log("Data received")
    //             this.setState({
    //                 isLoadingSecurity: false,
    //                 name: resp.name,
    //                 securityIndex: resp.security_index.eval,
    //                 characteristics: resp.characteristics.characteristics,
    //                 properties: resp.properties.properties,
    //                 issues: resp.issues,
    //             })
    //             this.updateTabledData(resp.issues, resp.issues[0].propertyName)
    //         }).catch(error => this.setState({ error, isLoadingSecurity: false }))
            
    //         // Code for fetching Vulnerability Prediction data from API
    //         sleep(1000).then(() => {this.getNewAnalysisData(SERVER_IP+'/DependabilityToolbox/VulnerabilityPrediction','https://gitlab.com/siavvasm/arassistance.git','java','yes','Basic bWlsdG9zLnNpYXZ2YXNAZ21haWwuY29tOjAyODdQQU9LNjYxMyEh')
    //         .then(resp => {
    //             console.log("Data received")
    //             this.setState({
    //                 isLoadingVulnerability: false,
    //                 isProjectVisible: true,
    //                 vulnerabilityResults: resp.results,
    //             })
    //             this.updateVulnerabilityTabledData(resp.results)
    //         }).catch(error => this.setState({ error, isLoadingVulnerability: false }))})
            
    //         // Code for fetching Security Index values to plot evolution
    //         sleep(1000).then(() => {
    //             this.setState({
    //                 isLoadingSecurityEvolution: false,
    //                 projectHistoryIndexScore: {},
    //             })
    //         })
    //     }else if(projectName === 'Neurasmus'){
    //         // Code for fetching Security Assessment data from API
    //         this.getNewAnalysisData(SERVER_IP+'/DependabilityToolbox/SecurityAssessment','https://siavvasm@bitbucket.org/alisiddiqi/sdk4ed-healthcare-use-case.git','cpp','yes','Basic c2lhdnZhc21AaXRpLmdyOjAyODdQQU9LNjYxMyEh')
    //         .then(resp => {
    //             console.log("Data received")
    //             this.setState({
    //                 isLoadingSecurity: false,
    //                 name: resp.name,
    //                 securityIndex: resp.security_index.eval,
    //                 characteristics: resp.characteristics.characteristics,
    //                 properties: resp.properties.properties,
    //                 issues: resp.issues,
    //             })
    //             this.updateTabledData(resp.issues, resp.issues[0].propertyName)
    //         }).catch(error => this.setState({ error, isLoadingSecurity: false }))
            
    //         // Code for fetching Vulnerability Prediction data from API
    //         sleep(1000).then(() => {this.getNewAnalysisData(SERVER_IP+'/DependabilityToolbox/VulnerabilityPrediction','https://siavvasm@bitbucket.org/alisiddiqi/sdk4ed-healthcare-use-case.git','cpp','yes','Basic c2lhdnZhc21AaXRpLmdyOjAyODdQQU9LNjYxMyEh')
    //         .then(resp => {
    //             console.log("Data received")
    //             this.setState({
    //                 isLoadingVulnerability: false,
    //                 isProjectVisible: true,
    //                 vulnerabilityResults: resp.results,
    //             })
    //             this.updateVulnerabilityTabledData(resp.results)
    //         }).catch(error => this.setState({ error, isLoadingVulnerability: false }))})
            
    //         // Code for fetching Security Index values to plot evolution
    //         sleep(1000).then(() => {this.getDBData(SERVER_IP+'/DependabilityToolbox/DependabilityDatabase','sdk4ed-healthcare-use-case','securityAssessment&retrieve_all=yes')
    //         .then(resp => {
    //             console.log("Data received")
    //             var version_labels = []
    //             var version_data = []
    //             resp.projects.sort(function(a, b) {
    //                 return parseFloat(a.commit_timestamp) - parseFloat(b.commit_timestamp);
    //             });
    //             for(var i = 0; i < resp.projects.length; i++) {
    //                 var obj = resp.projects[i];
    //                 version_labels.push(i+1)
    //                 version_data.push(resp.projects[i].report.security_index.eval)
    //             }
    //             var projectHistoryIndexScoreJson = {
    //                 'labels': version_labels,
    //                 'data': version_data
    //             }             
    //             this.setState({
    //                 isLoadingSecurityEvolution: false,
    //                 projectHistoryIndexScore: projectHistoryIndexScoreJson,
    //             })
    //         }).catch(error => this.setState({ error, isLoadingSecurity: false }))})
    //     }else if(projectName === 'Airbus'){
    //         // Code for fetching Security Assessment data from API
    //         this.getNewAnalysisData(SERVER_IP+'/DependabilityToolbox/SecurityAssessment','https://gitlab.seis.iti.gr/wrousseau/kameleon-sdk4ed.git','cpp','yes','Basic c2lhdnZhc21AaXRpLmdyOjEyMzQxMjM0QEA=')
    //         .then(resp => {
    //             console.log("Data received")
    //             this.setState({
    //                 isLoadingSecurity: false,
    //                 name: resp.name,
    //                 securityIndex: resp.security_index.eval,
    //                 characteristics: resp.characteristics.characteristics,
    //                 properties: resp.properties.properties,
    //                 issues: resp.issues,
    //             })
    //             this.updateTabledData(resp.issues, resp.issues[0].propertyName)
    //         }).catch(error => this.setState({ error, isLoadingSecurity: false }))
            
    //         // Code for fetching Vulnerability Prediction data from API
    //         sleep(1000).then(() => {this.getNewAnalysisData(SERVER_IP+'/DependabilityToolbox/VulnerabilityPrediction','https://gitlab.seis.iti.gr/wrousseau/kameleon-sdk4ed.git','cpp','yes','Basic c2lhdnZhc21AaXRpLmdyOjEyMzQxMjM0QEA=')
    //         .then(resp => {
    //             console.log("Data received")
    //             this.setState({
    //                 isLoadingVulnerability: false,
    //                 isProjectVisible: true,
    //                 vulnerabilityResults: resp.results,
    //             })
    //             this.updateVulnerabilityTabledData(resp.results)
    //         }).catch(error => this.setState({ error, isLoadingVulnerability: false }))})
            
    //         // Code for fetching Security Index values to plot evolution
    //         sleep(1000).then(() => {
    //             this.setState({
    //                 isLoadingSecurityEvolution: false,
    //                 projectHistoryIndexScore: {},
    //             })
    //         })
    //     }
    // }
    
    // Update panel by fetching past analysis data from DB
    updateProjectDataDB = (projectName, userName, projectGitName) => {
         this.setState({ 
            isLoadingSecurity: true,
            isLoadingVulnerability: true,
            isLoadingSecurityEvolution: true,
        });
        
        if(projectName === 'Holisun'){
            // Code for fetching json data from DB API
            this.getDBData(SERVER_IP+'/DependabilityToolbox/DependabilityDatabase','holisun_use_case_ar_assistance','','securityAssessment')
            .then(resp => {
                console.log("Data received")
                this.setState({
                    isLoadingSecurity: false,
                    name: resp.report.name,
                    lastAnalysis: toDate(resp.timestamp),
                    securityIndex: resp.report.security_index.eval,
                    characteristics: resp.report.characteristics.characteristics,
                    properties: resp.report.properties.properties,
                    issues: resp.report.issues,
                })
                this.updateTabledData(resp.report.issues, resp.report.issues[0].propertyName)
            }).catch(error => this.setState({ error, isLoadingSecurity: false }))
            
            // Code for fetching json data from DB API
            this.getDBData(SERVER_IP+'/DependabilityToolbox/DependabilityDatabase','holisun_use_case_ar_assistance','','vulnerabilityPrediction')
            .then(resp => {
                console.log("Data received")
                this.setState({
                    isLoadingVulnerability: false,
                    isProjectVisible: true,
                    vulnerabilityResults: resp.report.results,
                })
                this.updateVulnerabilityTabledData(resp.report.results)
            }).catch(error => this.setState({ error, isLoadingVulnerability: false }))
            
            // Code for fetching Security Index values to plot evolution
            this.getDBData(SERVER_IP+'/DependabilityToolbox/DependabilityDatabase','holisun_use_case_ar_assistance','','securityAssessment&retrieve_all=yes')
            .then(resp => {
                console.log("Data received")
                var version_labels = []
                var version_data = []
                resp.projects.sort(function(a, b) {
                    return parseFloat(a.commit_timestamp) - parseFloat(b.commit_timestamp);
                });
                for(var i = 0; i < resp.projects.length; i++) {
                    var obj = resp.projects[i];
                    version_labels.push(i+1)
                    version_data.push(resp.projects[i].report.security_index.eval)
                }
                var projectHistoryIndexScoreJson = {
                    'labels': version_labels,
                    'data': version_data
                }             
                this.setState({
                    isLoadingSecurityEvolution: false,
                    projectHistoryIndexScore: projectHistoryIndexScoreJson,
                })
            }).catch(error => this.setState({ error, isLoadingSecurity: false }))
        }else if(projectName === 'Neurasmus'){
            // Code for fetching json data from DB API
            this.getDBData(SERVER_IP+'/DependabilityToolbox/DependabilityDatabase','sdk4ed-healthcare-use-case','','securityAssessment')
            .then(resp => {
                console.log("Data received")
                this.setState({
                    isLoadingSecurity: false,
                    name: resp.report.name,
                    lastAnalysis: toDate(resp.timestamp),
                    securityIndex: resp.report.security_index.eval,
                    characteristics: resp.report.characteristics.characteristics,
                    properties: resp.report.properties.properties,
                    issues: resp.report.issues,
                })
                this.updateTabledData(resp.report.issues, resp.report.issues[0].propertyName)
            }).catch(error => this.setState({ error, isLoadingSecurity: false }))
            
            // Code for fetching json data from DB API
            this.getDBData(SERVER_IP+'/DependabilityToolbox/DependabilityDatabase','sdk4ed-healthcare-use-case','','vulnerabilityPrediction')
            .then(resp => {
                console.log("Data received")
                this.setState({
                    isLoadingVulnerability: false,
                    isProjectVisible: true,
                    vulnerabilityResults: resp.report.results,
                })
                this.updateVulnerabilityTabledData(resp.report.results)
            }).catch(error => this.setState({ error, isLoadingVulnerability: false }))
            
            // Code for fetching Security Index values to plot evolution
            this.getDBData(SERVER_IP+'/DependabilityToolbox/DependabilityDatabase','sdk4ed-healthcare-use-case','','securityAssessment&retrieve_all=yes')
            .then(resp => {
                console.log("Data received")
                var version_labels = []
                var version_data = []
                resp.projects.sort(function(a, b) {
                    return parseFloat(a.commit_timestamp) - parseFloat(b.commit_timestamp);
                });
                for(var i = 0; i < resp.projects.length; i++) {
                    var obj = resp.projects[i];
                    version_labels.push(i+1)
                    version_data.push(resp.projects[i].report.security_index.eval)
                }
                var projectHistoryIndexScoreJson = {
                    'labels': version_labels,
                    'data': version_data
                }             
                this.setState({
                    isLoadingSecurityEvolution: false,
                    projectHistoryIndexScore: projectHistoryIndexScoreJson,
                })
            }).catch(error => this.setState({ error, isLoadingSecurity: false }))
        }else if(projectName === 'Airbus'){
            // Code for fetching json data from DB API
            this.getDBData(SERVER_IP+'/DependabilityToolbox/DependabilityDatabase','kameleon-sdk4ed','','securityAssessment')
            .then(resp => {
                console.log("Data received")
                this.setState({
                    isLoadingSecurity: false,
                    name: resp.report.name,
                    lastAnalysis: toDate(resp.timestamp),
                    securityIndex: resp.report.security_index.eval,
                    characteristics: resp.report.characteristics.characteristics,
                    properties: resp.report.properties.properties,
                    issues: resp.report.issues,
                })
                this.updateTabledData(resp.report.issues, resp.report.issues[0].propertyName)
            }).catch(error => this.setState({ error, isLoadingSecurity: false }))
            
            // Code for fetching json data from DB API
            this.getDBData(SERVER_IP+'/DependabilityToolbox/DependabilityDatabase','kameleon-sdk4ed','','vulnerabilityPrediction')
            .then(resp => {
                console.log("Data received")
                this.setState({
                    isLoadingVulnerability: false,
                    isProjectVisible: true,
                    vulnerabilityResults: resp.report.results,
                })
                this.updateVulnerabilityTabledData(resp.report.results)
            }).catch(error => this.setState({ error, isLoadingVulnerability: false }))
            
            // Code for fetching Security Index values to plot evolution
            this.setState({
                isLoadingSecurityEvolution: false,
                projectHistoryIndexScore: {},
            })
        }else{
            // Code for fetching json data from DB API
            this.getDBData(SERVER_IP+'/DependabilityToolbox/DependabilityDatabase',projectGitName,userName,'securityAssessment')
            .then(resp => {
                console.log("Data received")
                this.setState({
                    isLoadingSecurity: false,
                    name: resp.report.name,
                    lastAnalysis: toDate(resp.timestamp),
                    securityIndex: resp.report.security_index.eval,
                    characteristics: resp.report.characteristics.characteristics,
                    properties: resp.report.properties.properties,
                    issues: resp.report.issues,
                })
                this.updateTabledData(resp.report.issues, resp.report.issues[0].propertyName)
            }).catch(error => this.setState({ error, isLoadingSecurity: false }))
            
            // Code for fetching json data from DB API
            this.getDBData(SERVER_IP+'/DependabilityToolbox/DependabilityDatabase',projectGitName,userName,'vulnerabilityPrediction')
            .then(resp => {
                console.log("Data received")
                this.setState({
                    isLoadingVulnerability: false,
                    isProjectVisible: true,
                    vulnerabilityResults: resp.report.results,
                })
                this.updateVulnerabilityTabledData(resp.report.results)
            }).catch(error => this.setState({ error, isLoadingVulnerability: false }))
            
            // Code for fetching Security Index values to plot evolution
            this.getDBData(SERVER_IP+'/DependabilityToolbox/DependabilityDatabase',projectGitName,userName,'securityAssessment&retrieve_all=yes')
            .then(resp => {
                if (resp.projects.length > 1){
                    console.log("Data received")
                    var version_labels = []
                    var version_data = []
                    resp.projects.sort(function(a, b) {
                        return parseFloat(a.commit_timestamp) - parseFloat(b.commit_timestamp);
                    });
                    for(var i = 0; i < resp.projects.length; i++) {
                        var obj = resp.projects[i];
                        version_labels.push(i+1)
                        version_data.push(resp.projects[i].report.security_index.eval)
                    }
                    var projectHistoryIndexScoreJson = {
                        'labels': version_labels,
                        'data': version_data
                    }             
                    this.setState({
                        isLoadingSecurityEvolution: false,
                        projectHistoryIndexScore: projectHistoryIndexScoreJson,
                    })
                }else{
                    this.setState({
                        isLoadingSecurityEvolution: false,
                        projectHistoryIndexScore: {},
                    })
                }
            }).catch(error => this.setState({ error, isLoadingSecurity: false }))
        }
    }
    
    // Update table 
    updateTabledData = (data, name) => {
        var tableData = []
        
        for(var i = 0; i < data.length; i++) {
            if(data[i].propertyName === name){
                for(var j = 0; j < data[i]['issues'].length; j++) {
                    var package_name
                    if(data[i]['issues'][j]['packageName'] != undefined)
                        package_name = data[i]['issues'][j]['packageName'].includes('.') ? data[i]['issues'][j]['packageName'] : '-'
                    tableData.push({
                        'ruleName': data[i]['issues'][j]['ruleName'],
                        'ruleSetName': data[i]['issues'][j]['ruleSetName'],
                        'packageName': package_name,
                        'classPath': data[i]['issues'][j]['classPath'].split('/')[(data[i]['issues'][j]['classPath'].split('/')).length -1],
                        'lineOfCode': data[i]['issues'][j]['beginLine'],
                        'priority': data[i]['issues'][j]['priority'],
                    })
                }
            }
        }
        
        this.setState({
            projectTableData: tableData,
            projectTableSelectedProperty: name,
        })
    }
    
    // Update vulnerabilities table 
    updateVulnerabilityTabledData = (data) => {
        var tableData = []
        
        for(var i = 0; i < data.length; i++) {
            tableData.push({
                'class_name': data[i]['class_name'],
                'package': data[i]['package'],
                'sigmoid': data[i]['sigmoid'].toFixed(3),
                // 'confidence': data[i]['confidence'],
                'is_vulnerable': data[i]['is_vulnerable'],
            })
        }
        
        this.setState({
            projectVulnerabilityTableData: tableData,
        })
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
            var urlInfo = selectedProjectSession['endpoint']
            var gitNameInfo = (urlInfo.replace('.git','').split('/'))[urlInfo.split("/").length - 1]
            /*var passwordInfo = selectedProjectSession['password']
            var base64Header = {}
            if(usernameInfo !== '' && passwordInfo !== ''){
                base64Header = {'Authorization': 'Basic ' + btoa(usernameInfo + ':' + passwordInfo)}
            }
            
            var languageInfo = ''
            if(selectedProjectSession['common'] !== ''){
                var commonInfo = JSON.parse(selectedProjectSession['common']);
                if('language' in commonInfo){
                    languageInfo = commonInfo['language']
                }            
            }*/
        
            this.updateSelectedProject(nameInfo)
            this.updateProjectDataDB(nameInfo, usernameInfo, gitNameInfo)
        }
    }
    
    render(){
        const { error, isLoadingSecurity, isLoadingVulnerability, isLoadingSecurityEvolution, isProjectVisible, selectedProject, lastAnalysis, name, securityIndex, characteristics, properties, issues, vulnerabilityResults, projectTableData, projectTableSelectedProperty, projectVulnerabilityTableData, projectHistoryIndexScore } = this.state
        
        if (error) {
            return (
                <div class="alert alert-danger" role="alert">
                    {error.message}
                </div>
            )
        }
    
        if (isLoadingSecurity || isLoadingVulnerability || isLoadingSecurityEvolution) {
            return (<Loader/>)
        }
        
        if (!isProjectVisible) {
            return (
                <React.Fragment>
                    <ProjectPanel
                        myprojectName={selectedProject}
                        mylastAnalysis={lastAnalysis}
                        updateProjectData={this.updateProjectData}
                        updateSelectedProject={this.updateSelectedProject}
                    />
                </React.Fragment>
            )
        }
        
        if ( !isEmpty(projectHistoryIndexScore)) {
            return(
                <React.Fragment>
                    <ProjectPanel
                        myprojectName={selectedProject}
                        mylastAnalysis={lastAnalysis}
                        updateProjectData={this.updateProjectData}
                        updateSelectedProject={this.updateSelectedProject}
                    />
                    <SecurityIndexPanel
                        mysecurityIndexScore={securityIndex}
                    />
                    <ScoresPanel
                        mysecurityCharacteristicsScores={characteristics}
                        mysecurityPropertiesScores={properties}
                    />
                    <TablePanel
                        mySecurityIssues={issues}
                        mytableData={projectTableData}
                        mytableSelectedProperty={projectTableSelectedProperty}
                        updateTabledData={this.updateTabledData}
                    />
                    <ProjectHistoryPanel
                        myprojectHistoryIndexScore={projectHistoryIndexScore}
                    />
                    <VulnerabilityPredictionHeatmamPanel
                        myvulnerabilityPredictionResults={vulnerabilityResults}
                    />
                    <VulnerabilityPredictionTablePanel
                        myVulnerabilityTableData={projectVulnerabilityTableData}
                        updateVulnerabilityTabledData={this.updateVulnerabilityTabledData}
                    />
                </React.Fragment>
            )
        }
        
        // Code for rendering the dashboard
        return(
            <React.Fragment>
                <ProjectPanel
                    myprojectName={selectedProject}
                    mylastAnalysis={lastAnalysis}
                    updateProjectData={this.updateProjectData}
                    updateSelectedProject={this.updateSelectedProject}
                />
                <SecurityIndexPanel
                    mysecurityIndexScore={securityIndex}
                />
                <ScoresPanel
                    mysecurityCharacteristicsScores={characteristics}
                    mysecurityPropertiesScores={properties}
                />
                <TablePanel
                    mySecurityIssues={issues}
                    mytableData={projectTableData}
                    mytableSelectedProperty={projectTableSelectedProperty}
                    updateTabledData={this.updateTabledData}
                />
                <VulnerabilityPredictionHeatmamPanel
                    myvulnerabilityPredictionResults={vulnerabilityResults}
                />
                <VulnerabilityPredictionTablePanel
                    myVulnerabilityTableData={projectVulnerabilityTableData}
                    updateVulnerabilityTabledData={this.updateVulnerabilityTabledData}
                />
            </React.Fragment>
        )
    }
}

export default SecurityDashPage;