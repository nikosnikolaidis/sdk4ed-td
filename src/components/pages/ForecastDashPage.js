import React from 'react';
//import {PagePanel} from './sections/PagePanel';
import { MDBCol, MDBCard, MDBCardBody, MDBCardHeader, MDBRow, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBFormInline, MDBDataTable, MDBTable, MDBTableBody, MDBTableHead, MDBTooltip } from 'mdbreact';
import PropTypes from 'prop-types'
import Loader from './sections/Loading'
import { Line } from 'react-chartjs-2';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import heatmap from 'highcharts/modules/heatmap.js';
import treemap from 'highcharts/modules/treemap.js';
heatmap(Highcharts);
treemap(Highcharts);

const SERVER_IP = process.env.REACT_APP_FORECASTING_TOOL_SERVER_IP // Update inside .env file
const TEST_MODELS = "no"
const GROUND_TRUTH = "yes"
const DEFAULT_PROJECT_NAME = 'Apache Kafka'
const DEFAULT_PROJECT_ID = 'apache_kafka'
const DEFAULT_MODEL = 'ridge'
const DEFAULT_HORIZON = '5'
const DEFAULT_PROJECT_CLASSES = '10'

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
                beginAtZero: false,
            },
            gridLines: {
                display: true,
                color: 'rgba(0,0,0,.05)',
                drawBorder: true,
                lineWidth: 1,
            },
            scaleLabel: {
                display: true,
                labelString: 'TD Principal (in minutes)',
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

// Styling options for Table that @overrides BasicTable - Edit only for styling modifications 
class BasicTable2 extends React.Component {

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
            trend_icon = "far fa-arrow-alt-circle-up mr-2 red-text"
        }else{
            trend_icon = "far fa-arrow-alt-circle-down mr-2 green-text"
        }
        
        tableData.push({
            'horizon': forecasted[i]['x'],
            'td_Principal': forecasted[i]['y'] + ' mins (' + (forecasted[i]['y']/480).toFixed(2) + ' days)',
            'trend_cur': [<i key="cell1" className={trend_icon} aria-hidden="true"></i>, trend],
        })
    }
    return tableData
}

// Function that converts minutes to working days (8 hours) 
function convertMinutesToDays(new_data) {
    var data = new_data
    if(data !== null){
        for(var i = 0; i < data.length; i++) {
            data[i]['y'] = data[i]['y']/480
        }
    }
    return data
}

// Function that updates keys of received dict to match chartjs (x,y) format
function convertToChartJSFormat(new_dict) {
    var dict_array = []   
    for(var key in new_dict) {
        dict_array.push({
            'x': new_dict[key]['version'],
            'y': parseInt(new_dict[key]['value'])
        })
    }
    return dict_array
}

// Function to extract class-level values from json
function returnClassLevelValues(metrics_data, forecasts_data) {
    var values = []
    for(var i = 0; i < metrics_data.length; i++) {
        values.push({
            'name': Object.keys(metrics_data[i])[0],
            'value': parseFloat(forecasts_data[i][Object.keys(forecasts_data[i])][forecasts_data[i][Object.keys(forecasts_data[i])].length - 1]['value'].toFixed(2)),
            'colorValue': parseFloat(metrics_data[i][Object.keys(metrics_data[i])]['change_proneness_(CP)'].toFixed(2))
        })
    }
    return values
}

// Function that constructs Class Table data - Edit only for styling modifications 
function returnClassTableData(metrics_data, forecasts_data) {
    var tableData = []
    
    for(var i = 0; i < metrics_data.length; i++) {
        var current_td = parseFloat(metrics_data[i][Object.keys(metrics_data[i])]['td_of_last_version'].toFixed(2))
        var forecasted_td = parseFloat(forecasts_data[i][Object.keys(forecasts_data[i])][forecasts_data[i][Object.keys(forecasts_data[i])].length - 1]['value'].toFixed(2))
        var trend = (((forecasted_td - current_td) / current_td) * 100).toFixed(2)
        var trend_icon = null
        if(trend > 0){
            trend_icon = "far fa-arrow-alt-circle-up mr-2 red-text"
        }else{
            trend_icon = "far fa-arrow-alt-circle-down mr-2 green-text"
        }
        
        tableData.push({
            'class_name': Object.keys(metrics_data[i])[0],
            'change_proneness_(CP)': parseFloat(metrics_data[i][Object.keys(metrics_data[i])]['change_proneness_(CP)'].toFixed(2)),
            'change_proneness_td_(CP-TD)': parseFloat(metrics_data[i][Object.keys(metrics_data[i])]['change_proneness_td_(CP-TD)'].toFixed(2)),
            'expected_size_change_(ED-LOC)': parseFloat(metrics_data[i][Object.keys(metrics_data[i])]['expected_size_change_(ED-LOC)'].toFixed(2)),
            'expected_td_change_(ED-TD)': parseFloat(metrics_data[i][Object.keys(metrics_data[i])]['expected_td_change_(ED-TD)'].toFixed(2)),
            'current_td_value': current_td,
            'forecasted_td_value': forecasted_td,
            'trend_cur': [<i key="cell1" className={trend_icon} aria-hidden="true"></i>, trend],
        })
    }
    return tableData
}

// Function to check if an object is empty
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
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
                                <MDBDropdownItem onClick={(param) => props.updateProjectData('Apache Commons IO','apache_commonsio')}>Apache Commons IO</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateProjectData('Apache Groovy','apache_groovy')}>Apache Groovy</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateProjectData('Apache Dubbo','apache_incubator_dubbo')}>Apache Dubbo</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateProjectData('Apache Kafka','apache_kafka')}>Apache Kafka</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateProjectData('Apache NiFi','apache_nifi')}>Apache NiFi</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateProjectData('Apache OFBiz','apache_ofbiz')}>Apache OFBiz</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateProjectData('Apache SystemML','apache_systemml')}>Apache SystemML</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateProjectData('Google Guava','google_guava')}>Google Guava</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateProjectData('Openfire','igniterealtime_openfire')}>Openfire</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateProjectData('WebSocket','java_websocket')}>WebSocket</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateProjectData('Jenkins','jenkinsci_jenkins')}>Jenkins</MDBDropdownItem>
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
const TDEvolutionPanel = props => {
    
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
                    Technical Debt Evolution <MDBTooltip domElement tag="span" placement="top"><i className="fa fa-info-circle" aria-hidden="true"></i><span>Interactive plot showing the past (green) and the predicted (red) TD evolution</span></MDBTooltip>
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
const TDForecasterPanel = props => {
    
    const tableData = {
        columns: [
            {
                label: "Horizon",
                field: "horizon"
            },
            {
                label: "Forecasted TD",
                field: "td_Principal"
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
                    Technical Debt Forecasting <MDBTooltip domElement tag="span" placement="top"><i className="fa fa-info-circle" aria-hidden="true"></i><span>Interactive plot focusing solely on the forecast, giving a more fine-grained view</span></MDBTooltip>
                </MDBCardHeader>
                <MDBCardBody>
                    <Line data={dataLine} options={lineChartOptions} height={300}/>
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
            <MDBCol md="12" lg="6" className="mb-12">
                <MDBCard className="mb-12">
                <MDBCardHeader className="sdk4ed-color">
                    Technical Debt Forecasting Details <MDBTooltip domElement tag="span" placement="top"><i className="fa fa-info-circle" aria-hidden="true"></i><span>Complementary table comprising the detailed results and trends of the forecasts</span></MDBTooltip>
                </MDBCardHeader>
                <MDBCardBody>
                    <p align="left" style={{color:'#548235'}}>Current TD Principal: <span style={{color:'#000000'}}>{props.myground_truth_data[props.myground_truth_data.length - 1]['y']} mins ({(props.myground_truth_data[props.myground_truth_data.length - 1]['y']/480).toFixed(2)} days)</span></p>
                    <BasicTable data={tableData}/>
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </MDBRow>
    )
}

// The Class-Level Heatmam Panel
const ClassLevelHeatmamPanel = props => {
    
    var project_classes = props.mycurrent_project_classes
    var horizon = props.mycurrent_horizon
    var heatmapData = {
        colorAxis: {
            minColor: '#FFFFFF',
            maxColor: 'rgba(84,130,53,1)'
        },
        series: [{
            animation: false,
            type: 'treemap',
            layoutAlgorithm: 'squarified',
            data: returnClassLevelValues(props.mymetrics_class_data, props.myforecasted_class_data),
            tooltip: {
                pointFormat: '<b>Change Proneness:</b> {point.colorValue}<br><b>TD Forecast:</b> {point.value}'
            }
        }],
        title: {
            text: 'TD Prioritization Heatmap of <b>top ' + project_classes + ' classes</b> ranked by Change Proneness (CP)<br><div style="font-size: small">Size: future TD value for ' + horizon + ' versions ahead | </div><div style="font-size: small">Color: Change Proneness</div>'
        }
    }
    
    if (isEmpty(props.mymetrics_class_data)){return null}

    return (
        <MDBRow className="mb-4">
            <MDBCol md="12" lg="12" className="mb-12">
                <MDBCard className="mb-12">
                <MDBCardHeader className="sdk4ed-color">TD Prioritization Heatmap <MDBTooltip domElement tag="span" placement="top"><i className="fa fa-info-circle" aria-hidden="true"></i><span>Heat map visualizing the future value of the TD Principal and the change proneness of the selected classes</span></MDBTooltip></MDBCardHeader>
                <MDBCardBody>
                    <HighchartsReact highcharts={Highcharts} options={heatmapData} immutable = {true} />
                    
                    <MDBFormInline className="md-form m-0 justify-content-center">
                        <MDBDropdown>
                            <MDBDropdownToggle caret className="white-text" color="  light-green darken-4">
                                Classes
                            </MDBDropdownToggle>
                            <MDBDropdownMenu basic>
                                <MDBDropdownItem onClick={(param) => props.updateClassData('5')}>5 classes</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateClassData('10')}>10 classes</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateClassData('20')}>20 classes</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateClassData('30')}>30 classes</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateClassData('40')}>40 classes</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateClassData('50')}>50 classes</MDBDropdownItem>
                            </MDBDropdownMenu>
                        </MDBDropdown>
                        <h4 style={{color:'#548235'}}>{props.mycurrent_project_classes}</h4>
                    </MDBFormInline>
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </MDBRow>
    )
}

// The Class-Level Table Panel
const ClassLevelTablePanel = props => {
    
    var tableData = {
        columns: [
            {
                'label': 'Class Name',
                'field': 'class_name'
            },
            {
                'label': 'Change Proneness (CP)',
                'field': 'change_proneness_(CP)',
                'sort': 'dsc'
            },
            {
                'label': 'TD Change Proneness (CPTD)',
                'field': 'change_proneness_td_(CP-TD)'
            },
            {
                'label': 'Expected Size Change (E[DLOC])',
                'field': 'expected_size_change_(ED-LOC)'
            },
            {
                'label': 'Expected TD Change (E[DTD])',
                'field': 'expected_td_change_(ED-TD)'
            },
            {
                'label': 'Current TD Value',
                'field': 'current_td_value'
            },
            {
                'label': 'Forecasted TD Value',
                'field': 'forecasted_td_value'
            },
            {
                'label': 'TD Trend %',
                'field': 'trend_cur'
            },
        ],
        rows: returnClassTableData(props.mymetrics_class_data, props.myforecasted_class_data)
    }
    
    if (isEmpty(props.mymetrics_class_data)){return null}
     
    return (
        <MDBRow className="mb-4">
            <MDBCol md="12" lg="12" className="mb-12">
                <MDBCard className="mb-12">
                <MDBCardHeader className="sdk4ed-color">TD Prioritization Table <MDBTooltip domElement tag="span" placement="top"><i className="fa fa-info-circle" aria-hidden="true"></i><span>Table containing TD forecasting and change proneness supplementary metrics of the selected classes</span></MDBTooltip></MDBCardHeader>
                <MDBCardBody>
                    <BasicTable2 data={tableData} /> 
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </MDBRow>
    )
}

class TDDashPage extends React.Component {
    
    constructor(props){
        super(props);
        
        // Initialize state here. Now hardcoded values are assigned (should be :null otherwise)
        this.state = {
            is_loading: true,
            is_loading_class: true,
            error: null,
            error_class: null,
            project_name: '',
            project_id: '',
            project_name_session: '',
            project_id_session: '',
            ground_truth_data: {},
            forecasted_data: {},
            ground_truth_class_data: {},
            forecasted_class_data: {},
            metrics_class_data: {},
            current_algorithm: '',
            current_horizon: '',
            current_project_classes: '',
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
    
    // Perform GET call
    getClassLevelData(url, horizon, project, project_classes, regressor, ground_truth, test) {
        // Default options are marked with *
        return fetch(url+'?horizon='+horizon+'&project='+project+'&project_classes='+project_classes+'&regressor='+regressor+'&ground_truth='+ground_truth+'&test='+test, {
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
            is_loading_class: true,
            error: null,
            error_class: null,
        });
        
        // Code for fetching json data from API
        this.getData(SERVER_IP+'/ForecasterToolbox/TDForecasting',DEFAULT_HORIZON,project_id,DEFAULT_MODEL,GROUND_TRUTH,TEST_MODELS)
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
        
        // Code for fetching json data from API
        this.getClassLevelData(SERVER_IP+'/ForecasterToolbox/TDClassLevelForecasting',DEFAULT_HORIZON,project_id,DEFAULT_PROJECT_CLASSES,DEFAULT_MODEL,GROUND_TRUTH,TEST_MODELS)
        .then(resp => {
            if (resp.status === 200) {
                console.log("Data received")
                
                this.setState({
                    is_loading_class: false,
                    ground_truth_class_data: resp.results.ground_truth,
                    forecasted_class_data: resp.results.forecasts,
                    metrics_class_data: resp.results.change_metrics,
                    current_project_classes: resp.results.parameters.classes,
                })
            } else {
                console.log(resp.message)
                
                this.setState({
                    is_loading_class: false,
                    error_class: resp,
                    current_project_classes: DEFAULT_PROJECT_CLASSES,
                })
            }
        }).catch(error_class => this.setState({ error_class, is_loading_class: false }))
    }
    
    // Update forecasts 
    updateForecastedData = (new_algorithm, new_horizon) => {
        this.setState({ 
            is_loading: true,
            is_loading_class: true,
            error: null,
            error_class: null,
        });
        
        const { project_id, current_algorithm, current_horizon, current_project_classes } = this.state
        
        if(new_algorithm === undefined){new_algorithm = current_algorithm}
        if(new_horizon === undefined){new_horizon = current_horizon}
        
        // Code for fetching json data from API
        this.getData(SERVER_IP+'/ForecasterToolbox/TDForecasting',new_horizon,project_id,new_algorithm,GROUND_TRUTH,TEST_MODELS)
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
        
        // Code for fetching json data from API
        this.getClassLevelData(SERVER_IP+'/ForecasterToolbox/TDClassLevelForecasting',new_horizon,project_id,current_project_classes,new_algorithm,GROUND_TRUTH,TEST_MODELS)
        .then(resp => {
            if (resp.status === 200) {
                console.log("Data received")
                
                this.setState({
                    is_loading_class: false,
                    ground_truth_class_data: resp.results.ground_truth,
                    forecasted_class_data: resp.results.forecasts,
                    metrics_class_data: resp.results.change_metrics,
                })
            } else {
                console.log(resp.message)
                
                this.setState({
                    is_loading_class: false,
                    error_class: resp,
                })
            }
        }).catch(error_class => this.setState({ error_class, is_loading_class: false }))
    }
    
    // Update classes 
    updateClassData = (new_project_classes) => {
        this.setState({ 
            is_loading_class: true,
            error_class: null,
        });
        
        const { project_id, current_algorithm, current_horizon, current_project_classes } = this.state
                
        // Code for fetching json data from API
        this.getClassLevelData(SERVER_IP+'/ForecasterToolbox/TDClassLevelForecasting',current_horizon,project_id,new_project_classes,current_algorithm,GROUND_TRUTH,TEST_MODELS)
        .then(resp => {
            if (resp.status === 200) {
                console.log("Data received")
                
                this.setState({
                    is_loading_class: false,
                    ground_truth_class_data: resp.results.ground_truth,
                    forecasted_class_data: resp.results.forecasts,
                    metrics_class_data: resp.results.change_metrics,
                    current_project_classes: resp.results.parameters.classes,
                })
            } else {
                console.log(resp.message)
                
                this.setState({
                    is_loading_class: false,
                    error_class: resp,
                    current_project_classes: new_project_classes,
                })
            }
        }).catch(error_class => this.setState({ error_class, is_loading_class: false }))
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
            
            // If selected project has forecaster metadata filled then use these data as project ID
            if (selectedProjectSession['forecaster'] !== ''){
                // get project_id from forecaster metadata
                var selectedProjectSessionMeta = JSON.parse(selectedProjectSession['forecaster'])
                var selectedProjectID = selectedProjectSessionMeta['name_in_td_toolbox']
            // If selected project has no forecaster metadata filled then use git url to extract project ID
            }else{
                // get project_id as user_name:project_name
                var selectedProjectID = (selectedProjectURL.split('/'))[selectedProjectURL.split("/").length - 2]+':'+(selectedProjectURL.replace('.git','').split('/'))[selectedProjectURL.split("/").length - 1]
            } 
            
            this.updateProjectData(selectedProjectName, selectedProjectID)
                
            this.setState({ 
                project_name_session: selectedProjectName,
                project_id_session: selectedProjectID,
            })
        }
    }

    render(){
        const { error, error_class, is_loading, is_loading_class, project_name, project_id, project_name_session, project_id_session, ground_truth_data, forecasted_data, current_algorithm, current_horizon, current_project_classes, ground_truth_class_data, forecasted_class_data, metrics_class_data } = this.state
        
        if(is_loading){
            return (<Loader/>)
        }
        
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
        
        if(error_class) {
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
                    <TDEvolutionPanel 
                        myground_truth_data={ground_truth_data} 
                        myforecasted_data={forecasted_data}
                    />
                    <TDForecasterPanel 
                        myground_truth_data={ground_truth_data} 
                        myforecasted_data={forecasted_data}
                    />
                    <div class="alert alert-info" role="alert">
                        {error_class.message.substr(error_class.message.indexOf('.')+1)}
                    </div>
                </React.Fragment>
            )
        }
        
        if(is_loading_class){
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
                    <TDEvolutionPanel 
                        myground_truth_data={ground_truth_data} 
                        myforecasted_data={forecasted_data}
                    />
                    <TDForecasterPanel 
                        myground_truth_data={ground_truth_data} 
                        myforecasted_data={forecasted_data}
                    />
                    <Loader/>
                </React.Fragment>
            )
        }
        
        // Code for rendering the dashboard
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
                <TDEvolutionPanel 
                    myground_truth_data={ground_truth_data} 
                    myforecasted_data={forecasted_data}
                />
                <TDForecasterPanel 
                    myground_truth_data={ground_truth_data} 
                    myforecasted_data={forecasted_data}
                />
                <ClassLevelHeatmamPanel 
                    myground_truth_class_data={ground_truth_class_data} 
                    myforecasted_class_data={forecasted_class_data}
                    mymetrics_class_data={metrics_class_data}
                    mycurrent_project_classes={current_project_classes}
                    mycurrent_horizon={current_horizon}
                    updateClassData={this.updateClassData}
                />
                <ClassLevelTablePanel 
                    mycurrent_project_classes={current_project_classes}
                    myground_truth_class_data={ground_truth_class_data} 
                    myforecasted_class_data={forecasted_class_data}
                    mymetrics_class_data={metrics_class_data}
                />
            </React.Fragment>
        )
    }
}

export default TDDashPage;