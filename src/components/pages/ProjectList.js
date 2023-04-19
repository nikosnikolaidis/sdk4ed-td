import React from 'react';
import 'whatwg-fetch';
import jwt_decode from "jwt-decode";

import {
    MDBBtn, MDBIcon, MDBCol, MDBCard, MDBCardHeader, MDBCardBody, MDBFormInline, MDBContainer,
    MDBCardTitle, MDBCardText, MDBRow, MDBBadge, MDBBtnGroup, MDBDropdown, MDBDropdownToggle,
    MDBDropdownMenu, MDBDropdownItem
} from "mdbreact";
import NewProjectModalForm from '../pages/sections/NewProjectModalForm';
import { fetchProjects } from '../../apis/projects';
import {
    runNewDependabilityAnalysisData, runNewOptimalCheckpointAnalysisData, runNewEnergyAnalysisData,
    runNewTDAnalysisData, runNewTDNewCodeAnalysisData, runNewArchitectureRefactoringAnalysisData, runStartNewTDAnalysisData
} from '../../apis/LiveAnalysisAPIs';
import EditProjectModalForm from '../pages/sections/EditProjectModalForm';
import DeleteProjectModalForm from '../pages/sections/DeleteProjectModalForm';
import Loader from './sections/Loading'

const DEPENDABILITY_SERVER_IP = process.env.REACT_APP_DEPENDABILITY_TOOL_SERVER_IP // Update inside .env file
const ENERGY_SERVER_IP = process.env.REACT_APP_ENERGY_TOOLBOX_ENDPOINT
const TD_SERVER_IP = process.env.REACT_APP_TD_TOOL_INTEREST_ENDPOINT
const TD_NEW_CODE_SERVER_IP = 'http://195.251.210.147:8989' //process.env.REACT_APP_TD_TOOL_PRINCIPAL_ENDPOINT
const ARCHITECTURE_REFACTORING_SERVER_IP = process.env.REACT_APP_ATD_TOOL_SERVER_IP

// The Projects Panel
const ProjectsPanel = props => {
    return (
        <MDBRow className="mb-4">
            <MDBCol md="12" lg="12" className="mb-12">
                <MDBCard className="xmb-12" >
                    <MDBCardHeader className="sdk4ed-color">
                        <h2 className="pull-center">Projects</h2>
                        <MDBRow>
                            <MDBCol md="100" className="pull-left">
                                <NewProjectModalForm updateList={props.getProjectList} />
                            </MDBCol>
                            {/* TODO */}
                            {/* <MDBCol md="4" className="pull-right">
                                <MDBContainer size="3" style={{ textAlign: 'right' }}>
                                    <MDBBadge className="mr-1 ml-1" tag="a" color="light-green darken-4" >Name</MDBBadge>
                                    <MDBBadge className="mr-1 ml-1" tag="a" color="light">Date</MDBBadge>
                                </MDBContainer>
                            </MDBCol> */}
                        </MDBRow>
                    </MDBCardHeader>
                    <MDBCardBody>
                        <div>
                            {props.renderProjectItem(props.myprojects, props.myselectedProjectId)}
                        </div>
                    </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </MDBRow>
    )
}

// The Central Analysis Panel
const CentralAnalysisPanel = props => {
    return (
        <MDBRow className="mb-4">
            <MDBCol md="12" lg="12" className="mb-12">
                <MDBCard className="mb-12" >
                    <MDBCardBody>
                        <MDBRow className="mb-5">
                            <MDBCol lg="4" className="pull-left">
                                <MDBBtnGroup>
                                    <MDBBtn className="btn btn-primary" color="primary" disabled={props.mydisabledButton} onClick={(param) => props.runCentralAnalysis()}><MDBIcon icon="sync-alt" spin={!props.myanalysisFinished} className="mr-1" size="lg" />Run Central Analysis</MDBBtn>
                                    <MDBDropdown dropright>
                                        <MDBDropdownToggle caret className="btn btn-primary px-3" color="primary" />
                                        <MDBDropdownMenu color="primary">
                                            <MDBDropdownItem header>Technical Debt</MDBDropdownItem>
                                            <MDBDropdownItem toggle={false} type="button" onClick={(param) => props.toggleChange('isTDAnalysisChecked')}>
                                                <input type="checkbox" checked={props.myisTDAnalysisChecked} /> TD Analysis
                                            </MDBDropdownItem>
                                            <MDBDropdownItem toggle={false} type="button" onClick={(param) => props.toggleChange('isTDNewCodeAnalysisChecked')}>
                                                <input type="checkbox" checked={props.myisTDNewCodeAnalysisChecked} /> TD New Code
                                            </MDBDropdownItem>
                                        </MDBDropdownMenu>
                                    </MDBDropdown>
                                </MDBBtnGroup>
                            </MDBCol>
                            <MDBCol lg="8" className="pull-right">
                                <h5 align="right">{props.myanalysisMessage}</h5>
                            </MDBCol>
                        </MDBRow>
                        <MDBRow>
                            <MDBCol md="12" lg="3" className="mb-12">
                                <MDBCard className="cascading-admin-card">
                                    <div className="admin-up">
                                        <MDBIcon icon="chart-area" className="sdk4ed-color" />
                                        <div className="data">
                                            <h6 style={{ color: '#999999' }}>TECHNICAL DEBT</h6>
                                        </div>
                                    </div>
                                    <MDBCardBody>
                                        <MDBCol className="mb-2">
                                            <MDBCard>
                                                <MDBCardBody>
                                                    <div align="center" style={{ color: '#548235' }}>TD Analysis:</div>
                                                    <div align="center" style={{ color: '#000000' }}><i className={props.myiconTD}></i> {props.mytdState}</div>
                                                </MDBCardBody>
                                            </MDBCard>
                                        </MDBCol>
                                        <MDBCol>
                                            <MDBCard>
                                                <MDBCardBody>
                                                    <div align="center" style={{ color: '#548235' }}>TD New Code Analysis:</div>
                                                    <div align="center" style={{ color: '#000000' }}><i className={props.myiconTDNewCode}></i> {props.mytdNewCodeState}</div>
                                                </MDBCardBody>
                                            </MDBCard>
                                        </MDBCol>
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>
                            {/*<MDBCol md="12" lg="3" className="mb-12">
                                <MDBCard className="cascading-admin-card">
                                    <div className="admin-up">
                                        <MDBIcon icon="bolt" className="sdk4ed-color"/>
                                        <div className="data">
                                            <h6 style={{color:'#999999'}}>ENERGY</h6>
                                        </div>
                                    </div>
                                    <MDBCardBody>
                                        <MDBCol className="mb-2">
                                            <MDBCard>
                                                <MDBCardBody>
                                                    <div align="center" style={{color:'#548235'}}>Energy Estimation (Static):</div>
                                                    <div align="center" style={{color:'#000000'}}><i className={props.myiconStaticEnergy}></i> {props.myenergyStaticState}</div>
                                                </MDBCardBody>
                                            </MDBCard>
                                        </MDBCol>
                                        <MDBCol className="mb-2">
                                            <MDBCard>
                                                <MDBCardBody>
                                                    <div align="center" style={{color:'#548235'}}>Hotspots Identification:</div>
                                                    <div align="center" style={{color:'#000000'}}><i className={props.myiconHotspotEnergy}></i> {props.myenergyHotspotState}</div>
                                                </MDBCardBody>
                                            </MDBCard>
                                        </MDBCol>
                                        <MDBCol>
                                            <MDBCard>
                                                <MDBCardBody>
                                                    <div align="center" style={{color:'#548235'}}>Acceleration:</div>
                                                    <div align="center" style={{color:'#000000'}}><i className={props.myiconAccelerationEnergy}></i> {props.myenergyAccelerationState}</div>
                                                </MDBCardBody>
                                            </MDBCard>
                                        </MDBCol>
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>
                            <MDBCol md="12" lg="3" className="mb-12">
                                <MDBCard className="cascading-admin-card">
                                    <div className="admin-up">
                                        <MDBIcon icon="shield-alt" className="sdk4ed-color"/>
                                        <div className="data">
                                            <h6 style={{color:'#999999'}}>DEPENDABILITY</h6>
                                        </div>
                                    </div>
                                    <MDBCardBody>
                                        <MDBCol className="mb-2">
                                            <MDBCard>
                                                <MDBCardBody>
                                                    <div align="center" style={{color:'#548235'}}>Security Analysis:</div>
                                                    <div align="center" style={{color:'#000000'}}><i className={props.myiconSecurity}></i> {props.mysecurityState}</div>
                                                </MDBCardBody>
                                            </MDBCard>
                                        </MDBCol>
                                        <MDBCol className="mb-2">
                                            <MDBCard>
                                                <MDBCardBody>
                                                    <div align="center" style={{color:'#548235'}}>Vulnerability Analysis:</div>
                                                    <div align="center" style={{color:'#000000'}}><i className={props.myiconVulnerability}></i> {props.myvulnerabilityState}</div>
                                                </MDBCardBody>
                                            </MDBCard>
                                        </MDBCol>
                                        <MDBCol>
                                            <MDBCard>
                                                <MDBCardBody>
                                                    <div align="center" style={{color:'#548235'}}>Optimal Checkpoint:</div>
                                                    <div align="center" style={{color:'#000000'}}><i className={props.myiconOptimalCheckpoint}></i> {props.myoptimalCheckpointState}</div>
                                                </MDBCardBody>
                                            </MDBCard>
                                        </MDBCol>
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>*/}
                            <MDBCol md="12" lg="3" className="mb-12">
                                <MDBCard className="cascading-admin-card">
                                    <div className="admin-up">
                                        <MDBIcon icon="wrench" className="sdk4ed-color" />
                                        <div className="data">
                                            <h6 style={{ color: '#999999' }}>REFACTORING</h6>
                                        </div>
                                    </div>
                                    <MDBCardBody>
                                        <MDBCol className="mb-2">
                                            <MDBCard>
                                                <MDBCardBody>
                                                    <div align="center" style={{ color: '#548235' }}>Code Refactoring:</div>
                                                    <div align="center" style={{ color: '#000000' }}><i className={props.myiconTDNewCode}></i> {props.mytdNewCodeState}</div>
                                                </MDBCardBody>
                                            </MDBCard>
                                        </MDBCol>
                                        <MDBCol className="mb-2">
                                            <MDBCard>
                                                <MDBCardBody>
                                                    <div align="center" style={{ color: '#548235' }}>Design Refactoring:</div>
                                                    <div align="center" style={{ color: '#000000' }}><i className={props.myiconDesignRefactoring}></i> {props.mydesignRefactoringState}</div>
                                                </MDBCardBody>
                                            </MDBCard>
                                        </MDBCol>
                                        {/*<MDBCol>
                                            <MDBCard>
                                                <MDBCardBody>
                                                    <div align="center" style={{color:'#548235'}}>Architecture Refactoring:</div>
                                                    <div align="center" style={{color:'#000000'}}><i className={props.myiconArchitectureRefactoring}></i> {props.myarchitectureRefactoringState}</div>
                                                </MDBCardBody>
                                            </MDBCard>
										</MDBCol>*/}
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>
                        </MDBRow>
                    </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </MDBRow>
    )
}

class ProjectList extends React.Component {
    constructor(props) {
        super(props);

        // Initialize state here
        this.state = {
            isLoading: false,
            projects: [],
            selectedProjectId: 0,
            disabledButton: true,
            tdState: 'pending',
            designRefactoringState: 'pending',
            tdNewCodeState: 'pending',
            architectureRefactoringState: 'pending',
            energyHotspotState: 'pending',
            energyStaticState: 'pending',
            energyAccelerationState: 'pending',
            securityState: 'pending',
            vulnerabilityState: 'pending',
            optimalCheckpointState: 'pending',
            isTDAnalysisChecked: true,
            isTDNewCodeAnalysisChecked: true,
            isArchitectureRefactoringAnalysisChecked: false,
            isEnergyHotspotAnalysisChecked: false,
            isEnergyStaticAnalysisChecked: false,
            isEnergyAccelerationAnalysisChecked: false,
            isSecurityAnalysisChecked: false,
            isVulnerabilityAnalysisChecked: false,
            isOptimalCheckpointAnalysisChecked: false,
            iconTD: 'fas fa-history blue-text',
            iconDesignRefactoring: 'fas fa-history blue-text',
            iconTDNewCode: 'fas fa-history blue-text',
            iconArchitectureRefactoring: 'fas fa-history blue-text',
            iconHotspotEnergy: 'fas fa-history blue-text',
            iconStaticEnergy: 'fas fa-history blue-text',
            iconAccelerationEnergy: 'fas fa-history blue-text',
            iconSecurity: 'fas fa-history blue-text',
            iconVulnerability: 'fas fa-history blue-text',
            iconOptimalCheckpoint: 'fas fa-history blue-text',
            analysisFinished: true,
            analysisMessage: ''
        }
    }

    // Get list of projects
    getProjectList = () => {
        let token = localStorage.getItem("react-token");
        if (token) {
            let token = localStorage.getItem("react-token");
            var decoded = jwt_decode(token);
            let sdk4edUser = '';
            let sdk4edRoles = [];
            if (decoded) {
                if (decoded.realm_access && decoded.realm_access.roles) {
                    sdk4edRoles = decoded.realm_access.roles;
                }
                sdk4edUser = decoded.email
            }
            this.setState({ isLoading: true });
            let responseStatus;
            fetchProjects(sdk4edUser, sdk4edRoles)
                .then(resp => { responseStatus = resp.status; if (resp.status != 200) console.error('Error getProjectList', resp); return resp.status == 200 ? resp.json() : [] })
                .then(resp => {
                    let uniqueProjects = resp.filter((ele, ind) => ind === resp.findIndex(elem => elem.id === ele.id && elem.name === ele.name));
                    this.isSelected(uniqueProjects);
                    this.setState({
                        isLoading: false,
                        projects: uniqueProjects
                    });
                });
        } else if (this.state.projects.length == 0) {
            const timer = setTimeout(() => {
                if (this.state.projects.length == 0) {
                    this.getProjectList();
                } else {
                    clearTimeout(timer);
                }
            }, 50);
        }
    }

    truncate = (str) => {
        return str.length > 160 ? str.substring(0, 157) + "..." : str;
    }

    // Render project cards
    renderProjectItem = (projects, selectedProjectId) => {
        return <MDBRow> {projects.map((pi) => {
            if (pi.id) {
                return <MDBCol sm="12" md="6" lg="3" xsize="3" style={{ paddingRight: '0px', paddingLeft: '0px' }} key={pi.id}>
                    <MDBContainer>
                        <MDBCard style={{ marginTop: "1rem" }} className={selectedProjectId === pi.id ? 'card-selected' : ''} onClick={(e) => { this.handleClick(e, pi) }}>
                            <MDBCardBody>
                                <MDBBadge color={pi.private ? 'dark' : 'light'} style={{ float: "right" }}>{pi.private ? 'Private' : 'Public'}</MDBBadge>
                                <MDBCardTitle><a href="#" onClick={(e) => { this.handleClick(e, pi) }}>{pi.name}</a></MDBCardTitle>
                                <MDBCardText>
                                    <p style={{ fontSize: '8pt' }}>{pi.timestamp ? new Date(pi.timestamp).toLocaleString() : null}</p>
                                    {this.truncate(pi.description)}
                                </MDBCardText>
                                <div>
                                    <EditProjectModalForm id={pi.id} updateList={this.getProjectList} />
                                    <DeleteProjectModalForm project={pi} updateList={this.getProjectList} />
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBContainer>
                </MDBCol>
            } else {
                console.log('missing id', pi);
            }
        })}</MDBRow>
    }

    // Handle click on project cards
    handleClick = (e, project) => {
        e.preventDefault();

        // If user clicked on a different project then reset analysis
        if (sessionStorage.getItem('selected_project') !== null) {
            let selectedProjectJSON = JSON.parse(sessionStorage.getItem('selected_project'))
            if (selectedProjectJSON.id !== project.id) {
                this.resetStateAnalysis(project.id, project.name)
                this.setState({
                    disabledButton: false,
                    analysisFinished: true,
                    analysisMessage: ''
                })
            }
        } else {
            this.resetStateAnalysis(project.id, project.name)
            // this.setState({
            //     disabledButton: false,
            //     analysisFinished: true,
            //     analysisMessage: ''
            // })
            // this.intervalTdAnalysisStatus(sessionStorage.getItem('analysis_project'));
        }

        sessionStorage.setItem("selected_project", JSON.stringify(project));
        this.setState({
            selectedProjectId: project.id
        })
    }

    // Handle actions when project card selected
    isSelected = projectsList => {
        projectsList.map((project) => {
            let storedProject = sessionStorage.getItem("selected_project");
            if (storedProject) {
                let storedProjectJson = JSON.parse(storedProject);
                if (project.id == storedProjectJson.id) {
                    sessionStorage.setItem("selected_project", JSON.stringify(project)); // Quick fix to update session storage when editing a project
                    this.setState({
                        selectedProjectId: project.id,
                        disabledButton: false
                    });
                    return project.id;
                }
            }
        });
        return 0;
    }

    // Handle click on central analysis dropdown
    toggleChange = (checked) => {
        this.setState({
            [checked]: !this.state[checked],
        });
    }

    checkAnalysisFinished = () => {
        // If project is being analysed
        if (sessionStorage.getItem('analysis_project') !== null) {
            // Parse session storage
            var selectedProjectSession = JSON.parse(sessionStorage.getItem('analysis_project'))

            if (selectedProjectSession['tdState'] !== 'running' && selectedProjectSession['designRefactoringState'] !== 'running' && selectedProjectSession['tdNewCodeState'] !== 'running'
                && selectedProjectSession['architectureRefactoringState'] !== 'running' && selectedProjectSession['energyHotspotState'] !== 'running' && selectedProjectSession['energyStaticState'] !== 'running'
                && selectedProjectSession['energyAccelerationState'] !== 'running' && selectedProjectSession['securityState'] !== 'running' && selectedProjectSession['vulnerabilityState'] !== 'running'
                && selectedProjectSession['optimalCheckpointState'] !== 'running') {
                this.setState({
                    analysisFinished: true,
                    disabledButton: false,
                    analysisMessage: ''
                })
            } else {
                this.setState({
                    analysisFinished: false,
                    disabledButton: true
                })
            }
        }
    }

    // Update analysis results on session storage
    handleAnalysis = (project) => {
        sessionStorage.setItem("analysis_project", JSON.stringify(project));
    }

    // Reset analysis results on session storage
    resetStateAnalysis = (project_id, project_name) => {
        this.setState({
            tdState: 'pending',
            designRefactoringState: 'pending',
            tdNewCodeState: 'pending',
            architectureRefactoringState: 'pending',
            energyHotspotState: 'pending',
            energyStaticState: 'pending',
            energyAccelerationState: 'pending',
            securityState: 'pending',
            vulnerabilityState: 'pending',
            optimalCheckpointState: 'pending',
            isTDAnalysisChecked: true,
            isTDNewCodeAnalysisChecked: true,
            isArchitectureRefactoringAnalysisChecked: false,
            isEnergyHotspotAnalysisChecked: false,
            isEnergyStaticAnalysisChecked: false,
            isEnergyAccelerationAnalysisChecked: false,
            isSecurityAnalysisChecked: false,
            isVulnerabilityAnalysisChecked: false,
            isOptimalCheckpointAnalysisChecked: false,
            iconTD: 'fas fa-history blue-text',
            iconDesignRefactoring: 'fas fa-history blue-text',
            iconTDNewCode: 'fas fa-history blue-text',
            iconArchitectureRefactoring: 'fas fa-history blue-text',
            iconHotspotEnergy: 'fas fa-history blue-text',
            iconStaticEnergy: 'fas fa-history blue-text',
            iconAccelerationEnergy: 'fas fa-history blue-text',
            iconSecurity: 'fas fa-history blue-text',
            iconVulnerability: 'fas fa-history blue-text',
            iconOptimalCheckpoint: 'fas fa-history blue-text',
            analysisMessage: ''
        })

        // Create a new object for updating analysis status in session storage
        let analysis_project = {
            'id': project_id,
            'name': project_name,
            'tdState': 'pending',
            'designRefactoringState': 'pending',
            'tdNewCodeState': 'pending',
            'architectureRefactoringState': 'pending',
            'energyHotspotState': 'pending',
            'energyStaticState': 'pending',
            'energyAccelerationState': 'pending',
            'securityState': 'pending',
            'vulnerabilityState': 'pending',
            'optimalCheckpointState': 'pending',
        }
        this.handleAnalysis(analysis_project)

        this.intervalTdAnalysisStatus(analysis_project);
    }

    // Update state with analysis results
    updateStateAnalysis = (result, state, icon, analysis_project) => {
        // Update analysis state
        if (result === 'running') {
            this.setState({
                [state]: 'running',
                [icon]: 'fas fa-circle-notch fa-spin',
            })
            analysis_project[state] = 'running'
        } else if (result === 'finished') {
            this.setState({
                [state]: 'finished',
                [icon]: 'fas fa-check-circle green-text',
            })
            analysis_project[state] = 'finished'
        } else if (result === 'failed') {
            this.setState({
                [state]: 'failed',
                [icon]: 'fas fa-exclamation-circle red-text',
            })
            analysis_project[state] = 'failed'
        }
        // Update analysis state in session storage
        this.handleAnalysis(analysis_project)
        // Check if analysis has finished
        this.checkAnalysisFinished()
    }

    intervalTdAnalysisStatus = (analysis_project) => {
        setTimeout(() => {
            // console.log("wait 0.3sec")
            if (!analysis_project) {
                // console.log("Entered in IF")
                analysis_project = JSON.parse(sessionStorage.getItem('analysis_project'));
            }

            let storedProject = sessionStorage.getItem('selected_project');
            let storedProjectJson = JSON.parse(storedProject);
            let urlInfo = storedProjectJson['endpoint'];

            let urlPrefix = TD_SERVER_IP + "api/project/"
            let url = urlPrefix + "state?url=" + urlInfo.toString();
            fetch(url, {
                method: 'GET',
                redirect: 'follow'
            })
                .then(resp => resp.text())
                .then(resp => {
                    console.log(resp.toString())
                    if (resp.toString() === 'RUNNING') {
                        this.updateStateAnalysis('running', 'tdState', 'iconTD', analysis_project)
                    } else if (resp.toString() === 'COMPLETED') {
                        this.updateStateAnalysis('finished', 'tdState', 'iconTD', analysis_project)
                    } else if (resp.toString() === 'ABORTED') {
                        this.updateStateAnalysis('failed', 'tdState', 'iconTD', analysis_project)
                    } else {
                        this.updateStateAnalysis('pending', 'tdState', 'iconTD', analysis_project)
                    }
                })
                .catch(error => {
                    this.updateStateAnalysis('pending', 'tdState', 'iconTD', analysis_project)
                    // console.log('error', error);
                });
        }, 300);

    }

    // Run central analysis
    runCentralAnalysis = () => {
        // Fetch general info from session storage
        let storedProject = sessionStorage.getItem('selected_project');
        let storedProjectJson = JSON.parse(storedProject);
        console.log(storedProjectJson)
        let idInfo = storedProjectJson['id'];
        let nameInfo = storedProjectJson['name'];
        let urlInfo = storedProjectJson['endpoint'];
        let usernameInfo = storedProjectJson['username'];
        let passwordInfo = storedProjectJson['password'];
        let sdk4edUserInfo = storedProjectJson['sdk4edUser'];
        let base64Header = {}
        if (usernameInfo !== '' && passwordInfo !== '') {
            base64Header = { 'Authorization': 'Basic ' + btoa(usernameInfo + ':' + passwordInfo) }
        }
        let languageInfo = ''
        if (storedProjectJson['common'] !== '') {
            let commonInfo = JSON.parse(storedProjectJson['common']);
            if ('language' in commonInfo) {
                languageInfo = commonInfo['language']
            }
        }
        // Fetch TD info from session storage
        // let tdLanguageInfo = ''
        // let tdTypeAnalysisInfo = ''
        let tdmoveClassRefactoringInfo = ''
        let tdExtractMethodRefactoringInfo = ''
        let tdBuildToolInfo = ''
        // if (storedProjectJson['technicaldebt'] !== '') {
        //     let tdInfo = JSON.parse(storedProjectJson['technicaldebt']);
        //     if ('language' in tdInfo) {
        //         tdLanguageInfo = tdInfo['language']
        //     }
        //     if ('typeAnalysis' in tdInfo) {
        //         tdTypeAnalysisInfo = tdInfo['typeAnalysis']
        //     }
        //     if ('moveClassRefactoring' in tdInfo) {
        //         tdmoveClassRefactoringInfo = tdInfo['moveClassRefactoring']
        //     }
        //     if ('extractMethodRefactoring' in tdInfo) {
        //         tdExtractMethodRefactoringInfo = tdInfo['extractMethodRefactoring']
        //     }
        //     if ('buildTool' in tdInfo) {
        //         tdBuildToolInfo = tdInfo['buildTool']
        //     }
        // }
        // Fetch Dependability info from session storage
        // let optimalCheckpointInfo = ''
        // let securityHistoricalAnalysisInfo = false
        // if (storedProjectJson['dependability'] !== '') {
        //     let dependabilityInfo = JSON.parse(storedProjectJson['dependability']);
        //     if ('optimal_checkpoint' in dependabilityInfo) {
        //         optimalCheckpointInfo = dependabilityInfo['optimal_checkpoint']
        //     }
        //     if ('security_assessment' in dependabilityInfo) {
        //         if ('historical_analysis' in dependabilityInfo['security_assessment']) {
        //             securityHistoricalAnalysisInfo = dependabilityInfo['security_assessment']['historical_analysis']
        //         }
        //     }
        // }

        // Reset analysis
        this.resetStateAnalysis(idInfo, nameInfo)
        let analysis_project = JSON.parse(sessionStorage.getItem('analysis_project'));

        this.setState({
            disabledButton: true,
            analysisFinished: false,
            analysisMessage: 'Analysis running for ' + nameInfo + '. If you want to see the progress, please do not close the page.'
        })

        // Code for fetching Security Assessment data from API
        /*if(this.state.isSecurityAnalysisChecked){
            this.updateStateAnalysis('running', 'securityState', 'iconSecurity', analysis_project)
            let assessmentType = ''
            if(securityHistoricalAnalysisInfo === false){
                assessmentType = 'SecurityAssessment'
            }else if(securityHistoricalAnalysisInfo === true){
                assessmentType = 'HistoricalAnalysis'
            }
            runNewDependabilityAnalysisData(DEPENDABILITY_SERVER_IP+'/DependabilityToolbox/'+assessmentType,urlInfo,usernameInfo,languageInfo,'yes',base64Header)
            .then(resp => {
                if(resp.status === 200) {
                    console.log("Security Assessment data received")
                    this.updateStateAnalysis('finished', 'securityState', 'iconSecurity', analysis_project)
                }else{
                    console.log('Security Assessment error: Status ' + resp.status + ' - ' + resp.statusText)
                    this.updateStateAnalysis('failed', 'securityState', 'iconSecurity', analysis_project)
                }
            }).catch(error => {
                console.log('Security Assessment error: ' + error)
                this.updateStateAnalysis('failed', 'securityState', 'iconSecurity', analysis_project)
            })
        }
        
        // Code for fetching Vulnerability Prediction data from API
        if(this.state.isVulnerabilityAnalysisChecked){
            this.updateStateAnalysis('running', 'vulnerabilityState', 'iconVulnerability', analysis_project)
            runNewDependabilityAnalysisData(DEPENDABILITY_SERVER_IP+'/DependabilityToolbox/VulnerabilityPrediction',urlInfo,usernameInfo,languageInfo,'yes',base64Header)
            .then(resp => {
                if(resp.status === 200) {
                    console.log("Vulnerability Prediction data received")
                    this.updateStateAnalysis('finished', 'vulnerabilityState', 'iconVulnerability', analysis_project)
                }else{
                    console.log('Vulnerability Prediction error: Status ' + resp.status + ' - ' + resp.statusText)
                    this.updateStateAnalysis('finished', 'vulnerabilityState', 'iconVulnerability', analysis_project)
                }
            }).catch(error => {
                console.log('Vulnerability Prediction error: ' + error)
                this.updateStateAnalysis('finished', 'vulnerabilityState', 'iconVulnerability', analysis_project)
            })
        }
    
        // Code for fetching Optimal Checkpoint data from API
        if(this.state.isOptimalCheckpointAnalysisChecked){
            this.updateStateAnalysis('running', 'optimalCheckpointState', 'iconOptimalCheckpoint', analysis_project)
            runNewOptimalCheckpointAnalysisData(DEPENDABILITY_SERVER_IP+'/DependabilityToolbox/OptimalCheckpoint',optimalCheckpointInfo)
            .then(resp => {
                if(resp.status === 200) {
                    console.log("Optimal Checkpoint data received")
                    this.updateStateAnalysis('finished', 'optimalCheckpointState', 'iconOptimalCheckpoint', analysis_project)
                }else{
                    console.log('Optimal Checkpoint error: Status ' + resp.status + ' - ' + resp.statusText)
                    this.updateStateAnalysis('failed', 'optimalCheckpointState', 'iconOptimalCheckpoint', analysis_project)
                }
            }).catch(error => {
                console.log('Optimal Checkpoint error: ' + error)
                this.updateStateAnalysis('failed', 'optimalCheckpointState', 'iconOptimalCheckpoint', analysis_project)
            })
        }
        
        // Code for fetching Hotspot Energy Analysis data from API
        if(this.state.isEnergyHotspotAnalysisChecked){
            this.updateStateAnalysis('running', 'energyHotspotState', 'iconHotspotEnergy', analysis_project)
            runNewEnergyAnalysisData(ENERGY_SERVER_IP+'/analysis','T',usernameInfo,passwordInfo,urlInfo,'hotspots')
            .then(resp => {
                if(resp.status === 200) {
                    console.log("Energy Hotspots Analysis data received")
                    this.updateStateAnalysis('finished', 'energyHotspotState', 'iconHotspotEnergy', analysis_project)
                }else{
                    console.log('Energy Hotspots Analysis error: Status ' + resp.status + ' - ' + resp.statusText)
                    this.updateStateAnalysis('failed', 'energyHotspotState', 'iconHotspotEnergy', analysis_project)
                }
            }).catch(error => {
                console.log('Energy Hotspots Analysis error: ' + error)
                this.updateStateAnalysis('failed', 'energyHotspotState', 'iconHotspotEnergy', analysis_project)
            })
        }
    
        // Code for fetching Static Energy Analysis data from API
        if(this.state.isEnergyStaticAnalysisChecked){
            this.updateStateAnalysis('running', 'energyStaticState', 'iconStaticEnergy', analysis_project)
            runNewEnergyAnalysisData(ENERGY_SERVER_IP+'/analysis','T',usernameInfo,passwordInfo,urlInfo,'static')
            .then(resp => {
                if(resp.status === 200) {
                    console.log("Energy Static Analysis data received")
                    this.updateStateAnalysis('finished', 'energyStaticState', 'iconStaticEnergy', analysis_project)
                }else{
                    console.log('Energy Static Analysis error: Status ' + resp.status + ' - ' + resp.statusText)
                    this.updateStateAnalysis('failed', 'energyStaticState', 'iconStaticEnergy', analysis_project)
                }
            }).catch(error => {
                console.log('Energy Static Analysis error: ' + error)
                this.updateStateAnalysis('failed', 'energyStaticState', 'iconStaticEnergy', analysis_project)
            })
        }
    
        // Code for fetching Acceleration Energy Analysis data from API
        if(this.state.isEnergyAccelerationAnalysisChecked){
            this.updateStateAnalysis('running', 'energyAccelerationState', 'iconAccelerationEnergy', analysis_project)
            runNewEnergyAnalysisData(ENERGY_SERVER_IP+'/analysis','T',usernameInfo,passwordInfo,urlInfo,'acceleration')
            .then(resp => {
                if(resp.status === 200) {
                    console.log("Energy Acceleration Analysis data received")
                    this.updateStateAnalysis('finished', 'energyAccelerationState', 'iconAccelerationEnergy', analysis_project)
                }else{
                    console.log('Energy Acceleration Analysis error: Status ' + resp.status + ' - ' + resp.statusText)
                    this.updateStateAnalysis('failed', 'energyAccelerationState', 'iconAccelerationEnergy', analysis_project)
                }
            }).catch(error => {
                console.log('Energy Acceleration Analysis error: ' + error)
                this.updateStateAnalysis('failed', 'energyAccelerationState', 'iconAccelerationEnergy', analysis_project)
            })
        }*/

        // console.log(this.state.isTDAnalysisChecked,
        //     this.state.isTDNewCodeAnalysisChecked,
        //     tdmoveClassRefactoringInfo,
        //     tdExtractMethodRefactoringInfo
        // );

        // Code for fetching TD Analysis data from API
        if (this.state.isTDAnalysisChecked) {
            this.updateStateAnalysis('running', 'tdState', 'iconTD', analysis_project)
            if (tdmoveClassRefactoringInfo === true || tdExtractMethodRefactoringInfo === true) {
                this.updateStateAnalysis('running', 'designRefactoringState', 'iconDesignRefactoring', analysis_project)
            }
            runStartNewTDAnalysisData(TD_SERVER_IP + 'api/analysis', urlInfo, usernameInfo, passwordInfo)
                .then(resp => {
                    if (resp.status === 200) {
                        console.log("TD Analysis data received")
                        this.updateStateAnalysis('finished', 'tdState', 'iconTD', analysis_project)
                        if (tdmoveClassRefactoringInfo === true || tdExtractMethodRefactoringInfo === true) {
                            console.log("Design Refactoring data received")
                            this.updateStateAnalysis('finished', 'designRefactoringState', 'iconDesignRefactoring', analysis_project)
                        }
                    } else {
                        console.log('TD Analysis error: Status ' + resp.status + ' - ' + resp.statusText)
                        this.updateStateAnalysis('failed', 'tdState', 'iconTD', analysis_project)
                        if (tdmoveClassRefactoringInfo === true || tdExtractMethodRefactoringInfo === true) {
                            console.log('Design Refactoring error: Status ' + resp.status + ' - ' + resp.statusText)
                            this.updateStateAnalysis('failed', 'designRefactoringState', 'iconDesignRefactoring', analysis_project)
                        }
                    }
                }).catch(error => {
                    console.log('TD Analysis error: ' + error)
                    this.updateStateAnalysis('failed', 'tdState', 'iconTD', analysis_project)
                    if (tdmoveClassRefactoringInfo === true || tdExtractMethodRefactoringInfo === true) {
                        console.log('Design Refactoring error: ' + error)
                        this.updateStateAnalysis('failed', 'designRefactoringState', 'iconDesignRefactoring', analysis_project)
                    }
                })

            this.intervalTdAnalysisStatus(analysis_project);

        }

        // Code for fetching TD New Code Analysis data from API
        if (this.state.isTDNewCodeAnalysisChecked) {
            this.updateStateAnalysis('running', 'tdNewCodeState', 'iconTDNewCode', analysis_project)
            runNewTDNewCodeAnalysisData(TD_NEW_CODE_SERVER_IP + '/api/sdk4ed/ha/analyze', usernameInfo, passwordInfo, urlInfo, languageInfo, tdBuildToolInfo)
                .then(resp => {
                    if (resp.status === 200) {
                        console.log("TD New Code Analysis data received")
                        this.updateStateAnalysis('finished', 'tdNewCodeState', 'iconTDNewCode', analysis_project)
                    } else {
                        console.log('TD New Code Analysis error: Status ' + resp.status + ' - ' + resp.statusText)
                        this.updateStateAnalysis('failed', 'tdNewCodeState', 'iconTDNewCode', analysis_project)
                    }
                }).catch(error => {
                    console.log('TD New Code Analysis error: ' + error)
                    this.updateStateAnalysis('failed', 'tdNewCodeState', 'iconTDNewCode', analysis_project)
                })
        }

        // Code for fetching Architecture Refactoring Analysis data from API
        /*if(this.state.isArchitectureRefactoringAnalysisChecked){
            this.updateStateAnalysis('running', 'architectureRefactoringState', 'iconArchitectureRefactoring', analysis_project)
            var selectedProject = JSON.parse(sessionStorage.getItem('selected_project'));
            runNewArchitectureRefactoringAnalysisData(ARCHITECTURE_REFACTORING_SERVER_IP+'/analyse', languageInfo, urlInfo, selectedProject)
            .then(resp => {
                if(resp.status === 200) {
                    console.log("Architecture Refactoring Analysis data received")
                    this.updateStateAnalysis('finished', 'architectureRefactoringState', 'iconArchitectureRefactoring', analysis_project)
                }else{
                    console.log('Architecture Refactoring Analysis error: Status ' + resp.status + ' - ' + resp.statusText)
                    this.updateStateAnalysis('failed', 'architectureRefactoringState', 'iconArchitectureRefactoring', analysis_project)
                }
            }).catch(error => {
                console.log('Architecture Refactoring Analysis error: ' + error)
                this.updateStateAnalysis('failed', 'architectureRefactoringState', 'iconArchitectureRefactoring', analysis_project)
            })
        }*/
    }

    componentDidMount() {
        this.getProjectList();

        // If project is being analysed
        if (sessionStorage.getItem('analysis_project') !== null) {
            // Parse session storage
            var selectedProjectSession = JSON.parse(sessionStorage.getItem('analysis_project'))

            this.updateStateAnalysis(selectedProjectSession['tdState'], 'tdState', 'iconTD', selectedProjectSession)
            this.updateStateAnalysis(selectedProjectSession['designRefactoringState'], 'designRefactoringState', 'iconDesignRefactoring', selectedProjectSession)
            this.updateStateAnalysis(selectedProjectSession['tdNewCodeState'], 'tdNewCodeState', 'iconTDNewCode', selectedProjectSession)
            this.updateStateAnalysis(selectedProjectSession['architectureRefactoringState'], 'architectureRefactoringState', 'iconArchitectureRefactoring', selectedProjectSession)
            this.updateStateAnalysis(selectedProjectSession['energyStaticState'], 'energyStaticState', 'iconStaticEnergy', selectedProjectSession)
            this.updateStateAnalysis(selectedProjectSession['energyHotspotState'], 'energyHotspotState', 'iconHotspotEnergy', selectedProjectSession)
            this.updateStateAnalysis(selectedProjectSession['energyAccelerationState'], 'energyAccelerationState', 'iconAccelerationEnergy', selectedProjectSession)
            this.updateStateAnalysis(selectedProjectSession['securityState'], 'securityState', 'iconSecurity', selectedProjectSession)
            this.updateStateAnalysis(selectedProjectSession['vulnerabilityState'], 'vulnerabilityState', 'iconVulnerability', selectedProjectSession)
            this.updateStateAnalysis(selectedProjectSession['optimalCheckpointState'], 'optimalCheckpointState', 'iconOptimalCheckpoint', selectedProjectSession)
        }
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    render() {
        const { projects, selectedProjectId, disabledButton, isTDAnalysisChecked, isTDNewCodeAnalysisChecked,
            isEnergyHotspotAnalysisChecked, isEnergyStaticAnalysisChecked, isEnergyAccelerationAnalysisChecked,
            isSecurityAnalysisChecked, isVulnerabilityAnalysisChecked, isOptimalCheckpointAnalysisChecked,
            isArchitectureRefactoringAnalysisChecked, iconTD, iconDesignRefactoring, iconTDNewCode, iconHotspotEnergy,
            iconStaticEnergy, iconAccelerationEnergy, iconSecurity, iconVulnerability, iconOptimalCheckpoint,
            iconArchitectureRefactoring, tdState, designRefactoringState, tdNewCodeState, energyHotspotState,
            energyStaticState, energyAccelerationState, securityState, vulnerabilityState, optimalCheckpointState,
            architectureRefactoringState, analysisFinished, analysisMessage } = this.state

        if (this.state.isLoading) {
            return (<Loader />)
        } else {
            return (
                <React.Fragment>
                    <ProjectsPanel
                        myprojects={projects}
                        myselectedProjectId={selectedProjectId}
                        getProjectList={this.getProjectList}
                        renderProjectItem={this.renderProjectItem}
                    />
                    <CentralAnalysisPanel
                        myanalysisMessage={analysisMessage}
                        myanalysisFinished={analysisFinished}
                        mydisabledButton={disabledButton}
                        myisTDAnalysisChecked={isTDAnalysisChecked}
                        myisTDNewCodeAnalysisChecked={isTDNewCodeAnalysisChecked}
                        myisEnergyHotspotAnalysisChecked={isEnergyHotspotAnalysisChecked}
                        myisEnergyStaticAnalysisChecked={isEnergyStaticAnalysisChecked}
                        myisEnergyAccelerationAnalysisChecked={isEnergyAccelerationAnalysisChecked}
                        myisSecurityAnalysisChecked={isSecurityAnalysisChecked}
                        myisVulnerabilityAnalysisChecked={isVulnerabilityAnalysisChecked}
                        myisOptimalCheckpointAnalysisChecked={isOptimalCheckpointAnalysisChecked}
                        myisArchitectureRefactoringAnalysisChecked={isArchitectureRefactoringAnalysisChecked}
                        myiconTD={iconTD}
                        myiconDesignRefactoring={iconDesignRefactoring}
                        myiconTDNewCode={iconTDNewCode}
                        myiconHotspotEnergy={iconHotspotEnergy}
                        myiconStaticEnergy={iconStaticEnergy}
                        myiconAccelerationEnergy={iconAccelerationEnergy}
                        myiconSecurity={iconSecurity}
                        myiconVulnerability={iconVulnerability}
                        myiconOptimalCheckpoint={iconOptimalCheckpoint}
                        myiconArchitectureRefactoring={iconArchitectureRefactoring}
                        mytdState={tdState}
                        mydesignRefactoringState={designRefactoringState}
                        mytdNewCodeState={tdNewCodeState}
                        myenergyHotspotState={energyHotspotState}
                        myenergyStaticState={energyStaticState}
                        myenergyAccelerationState={energyAccelerationState}
                        mysecurityState={securityState}
                        myvulnerabilityState={vulnerabilityState}
                        myoptimalCheckpointState={optimalCheckpointState}
                        myarchitectureRefactoringState={architectureRefactoringState}
                        runCentralAnalysis={this.runCentralAnalysis}
                        toggleChange={this.toggleChange}
                    />
                </React.Fragment>
            )
        }
    }
}

export default ProjectList; 
