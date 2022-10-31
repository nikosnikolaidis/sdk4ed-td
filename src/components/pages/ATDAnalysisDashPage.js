import React, { Component } from 'react';
import Select from 'react-select';
import {
    MDBCol,
    MDBRow,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBDropdown,
    MDBDropdownToggle,
    MDBCardHeader, MDBCardBody, MDBCard, MDBTable, MDBTableHead, MDBTableBody
} from 'mdbreact';
import {Line} from "react-chartjs-2";
import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';
import Loader from './sections/Loading';

const SERVER_IP = process.env.REACT_APP_ATD_TOOL_SERVER_IP

class SystemViewer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            hasMore: true,
            isLoading: false,
            modal: false,
            project: null,
            smells: [],
            versions: {},
            components: [], 
            smellTypes: ["Cyclic Dependency", "Unstable Dependency", 
                        "Hublike Dependency", "God Component"],
            smellColours: ["rgba(55,43,96,1)", "rgba(235,94,85,1)", 
                        "rgba(98,195,112,1)", "rgba(242,220,93,1)"],
            pageOffset: 0,
            pageCountSmells: 0,
            perPage: 3
        };
    }

    handleProjectChange = (project) => {
        this.loadData(project)
    }

    loadData(project){
        var url = SERVER_IP + "/system?system="+project
        console.log("Requesting data for " + project + " " + url)
        fetch(url)
            .then(res => res.json())
            .then(system => {
                console.log("Data for project " + project + " retrieved")
                this.setState( {
                    project: project,
                    smells: system.system.smells, 
                    versions: system.system.versions, 
                    components: system.system.components,
                    pageCountSmells: system.system.smells.length / 10,
                    error: null,
                });
            }).catch(e => console.log("Error while retrieving data: " + e));
    }

    createPlots() {
        const smellCount = {};
        this.state.smellTypes.forEach(t => {
            smellCount[t] = {}
            Object.keys(this.state.versions).forEach(v => smellCount[t][v] = 0)
        });
        for(const smell of this.state.smells){
            for(const version of smell.spanningVersions) {
                smellCount[smell.type][version] += 1;
            }
        }
        const dataLine = { labels: Object.keys(this.state.versions), datasets:[]}
        this.state.smellTypes.forEach((t, index) => {
            var dataset = {
                label: t, // series name
                fill: false,
                pointStrokeColor: 'rgba(38,84,124,1)',
                pointHighlightFill: 'rgba(38,84,124,1)',
                pointHighlightStroke: 'rgba(38,84,124,1)',
                lineTension: 0.3,
                backgroundColor: this.state.smellColours[index],
                borderColor: this.state.smellColours[index],
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: '#467a39',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: this.state.smellColours[index],
                pointHoverBorderColor: '#121212',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: Object.values(smellCount[t]) // series data
            }
            dataLine.datasets.push(dataset);
        })
        return dataLine;
    }

    handlePageClick = data => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);
        this.setState({ pageOffset: offset });
    };

    getSessionProject(){
        let storedProject = sessionStorage.getItem('selected_project');
        if (storedProject == null){
            return null;
        }
        let storedProjectJson = JSON.parse(storedProject);
        return storedProjectJson;
    }


    async getProjectsListAsync(){
        var url = SERVER_IP + "/projects";
        var response = await fetch(url);
        var responseJson = await response.json();
        return responseJson.projects;
    }

    getProjectNameFromEndpoint(endpoint){
        let slashIndex = endpoint.lastIndexOf("/")
        if(endpoint.endsWith("/")){
            endpoint = endpoint.substring(0, slashIndex)
            slashIndex = endpoint.lastIndexOf("/");
        }
        if(endpoint.endsWith(".git")){
            endpoint = endpoint.substring(0, endpoint.lastIndexOf(".git"));
        }
        return slashIndex == -1 ? null : endpoint.substring(slashIndex + 1)
    }

    componentDidMount(){
        let sessionProject = this.getSessionProject();
        if(sessionProject != null && sessionProject['endpoint'] != null){
            this.getProjectsListAsync()
            .then(projectList => {
                var projectEndpoint = sessionProject['endpoint'];
                var projectName = this.getProjectNameFromEndpoint(projectEndpoint)
                if(projectName != null && projectList != null && projectList.includes(projectName)){
                    this.loadData(projectName);
                }else{
                    this.setState({
                        error: {message: 'The selected project \''+projectName+'\' was not analysed with the ATD toolbox.'}
                    })
                }
            });            
        }else{
            this.setState({
                error: {message: 'No project selected. Please select a project from the "Projects" panel and retry'}
            })
        }
    }

    render(){
        if(this.state.error){
            return (
                <div class="alert alert-danger" role="alert">
                    { this.state.error.message }
                </div>
            )
        }else if(this.state.project == null){
            return( <Loader/> )
        }else {
            return (
                <React.Fragment>
                <MDBRow>
                    <MDBCol md="8">
                        <MDBCard>
                            <MDBCardHeader  className="sdk4ed-color">Project: {this.state.project}</MDBCardHeader>
                            <MDBCardBody>
                                <MDBCard style={{marginBottom: 5}}>
                                    <MDBCardHeader>Number of Architectural smells over time by type</MDBCardHeader>
                                    <MDBCardBody>
                                        <Line data={this.createPlots()} height={100}  />
                                    </MDBCardBody>
                                </MDBCard>
                                <div>
                                <SmellList perPage={this.state.perPage} offset={this.state.pageOffset} smells={this.state.smells}/>
                                <ReactPaginate
                                    previousLabel={'previous'}
                                    nextLabel={'next'}
                                    breakLabel={'...'}
                                    pageCount={this.state.pageCountSmells}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    onPageChange={this.handlePageClick}
                                    subContainerClassName={'pages pagination'}
                                    activeClassName={'active'}
                                    breakClassName={'page-item'}
                                    breakLinkClassName={'page-link'}
                                    containerClassName={'pagination'}
                                    pageClassName={'page-item'}
                                    pageLinkClassName={'page-link'}
                                    previousClassName={'page-item'}
                                    previousLinkClassName={'page-link'}
                                    nextClassName={'page-item'}
                                    nextLinkClassName={'page-link'}
                                    activeClassName={'active'}
                                    />
                                    </div>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
                </React.Fragment>
            )
        }
    }
}

class SmellList extends Component{

    static propTypes = {
        smells: PropTypes.array.isRequired,
        offset: PropTypes.number.isRequired,
        perPage: PropTypes.number.isRequired
      };

    constructor(props){
        super(props);
    }

    render(){
        let filteredSmells = this.props.smells.filter((s, index) => index >= this.props.offset && index <= this.props.offset + this.props.perPage);
        let smellNodes = filteredSmells.map((smell, index) => (
            <Smell
                key = {index}
                id={smell.id}
                characteristics={smell.characteristics}
                spanningVersions={smell.spanningVersions}
                age={smell.age}
                firstVersionAppeared={smell.firstVersionAppeared}
                firstDateAppeared={smell.firstDateAppeared}
                lastVersionDetected={smell.lastVersionDetected}
                lastDateDetected={smell.lastDateDetected}
                affectedComponents={smell.affectedComponents}
                type={smell.type}
                first={smell.first}
                last={smell.last}
            />
        ));
        return (<div id="system-smells" className="smellsList">{smellNodes}</div>)
    }
}

class Smell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };

    }

    toggle() {
        this.setState({
            open: !this.state.open
        });
    }

    render() {
        return (
            <MDBCard style={{marginBottom: 5}}>
                <MDBCardBody className="w-100">
                        <MDBRow className="w-100" style={{marginTop: 5}}>
                            <MDBCol className="w-100" style={{backgroundColor: "white", padding: 5}}>
                                <MDBTable bordered striped>
                                    <MDBTableHead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Type</th>
                                            <th>Age</th>
                                            <th>Affects</th>
                                            <th>Commit first appeared (Date)</th>
                                            <th>Commit last detected (Date)</th>
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody>
                                        <tr>
                                            <td className="font-weight-bold">{this.props.id}</td>
                                            <td>{this.props.type}</td>
                                            <td>{this.props.age}</td>
                                            <td>{this.props.characteristics[Object.keys(this.props.characteristics)[0]]['Affected Component Type']}</td>
                                            <td>{this.props.firstVersionAppeared} ({this.props.firstDateAppeared})</td>
                                            <td>{this.props.lastVersionDetected} ({this.props.lastDateDetected})</td>
                                        </tr>
                                    </MDBTableBody>
                                </MDBTable>
                                <button className="btn sdk4ed-color" 
                                        onClick={this.toggle.bind(this)}>  
                                Historical Details
                                </button>
                                </MDBCol>
                        </MDBRow>
                        <div id="outer" className={this.state.open ? '' : 'collapse in'} style={{marginBottom: 5, paddingBottom: 5}}>
                            {<Versions
                                spanningVersions = {this.props.spanningVersions.reverse()}
                                characteristics = {this.props.characteristics}
                                affectedComponents = {this.props.affectedComponents}
                            />}
                        </div>
                </MDBCardBody>
            </MDBCard>
        );
    }
}

class Versions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            version: this.props.spanningVersions[0]
        };
    }

    handleClick(item) {
        if(!(item in this.props.spanningVersions)){
            item = this.props.spanningVersions[0];
        }
        this.setState({version: item})
    }

    render() {
        return(
            <React.Fragment>
                <MDBDropdown>
                    <MDBDropdownToggle caret className="white-text sdk4ed-color">
                        Version {this.state.version}
                    </MDBDropdownToggle>
                    <MDBDropdownMenu basic>
                            {this.props.spanningVersions.map((item) => (
                                <MDBDropdownItem key={item} onClick={() => this.handleClick(item)}>{item}</MDBDropdownItem>
                            ))}
                    </MDBDropdownMenu>
                </MDBDropdown>
                <VersionDetails
                    version = {this.state.version}
                    characteristics = {this.props.characteristics[this.state.version]}
                    affectedComponents = {this.props.affectedComponents[this.state.version]}
                />
            </React.Fragment>
        );
    }
}

class VersionDetails extends Component {
    constructor(props) {
        super(props);
    }

    format(item) {
        /* if item is a number it rounds with max 4 fraction decimals */
        if (!isNaN(item)) {
            return parseFloat(parseFloat(item).toFixed(4));
        }
        return item;
    }

    renderCharacteristicsTableRows(){
        let result = []
        if(this.props.characteristics != null){
            result = Object.keys(this.props.characteristics).map((item, index) => (
                <tr key={index}>
                    <td>{item}</td>
                    <td>{this.format(this.props.characteristics[item]).toString()}</td>
                </tr>));
        }
        return result;
    }

    renderComponentsTableRows(){
        let result = []
        if(this.props.affectedComponents != null)
            result = this.props.affectedComponents.map(item => (
            <tr key={item}>
                <td>{item}</td>
            </tr>
        ))
        return result;
    }

    render() {
        return(
            <MDBRow>
                <MDBCol md="8">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Parameter</th>
                                <th scope="col">Value</th>
                            </tr>
                        </thead><tbody>
                            {this.renderCharacteristicsTableRows()}
                        </tbody>
                    </table>
                </MDBCol>
                <MDBCol md="4">
                    <table className="table table-striped table-bordered">
                        <thead>
                        <tr>
                            <th scope="col">Affected Components</th>
                        </tr>
                        </thead>
                        <tbody>
                            {this.renderComponentsTableRows()}
                        </tbody>
                    </table>
                </MDBCol>
            </MDBRow>
        );
    }
}

/**
 * Project selector to select what project to load from the database.
 * At the moment is not used in favor of session storage information.
 */
class ProjectSelector extends Component {
    constructor(props){
        super(props)
        this.state = {
            selected: "no-project",
            projects: []
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        this.getProjectsList();
        if(this.state.projects.length > 0){
            this.setState({select: this.state.projects[0]})
        }
    }

    handleChange(optionSelected){
        this.setState({selected: optionSelected.value})
        this.props.onProjectChange(optionSelected.value);
    }

    getProjectsList(){
        var url = SERVER_IP + "/projects"
        console.log("Requesting projects " + url);
        fetch(url)
            .then(res => res.json())
            .then(projects => {
                var projOptions = []
                projects.projects.forEach(e => projOptions.push({value: e, label: e}))
                this.setState({projects: projOptions})
            })
    }

    render(){
        return (
            <React.Fragment>
                <MDBCard>
                <MDBCardHeader className="sdk4ed-color">Choose an analysed project</MDBCardHeader>
                <MDBCardBody>
                    <div>
                        <label>Pick the project to show:
                        <Select 
                            value={this.state.selected}
                            options={this.state.projects} 
                            onChange={this.handleChange} />
                        </label>
                    </div>
                </MDBCardBody>
                </MDBCard>
            </React.Fragment>);
    }
}

export default SystemViewer;