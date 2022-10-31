import React from 'react';
//import {PagePanel} from './sections/PagePanel';
import { MDBCol, MDBCard, MDBCardBody, MDBCardHeader, MDBRow, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBFormInline, MDBTable, MDBTableBody, MDBTableHead, MDBTooltip } from 'mdbreact';
import PropTypes from 'prop-types'
import Loader from './sections/Loading'
import { Line } from 'react-chartjs-2';

const SERVER_IP = process.env.REACT_APP_FORECASTING_TOOL_SERVER_IP // Update inside .env file
const TEST_MODELS = "no"
const GROUND_TRUTH = "yes"
const DEFAULT_PROJECT_NAME = 'Square Retrofit'
const DEFAULT_PROJECT_ID = 'square_retrofit'
const DEFAULT_MODEL = 'ridge'
const DEFAULT_HORIZON = '5'

// Styling options for LineChart - Edit only for styling modifications 
const lineChartOptions = {
    scales: {
        xAxes: [{
            type: 'linear',
            display: true,
            ticks: {
                precision: 0,
            },
            gridLines: {
                display: true,
                color: 'rgba(0,0,0,.05)',
                drawBorder: true,
                lineWidth: 1,
            },
            scaleLabel: {
                display: true,
                labelString: 'Commit',
                fontSize: 14,
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
                fontSize: 14,
            },
        }]
    },
    //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio     : false,
    //Boolean - whether to make the chart responsive to window resizing
    responsive              : true,
    // Container for pan options
    pan: {
        // Boolean to enable panning
        enabled: false,

        // Panning directions. Remove the appropriate direction to disable
        // Eg. 'y' would only allow panning in the y direction
        mode: 'x',
        rangeMin: {
            // Format of min pan range depends on scale type
            x: null,
            y: null
        },
        rangeMax: {
            // Format of max pan range depends on scale type
            x: null,
            y: null
        },
        // Function called once panning is completed
        // Useful for dynamic data loading
        // onPan: function({chart}) { console.log(`I was panned!!!`); }
    },

    // Container for zoom options
    zoom: {
        // Boolean to enable zooming
        enabled: false,

        // Enable drag-to-zoom behavior
        drag: false,

        // Drag-to-zoom rectangle style can be customized
        // drag: {
        // 	 borderColor: 'rgba(225,225,225,0.3)'
        // 	 borderWidth: 5,
        // 	 backgroundColor: 'rgb(225,225,225)'
        // },

        // Zooming directions. Remove the appropriate direction to disable
        // Eg. 'y' would only allow zooming in the y direction
        mode: 'xy',

        rangeMin: {
            // Format of min zoom range depends on scale type
            x: null,
            y: null
        },
        rangeMax: {
            // Format of max zoom range depends on scale type
            x: null,
            y: null
        },

        // Speed of zoom via mouse wheel
        // (percentage of zoom on a wheel event)
        speed: 0.1,

        // Function called once zooming is completed
        // Useful for dynamic data loading
        // onZoom: function({chart}) { console.log(`I was zoomed!!!`); }
    }
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
            header.push(<th key={uniqueId++}><b>{data.columns[h]['label']}</b></th>)

        return(
            <MDBTable striped small bordered responsive hover maxHeight="31vh">
            <MDBTableHead><tr>{header}</tr></MDBTableHead>
            <MDBTableBody>{rows}</MDBTableBody>
            </MDBTable>
        )
    }
}

// Function that constructs Data object of forecasted values - Edit only for styling modifications 
function returnNewForecastDataObject(new_data) {
    var newDataObject = {
        label                     : 'Forecast',
        // line
        fill                      : true,
        lineTension               : 0.5,
        borderWidth               : 2,
        borderColor               : 'rgba(245,105,84,1)',
        backgroundColor           : 'rgba(245,105,84,0.05)',
        // point
        pointRadius               : 0.3,
        pointHitRadius            : 4,
        pointBackgroundColor      : 'rgba(245,105,84,1)',
        pointBorderColor          : 'rgba(245,105,84,1)',
        pointHoverBackgroundColor : '#fff',
        pointHoverBorderColor     : 'rgba(245,105,84,1)',
        // data
        data: new_data
    };
    return newDataObject;
}

// Function that constructs Data object of ground truth values - Edit only for styling modifications 
function returnNewRealDataObject(new_data) {
    var newDataObject = {
        label: 'Real',
        // line
        fill                      : true,
        lineTension               : 0,
        borderWidth               : 2,
        borderColor               : 'rgba(84,130,53,1)',
        backgroundColor           : 'rgba(84,130,53,0.05)',
        // point
        pointRadius               : 0.3,
        pointHitRadius            : 4,
        pointBackgroundColor      : 'rgba(84,130,53,1)',
        pointBorderColor          : 'rgba(84,130,53,1)',
        pointHoverBackgroundColor : '#fff',
        pointHoverBorderColor     : 'rgba(84,130,53,1)',
        // data
        data: new_data
    };
    return newDataObject;
}

// Function that constructs Table data - Edit only for styling modifications 
function returnTableData(real, forecasted) {
    var tableData = []
    
    for(var i = 0; i < forecasted.length; i++) {
        var trend = (((forecasted[i]['y'] - real[forecasted[0]['x'] - 2]['y']) / real[forecasted[0]['x'] - 2]['y']) * 100).toFixed(2)
        var trend_icon = null
        if(trend > 0){
            trend_icon = "far fa-arrow-alt-circle-up mr-2 green-text"
        }else{
            trend_icon = "far fa-arrow-alt-circle-down mr-2 red-text"
        }
        
        tableData.push({
            'horizon': forecasted[i]['x'],
            'security_index': forecasted[i]['y'],
            'trend_cur': [<i key="cell1" className={trend_icon} aria-hidden="true"></i>, trend],
        })
    }
    return tableData
}

// Function that updates keys of received dict to match chartjs (x,y) format
function convertToChartJSFormat(new_dict) {
    var dict_array = []   
    for(var key in new_dict) {
        dict_array.push({
            'x': new_dict[key]['version'],
            'y': parseFloat(new_dict[key]['value']).toFixed(3)
        })
    }
    return dict_array
}

// The Configuration Panel
const ConfigurationPanel = props => {
    
    return (
        <MDBRow className="mb-4">
            <MDBCol md="12" lg="6" className="mb-12">
                <MDBCard className="mb-12">
                <MDBCardHeader className="sdk4ed-color">Project</MDBCardHeader>
                <MDBCardBody>
                    <MDBFormInline className="md-form m-0">
                        <MDBDropdown>
                            <MDBDropdownToggle caret className="white-text" color="  light-green darken-4">
                                Project
                            </MDBDropdownToggle>
                            <MDBDropdownMenu basic>
                                <MDBDropdownItem onClick={(param) => props.updateProjectData(props.myproject_name_session,props.myproject_id_session)}>{props.myproject_name_session}</MDBDropdownItem>
                                <MDBDropdownItem divider></MDBDropdownItem>
                                <MDBDropdownItem header>Examples</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateProjectData('Apache Dubbo','apache_incubator_dubbo')}>Apache Dubbo</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateProjectData('Google Guava','google_guava')}>Google Guava</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateProjectData('WebSocket','java_websocket')}>WebSocket</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateProjectData('Spring Boot','spring-projects_spring-boot')}>Spring Boot</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateProjectData('Square OkHttp','square_okhttp')}>Square OkHttp</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateProjectData('Square Retrofit','square_retrofit')}>Square Retrofit</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateProjectData('ZXing','zxing_zxing')}>ZXing</MDBDropdownItem>
                            </MDBDropdownMenu>
                        </MDBDropdown>
                        <h4 style={{color:'#548235'}}>{props.myproject_name}</h4>
                    </MDBFormInline>
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
            {/*
            <MDBCol md="12" lg="4" className="mb-12">
                <MDBCard className="mb-12">
                <MDBCardHeader className="sdk4ed-color">Forecasting Algorithm</MDBCardHeader>
                <MDBCardBody>
                    <MDBFormInline className="md-form m-0">
                        <MDBDropdown>
                            <MDBDropdownToggle caret className="white-text" color="  light-green darken-4">
                                Algorithm
                            </MDBDropdownToggle>
                            <MDBDropdownMenu basic>
                                <MDBDropdownItem onClick={(param) => props.updateForecastedData('mlr',undefined)}>MLR</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecastedData('lasso',undefined)}>Lasso</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecastedData('ridge',undefined)}>Ridge</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecastedData('svr_linear',undefined)}>SVR(linear)</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecastedData('svr_rbf',undefined)}>SVR(rbf)</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecastedData('random_forest',undefined)}>Random Forest</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecastedData('arima',undefined)}>ARIMA</MDBDropdownItem>
                                <MDBDropdownItem divider />
                                <MDBDropdownItem onClick={(param) => props.updateForecastedData('auto',undefined)}>Auto</MDBDropdownItem>
                            </MDBDropdownMenu>
                        </MDBDropdown>
                        <h4 style={{color:'#548235'}}>{props.mycurrent_algorithm}</h4>
                    </MDBFormInline> 
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
            */}
            <MDBCol md="12" lg="6" className="mb-12">
                <MDBCard className="mb-12">
                <MDBCardHeader className="sdk4ed-color">Forecasting Horizon</MDBCardHeader>
                <MDBCardBody>
                    <MDBFormInline className="md-form m-0">
                        <MDBDropdown>
                            <MDBDropdownToggle caret className="white-text" color="  light-green darken-4">
                                Horizon
                            </MDBDropdownToggle>
                            <MDBDropdownMenu basic>
                                <MDBDropdownItem onClick={(param) => props.updateForecastedData(undefined,'1')}>1 version</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecastedData(undefined,'5')}>5 versions</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecastedData(undefined,'10')}>10 versions</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecastedData(undefined,'15')}>15 versions</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecastedData(undefined,'20')}>20 versions</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecastedData(undefined,'25')}>25 versions</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecastedData(undefined,'30')}>30 versions</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecastedData(undefined,'35')}>35 versions</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecastedData(undefined,'40')}>40 versions</MDBDropdownItem>
                            </MDBDropdownMenu>
                        </MDBDropdown>
                        <h4 style={{color:'#548235'}}>{props.mycurrent_horizon}</h4>
                    </MDBFormInline>
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </MDBRow>
    )
}

// The Evolution Panel
const SecurityEvolutionPanel = props => {

    const dataLine = {
        datasets: [
            returnNewRealDataObject(props.myground_truth_data),
            returnNewForecastDataObject(props.myforecasted_data)
        ]
    }
    
    return (
        <MDBRow className="mb-4">
            <MDBCol md="12" lg="12" className="mb-12">
                <MDBCard className="mb-12">
                <MDBCardHeader className="sdk4ed-color">
                    Security Index Evolution <MDBTooltip domElement tag="span" placement="top"><i className="fa fa-info-circle" aria-hidden="true"></i><span>Interactive plot showing the past (green) and the predicted (red) Security Index evolution</span></MDBTooltip>
                </MDBCardHeader>
                <MDBCardBody>
                    <Line data={dataLine} options={lineChartOptions} height={500}/>
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </MDBRow>
    )
}

// The Forecaster Panel
const SecurityForecasterPanel = props => {
    
    const tableData = {
        columns: [
            {
                label: "Horizon",
                field: "horizon"
            },
            {
                label: "Forecasted Security Index",
                field: "security_index"
            },
            {
                label: "Trend %",
                field: "trend_cur"
            }
        ],
        rows: returnTableData(props.myground_truth_data, props.myforecasted_data)
    }

    const dataLine = {
        datasets: [
            returnNewForecastDataObject(props.myforecasted_data)
        ]
    }
    
    return (
        <MDBRow className="mb-4">
            <MDBCol md="12" lg="6" className="mb-12">
                <MDBCard className="mb-12">
                <MDBCardHeader className="sdk4ed-color">
                    Security Index Forecasting <MDBTooltip domElement tag="span" placement="top"><i className="fa fa-info-circle" aria-hidden="true"></i><span>Interactive plot focusing solely on the forecast, giving a more fine-grained view</span></MDBTooltip>
                </MDBCardHeader>
                <MDBCardBody>
                    <Line data={dataLine} options={lineChartOptions} height={300}/>
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
            <MDBCol md="12" lg="6" className="mb-12">
                <MDBCard className="mb-12">
                <MDBCardHeader className="sdk4ed-color">
                    Security Index Forecasting Details <MDBTooltip domElement tag="span" placement="top"><i className="fa fa-info-circle" aria-hidden="true"></i><span>Complementary table comprising the detailed results and trends of the forecasts</span></MDBTooltip>
                </MDBCardHeader>
                <MDBCardBody>
                    <p align="left" style={{color:'#548235'}}>Current Security Index: <span style={{color:'#000000'}}>{props.myground_truth_data[props.myground_truth_data.length - 1]['y']}</span></p>
                    <BasicTable data={tableData}/>
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
            is_loading: true,
            error: null,
            project_name: '',
            project_id: '',
            project_name_session: '',
            project_id_session: '',
            ground_truth_data: {},
            forecasted_data: {},
            current_algorithm: '',
            current_horizon: '',
        }
    }
    
    // Perform GET call
    getData(url, horizon, project, regressor, ground_truth, test) {
        // Default options are marked with *
        return fetch(url+'?horizon='+horizon+'&project='+project+'&regressor='+regressor+'&ground_truth='+ground_truth+'&test='+test, {
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
    
    // Update project 
    updateProjectData = (project_name, project_id) => {
        this.setState({ 
            is_loading: true,
            error: null,
        });
        
        // Code for fetching json data from API
        this.getData(SERVER_IP+'/ForecasterToolbox/DependabilityForecasting',DEFAULT_HORIZON,project_id,DEFAULT_MODEL,GROUND_TRUTH,TEST_MODELS)
        .then(resp => {
            if (resp.status === 200) {
                console.log("Data received")
                
                this.setState({
                    is_loading: false,
                    project_name: project_name,
                    project_id: project_id,
                    ground_truth_data: convertToChartJSFormat(resp.results.ground_truth),
                    forecasted_data:  convertToChartJSFormat(resp.results.forecasts),
                    current_algorithm: resp.results.parameters.regressor,
                    current_horizon: resp.results.parameters.horizon,
                })
            } else {
                console.log(resp.message)
                
                this.setState({
                    is_loading: false,
                    error: resp,
                    current_algorithm: DEFAULT_MODEL,
                    current_horizon: DEFAULT_HORIZON,
                })
            }
        }).catch(error => this.setState({ error, is_loading: false }))
    }
    
    // Update forecasts 
    updateForecastedData = (new_algorithm, new_horizon) => {
        this.setState({ 
            is_loading: true,
            error: null,
        });
        
        const { project_id, current_algorithm, current_horizon } = this.state
        
        if(new_algorithm === undefined){new_algorithm = current_algorithm}
        if(new_horizon === undefined){new_horizon = current_horizon}
        
        // Code for fetching json data from API
        this.getData(SERVER_IP+'/ForecasterToolbox/DependabilityForecasting',new_horizon,project_id,new_algorithm,GROUND_TRUTH,TEST_MODELS)
        .then(resp => {
            if (resp.status === 200) {
                console.log("Data received")
                
                this.setState({
                    is_loading: false,
                    ground_truth_data: convertToChartJSFormat(resp.results.ground_truth),
                    forecasted_data: convertToChartJSFormat(resp.results.forecasts),
                    current_algorithm: resp.results.parameters.regressor,
                    current_horizon: resp.results.parameters.horizon,
                })
            } else {
                console.log(resp.message)
                
                this.setState({
                    is_loading: false,
                    error: resp,
                    current_algorithm: new_algorithm,
                    current_horizon: new_horizon,
                })
            }
        }).catch(error => this.setState({ error, is_loading: false }))
    }
    
    // Read data from session storage
    componentDidMount(){
        // If no project is selected from the project panel then display an open-source project
        if (sessionStorage.getItem('selected_project') === null){
            this.updateProjectData(DEFAULT_PROJECT_NAME, DEFAULT_PROJECT_ID)
        // If project is selected from the project panel
        }else{
            // Parse session storage
            var selectedProjectSession = JSON.parse(sessionStorage.getItem('selected_project'))
            // Read Project Name
            var selectedProjectName = selectedProjectSession['name']
            // Read Project URL
            var selectedProjectURL = selectedProjectSession['endpoint']
            // Read User Name
            var selectedUserName = ''
            if (selectedProjectSession['username'] !== ''){
                selectedUserName = selectedProjectSession['username']
            }

            // If selected project has forecaster metadata filled then use these data as project ID
            if (selectedProjectSession['forecaster'] !== ''){
                // get project_id from forecaster metadata
                var selectedProjectSessionMeta = JSON.parse(selectedProjectSession['forecaster'])
                var selectedProjectID = selectedProjectSessionMeta['name_in_dependability_toolbox']
            // If selected project has no forecaster metadata filled then use git url to extract project ID
            }else{
                // get project_id as user_name:project_name
                var selectedProjectID = selectedUserName+':'+(selectedProjectURL.replace('.git','').split('/'))[selectedProjectURL.split("/").length - 1]
            } 
            
            this.updateProjectData(selectedProjectName, selectedProjectID)
                
            this.setState({ 
                project_name_session: selectedProjectName,
                project_id_session: selectedProjectID,
            })
        }
    }
    
    render(){
        const { error, is_loading, project_name, project_id, project_name_session, project_id_session, ground_truth_data, forecasted_data, current_algorithm, current_horizon } = this.state
        
        if (error) {
            return (
                <React.Fragment>
                    <ConfigurationPanel
                        myproject_name={project_name}
                        myproject_id={project_id}
                        myproject_name_session={project_name_session}
                        myproject_id_session={project_id_session}
                        mycurrent_algorithm={current_algorithm}
                        mycurrent_horizon={current_horizon}
                        updateForecastedData={this.updateForecastedData}
                        updateProjectData={this.updateProjectData}
                    />
                    <div class="alert alert-danger" role="alert">
                        {error.message.substr(error.message.indexOf('.')+1)}
                    </div>
                </React.Fragment>
            )
        }
        
        if(is_loading){
            return (<Loader/>)
        }
        
        return(
            <React.Fragment>
                <ConfigurationPanel
                    myproject_name={project_name}
                    myproject_id={project_id}
                    myproject_name_session={project_name_session}
                    myproject_id_session={project_id_session}
                    mycurrent_algorithm={current_algorithm}
                    mycurrent_horizon={current_horizon}
                    updateForecastedData={this.updateForecastedData}
                    updateProjectData={this.updateProjectData}
                />
                <SecurityEvolutionPanel 
                    myground_truth_data={ground_truth_data} 
                    myforecasted_data={forecasted_data}
                />
                <SecurityForecasterPanel 
                    myground_truth_data={ground_truth_data} 
                    myforecasted_data={forecasted_data}
                />
            </React.Fragment>
        )
    }
}

export default SecurityDashPage;