import React, { Component } from 'react';
import jwt_decode from "jwt-decode";

import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBIcon, MDBRow, MDBCol, MDBAlert } from 'mdbreact';
import { createProject } from '../../../apis/projects';
import history from '../../../history';

class NewProjectModalForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toolbox: 'Technical Debt',
            modal: false,
            nameValue: '',
            endpointValue: '',
            usernameValue: '',
            passwordValue: '',
            descriptionValue: '',
            responseStatus: null,
            technicaldebtValue: '{"language":"Java", "typeAnalysis":1,"moveClassRefactoring":false,"extractMethodRefactoring":false}',
            atdValue: '',
            forecastValue: '',
            decisionValue: '',
            dependabilityValue: '',
            energyValue: '',
            commonValue: '',
            sdk4edUser: '',
            sdk4edRoles: [],
            access: 'Public'
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        let token = localStorage.getItem("react-token");
        if (token) {
            var decoded = jwt_decode(token);
            if (decoded) {
                if (decoded.realm_access && decoded.realm_access.roles) {
                    // console.log('ROLES', decoded.realm_access.roles);
                    this.setState({ sdk4edRoles: decoded.realm_access.roles });
                }
                this.setState({ sdk4edUser: decoded.email });
            }
        }
    }

    handleChange(event, input) {
        switch (input) {
            case 'NAME':
                this.setState({ nameValue: event.target.value });
                break;
            case 'ENDPOINT':
                this.setState({ endpointValue: event.target.value });
                break;
            case 'USERNAME':
                this.setState({ usernameValue: event.target.value });
                break;
            case 'PASSWORD':
                this.setState({ passwordValue: event.target.value });
                break;
            case 'DESCRIPTION':
                this.setState({ descriptionValue: event.target.value });
                break;
            case 'ARCHTECHNICALDEBT':
                this.setState({ atdValue: event.target.value });
                break;
            case 'TECHNICALDEBT':
                this.setState({ technicaldebtValue: event.target.value });
                break;
            case 'FORECAST':
                this.setState({ forecastValue: event.target.value });
                break;
            case 'DECISION':
                this.setState({ decisionValue: event.target.value });
                break;
            case 'DEPENDABILITY':
                this.setState({ dependabilityValue: event.target.value });
                break;
            case 'ENERGY':
                this.setState({ energyValue: event.target.value });
                break;
            case 'COMMON':
                this.setState({ commonValue: event.target.value });
                break;
            default:
                break;
        }
    }

    changeToolbox = (event) => {
        this.setState({ toolbox: event.target.value });
    }

    changeAccess = (event) => {
        this.setState({ access: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        let isPrivateSet = this.state.access.includes('Private') ? true : false;
        const newProject = {
            name: this.state.nameValue,
            endpoint: this.state.endpointValue,
            username: this.state.usernameValue,
            password: this.state.passwordValue,
            description: this.state.descriptionValue,
            timestamp: new Date(),
            technicaldebt: this.state.technicaldebtValue,
            forecaster: this.state.forecastValue,
            archtechdebt: this.state.atdValue,
            decisionsupport: this.state.decisionValue,
            dependability: this.state.dependabilityValue,
            energy: this.state.energyValue,
            common: this.state.commonValue,
            private: isPrivateSet,
            sdk4edUser: this.state.sdk4edUser,
            sdk4edRoles: this.state.access.includes('company') ? this.state.sdk4edRoles : []
        };

        // console.log('new project', newProject); 

        let respStat;
        createProject(newProject)
            .then(resp => {
                respStat = resp.status;
                return resp.json()
            })
            .then(resp => {
                this.setState({ responseStatus: respStat });
                // Update project list
                this.props.updateList();
            });
    }



    renderAlert(status) {
        if (status === 200 || status === 201) {
            // Success, show feedback
            return <MDBAlert color="success">The project was successfully created </MDBAlert>
        } else if (status === 400) {
            // Show error message
            return <MDBAlert color="danger">The project could not be createed, please try again.</MDBAlert>
        }
        return null;
    }

    toggle = () => {
        if (!this.state.modal)
            history.push('/projects');

        this.setState({
            modal: !this.state.modal
        });
    }

    clearForm = () => {
        this.toggle();
        this.setState({
            nameValue: '',
            endpointValue: '',
            usernameValue: '',
            passwordValue: '',
            descriptionValue: '',
            responseStatus: null,
            technicaldebtValue: '{"language":"Java", "typeAnalysis":1,"moveClassRefactoring":false,"extractMethodRefactoring":false}',
            forecastValue: '',
            decisionValue: '',
            dependabilityValue: '',
            atdValue: '',
            energyValue: '',
            commonValue: ''
        })
    }

    renderForm() {
        return (
            <MDBContainer>
                <MDBRow>
                    <MDBCol md="12">
                        <form>
                            <div className="form-group">
                                <label htmlFor="accessInput">Access</label>
                                <div>
                                    <select id="selectAccess" onChange={this.changeAccess} value={this.state.access}>
                                        <option value="Public">Public</option>
                                        <option value="Private (company)">Private (Within company)</option>
                                        <option value="Private (Only me)">Private (Only me)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="nameInput">Project Name</label>
                                <input type="text" className="form-control" id="nameInput" placeholder="" autoComplete="off"
                                    value={this.state.nameValue} onChange={(e) => { this.handleChange(e, "NAME") }} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="endpointInput">Git URL</label>
                                <input type="text" className="form-control" id="endpointInput" placeholder="" autoComplete="off"
                                    value={this.state.endpointValue} onChange={(e) => { this.handleChange(e, "ENDPOINT") }} />
                            </div>
                            <div className="form-group">
                                <MDBRow>
                                    <MDBCol size="6">
                                        <label htmlFor="usernameInput">Git Username / Git AccessToken</label>
                                        <input type="text" className="form-control" id="usernameInput" placeholder="" autoComplete="off"
                                            value={this.state.usernameValue} onChange={(e) => { this.handleChange(e, "USERNAME") }} />
                                    </MDBCol>
                                    <MDBCol size="6">
                                        <label htmlFor="passwordInput">Git Password</label>
                                        <input type="password" className="form-control" id="passwordInput" placeholder="" autoComplete="off"
                                            value={this.state.passwordValue} onChange={(e) => { this.handleChange(e, "PASSWORD") }} />
                                    </MDBCol>
                                </MDBRow>
                            </div>
                            <div className="form-group">
                                <label htmlFor="descriptionInput">Description</label>
                                <textarea className="form-control" id="descriptionInput" rows="3"
                                    value={this.state.descriptionValue} onChange={(e) => { this.handleChange(e, "DESCRIPTION") }}></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="descriptionInput">Technical Debt toolbox info</label>
                                <div style={{ display: 'none' }}>
                                    <select id="selectToolbox" onChange={this.changeToolbox} value={this.state.toolbox}>
                                        <option value="Decision Support">Decision Support</option>
                                        <option value="Dependability">Dependability</option>
                                        <option value="Energy">Energy</option>
                                        <option value="Forecaster">Forecaster</option>
                                        <option value="Technical Debt">Technical Debt</option>
                                        <option value="Architecture Refactoring">Architecture Refactoring</option>
                                    </select>
                                </div>

                                <textarea style={{ display: this.state.toolbox === 'Technical Debt' ? 'block' : 'none' }} className="form-control" id="technicaldebtInput" rows="3"
                                    value={this.state.technicaldebtValue} onChange={(e) => { this.handleChange(e, "TECHNICALDEBT") }}></textarea>

                                <textarea style={{ display: this.state.toolbox === 'Architecture Refactoring' ? 'block' : 'none' }} className="form-control" id="architectureDebtInput" rows="3"
                                    value={this.state.atdValue} onChange={(e) => { this.handleChange(e, "ARCHTECHNICALDEBT") }}></textarea>

                                <textarea style={{ display: this.state.toolbox === 'Forecaster' ? 'block' : 'none' }} className="form-control" id="forecastInput" rows="3"
                                    value={this.state.forecastValue} onChange={(e) => { this.handleChange(e, "FORECAST") }}></textarea>

                                <textarea style={{ display: this.state.toolbox === 'Decision Support' ? 'block' : 'none' }} className="form-control" id="decisionInput" rows="3"
                                    value={this.state.decisionValue} onChange={(e) => { this.handleChange(e, "DECISION") }}></textarea>

                                <textarea style={{ display: this.state.toolbox === 'Dependability' ? 'block' : 'none' }} className="form-control" id="dependabilityInput" rows="3"
                                    value={this.state.dependabilityValue} onChange={(e) => { this.handleChange(e, "DEPENDABILITY") }}></textarea>

                                <textarea style={{ display: this.state.toolbox === 'Energy' ? 'block' : 'none' }} className="form-control" id="energyInput" rows="3"
                                    value={this.state.energyValue} onChange={(e) => { this.handleChange(e, "ENERGY") }}></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="descriptionInput">Extra info common (for all toolboxes)</label>
                                <textarea className="form-control" id="technicaldebtInput" rows="3"
                                    value={this.state.commonValue} onChange={(e) => { this.handleChange(e, "COMMON") }}></textarea>
                            </div>
                        </form>
                        <div>
                            {this.renderAlert(this.state.responseStatus)}
                        </div>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        );
    }

    render() {
        return (
            <MDBContainer>
                {/* BUTTON */}
                <MDBBtn className="white-text" color="  light-green darken-4" onClick={this.clearForm}>
                    <MDBIcon icon="plus" className="mr-1" size="lg" />New Project
                </MDBBtn>
                {/* MODAL */}
                <MDBModal isOpen={this.state.modal} toggle={this.toggle}    >
                    <MDBModalHeader toggle={this.toggle}>Create New Project</MDBModalHeader>
                    <MDBModalBody>
                        {this.renderForm()}
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="blue-grey" onClick={this.toggle}>Cancel</MDBBtn>
                        <MDBBtn className="white-text" color="  light-green darken-4" onClick={this.handleSubmit}>Save changes</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
            </MDBContainer>
        );
    }
}
export default NewProjectModalForm;
