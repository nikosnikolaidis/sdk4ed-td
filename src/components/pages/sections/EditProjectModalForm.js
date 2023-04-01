import React, { Component } from 'react';
import jwt_decode from "jwt-decode";
import {
    MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter,
    MDBIcon, MDBRow, MDBCol, MDBAlert, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu,
    MDBDropdownItem
} from 'mdbreact';
import { editProject, fetchSingleProject } from '../../../apis/projects';
import history from '../../../history';


class EditProjectModalForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            toolbox: 'Technical Debt',
            modal: false,
            idValue: '',
            nameValue: '',
            endpointValue: '',
            usernameValue: '',
            passwordValue: '',
            descriptionValue: '',
            timestampValue: null,
            responseStatus: null,
            technicaldebtValue: '',
            // forecastValue: '',
            // decisionValue: '',
            // dependabilityValue: '',
            // energyValue: '',
            // commonValue: '',
            sdk4edUser: '',
            sdk4edRoles: [],
            access: 'Public',
            isAdmin: false,
            buttonText: 'Edit'
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
                    for (let i = 0; i < decoded.realm_access.roles.length; i++) {
                        if (decoded.realm_access.roles[i].includes('admin')) {
                            this.setState({ isAdmin: true })
                        }
                    }
                    this.setState({ sdk4edRoles: decoded.realm_access.roles });
                }
                this.setState({ sdk4edUser: decoded.email });
            }

            if (this.props.id !== undefined) {
                fetchSingleProject(this.props.id)
                    .then(resp => {
                        return resp.json()
                    })
                    .then(resp => {
                        this.setState({
                            idValue: resp.id,
                            nameValue: resp.name,
                            usernameValue: resp.username,
                            passwordValue: resp.password,
                            descriptionValue: resp.description,
                            endpointValue: resp.endpoint,
                            timestampValue: resp.timestamp,
                            technicaldebtValue: resp.technicaldebt,
                            // forecastValue: resp.forecaster,
                            // decisionValue: resp.decisionsupport,
                            // dependabilityValue: resp.dependability,
                            // energyValue: resp.energy,
                            // atdValue: resp.archtechdebt,
                            // commonValue: resp.common,
                            private: resp.private,
                        });

                        if (resp.private && (resp.sdk4edRoles && resp.sdk4edRoles.length > 0)) {
                            this.setState({ access: 'Private (company)' });
                        } else if (resp.private && (resp.sdk4edRoles && resp.sdk4edRoles.length == 0)) {
                            this.setState({ access: 'Private (Only me)' });
                        } else {
                            this.setState({ access: 'Public' });
                        }

                        if (this.state.sdk4edUser == resp.sdk4edUser) {
                            this.setState({ buttonText: 'Edit' });
                        } else if (this.state.isAdmin && resp.private) {
                            this.setState({ buttonText: 'Edit' });
                        } else if (this.state.isAdmin && !resp.private) {
                            this.setState({ buttonText: 'Edit' });
                        } else if (!this.state.isAdmin && !resp.private) {
                            this.setState({ buttonText: 'Edit' });
                        } else if (!this.state.isAdmin && resp.private) {
                            this.setState({ buttonText: 'Details' });
                        }
                    });
            }
        }
    }

    validateFields = () => {
        const { usernameValue, passwordValue } = this.state;
        if (usernameValue && passwordValue) {
            return true;
        }
        return false;
    };

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
            case 'TECHNICALDEBT':
                this.setState({ technicaldebtValue: event.target.value });
                break;
            // case 'ARCHTECHNICALDEBT':
            //     this.setState({ atdValue: event.target.value });
            //     break;
            // case 'FORECAST':
            //     this.setState({ forecastValue: event.target.value });
            //     break;
            // case 'DECISION':
            //     this.setState({ decisionValue: event.target.value });
            //     break;
            // case 'DEPENDABILITY':
            //     this.setState({ dependabilityValue: event.target.value });
            //     break;
            // case 'ENERGY':
            //     this.setState({ energyValue: event.target.value });
            //     break;
            // case 'COMMON':
            //     this.setState({ commonValue: event.target.value });
            //     break;
            default:
                break;
        }
        if (!this.validateFields()) {
            this.setState({ isSaveDisabled: false })
        }
    }

    changeToolbox = (event) => {
        this.setState({ toolbox: event.target.value });
    }

    changeAccess = (event) => {
        this.setState({ access: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let isPrivateSet = this.state.access.includes('Private') ? true : false;
        const updatedProject = {
            id: this.props.id,
            name: this.state.nameValue,
            endpoint: this.state.endpointValue,
            username: this.state.usernameValue,
            password: this.state.passwordValue,
            description: this.state.descriptionValue,
            timestamp: new Date(),
            technicaldebt: this.state.technicaldebtValue,
            // forecaster: this.state.forecastValue,
            // archtechdebt: this.state.atdValue,
            // decisionsupport: this.state.decisionValue,
            // dependability: this.state.dependabilityValue,
            // energy: this.state.energyValue,
            // common: this.state.commonValue,
            private: isPrivateSet,
            sdk4edUser: this.state.sdk4edUser,
            sdk4edRoles: this.state.access.includes('company') ? this.state.sdk4edRoles : []
        };

        let respStat;
        editProject(this.props.id, updatedProject)
            .then(resp => {
                respStat = resp.status;
                return resp.json();
            })
            .then(resp => {
                this.setState({ responseStatus: respStat });
                // Update project list
                this.props.updateList();
            });
    }

    renderAlert(status) {
        if (status === 200) {
            // Success, show feedback
            return <MDBAlert color="success">The project was updated successfully</MDBAlert>
        } else if (status === 400) {
            // Show error message
            return <MDBAlert color="danger">The project could not be updated, please try again.</MDBAlert>
        }
        return null;
    }

    toggle = () => {
        this.setState({ responseStatus: null });

        this.setState({
            modal: !this.state.modal
        });

        if (this.state.modal) {
            history.push('/');
            window.location.reload();
        }

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
                                    <select id="selectAccess" onChange={this.changeAccess} value={this.state.access} disabled={this.state.buttonText != 'Edit'}>
                                        <option value="Public">Public</option>
                                        <option value="Private (company)">Private (Within company)</option>
                                        <option value="Private (Only me)">Private (Only me)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="nameInput">Project Name</label>
                                <input type="text" className="form-control" id="nameInput" placeholder="" autoComplete="off"
                                    value={this.state.nameValue} onChange={(e) => { this.handleChange(e, "NAME") }} readOnly={this.state.buttonText != 'Edit'} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="endpointInput">Git URL</label>
                                <input type="text" className="form-control" id="endpointInput" placeholder="" autoComplete="off"
                                    value={this.state.endpointValue} onChange={(e) => { this.handleChange(e, "ENDPOINT") }} readOnly={this.state.buttonText != 'Edit'} />
                            </div>
                            <div className="form-group">
                                <MDBRow>
                                    <MDBCol size="6">
                                        <label htmlFor="usernameInput">Git Username</label>
                                        <input type="text" className="form-control" id="usernameInput" placeholder="" autoComplete="off"
                                            value={this.state.usernameValue} onChange={(e) => { this.handleChange(e, "USERNAME") }} readOnly={this.state.buttonText != 'Edit'} />
                                    </MDBCol>
                                    <MDBCol size="6">
                                        <label htmlFor="passwordInput">Git Password / Git AccessToken</label>
                                        <input type="password" className="form-control" id="passwordInput" placeholder="" autoComplete="off"
                                            value={this.state.passwordValue} onChange={(e) => { this.handleChange(e, "PASSWORD") }} readOnly={this.state.buttonText != 'Edit'} />
                                    </MDBCol>
                                </MDBRow>
                            </div>
                            <div className="form-group">
                                <label htmlFor="descriptionInput">Description</label>
                                <textarea className="form-control" id="descriptionInput" rows="6"
                                    value={this.state.descriptionValue} onChange={(e) => { this.handleChange(e, "DESCRIPTION") }} readOnly={this.state.buttonText != 'Edit'}></textarea>
                            </div>
                            {/* <div className="form-group">
                                <label htmlFor="descriptionInput">Technical Debt toolbox info</label>
                                <div style={{ display: 'none' }}>
                                    <select id="selectToolbox" onChange={this.changeToolbox} value={this.state.toolbox} disabled={this.state.buttonText != 'Edit'}>
                                        <option value="Decision Support">Decision Support</option>
                                        <option value="Dependability">Dependability</option>
                                        <option value="Energy">Energy</option>
                                        <option value="Forecaster">Forecaster</option>
                                        <option value="Technical Debt">Technical Debt</option>
                                        <option value="Architecture Refactoring">Architecture Refactoring</option>
                                    </select>
                                </div>

                                <textarea style={{ display: this.state.toolbox === 'Technical Debt' ? 'block' : 'none' }} className="form-control" id="technicaldebtInput" rows="3"
                                    value={this.state.technicaldebtValue} onChange={(e) => { this.handleChange(e, "TECHNICALDEBT") }} readOnly={this.state.buttonText != 'Edit'}></textarea>

                                <textarea style={{ display: this.state.toolbox === 'Architecture Refactoring' ? 'block' : 'none' }} className="form-control" id="architectureDebtInput" rows="3"
                                    value={this.state.atdValue} onChange={(e) => { this.handleChange(e, "ARCHTECHNICALDEBT") }} readOnly={this.state.buttonText != 'Edit'}></textarea>

                                <textarea style={{ display: this.state.toolbox === 'Forecaster' ? 'block' : 'none' }} className="form-control" id="forecastInput" rows="3"
                                    value={this.state.forecastValue} onChange={(e) => { this.handleChange(e, "FORECAST") }} readOnly={this.state.buttonText != 'Edit'}></textarea>

                                <textarea style={{ display: this.state.toolbox === 'Decision Support' ? 'block' : 'none' }} className="form-control" id="decisionInput" rows="3"
                                    value={this.state.decisionValue} onChange={(e) => { this.handleChange(e, "DECISION") }} readOnly={this.state.buttonText != 'Edit'}></textarea>

                                <textarea style={{ display: this.state.toolbox === 'Dependability' ? 'block' : 'none' }} className="form-control" id="dependabilityInput" rows="3"
                                    value={this.state.dependabilityValue} onChange={(e) => { this.handleChange(e, "DEPENDABILITY") }} readOnly={this.state.buttonText != 'Edit'}></textarea>

                                <textarea style={{ display: this.state.toolbox === 'Energy' ? 'block' : 'none' }} className="form-control" id="energyInput" rows="3"
                                    value={this.state.energyValue} onChange={(e) => { this.handleChange(e, "ENERGY") }} readOnly={this.state.buttonText != 'Edit'}></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="descriptionInput">Extra info common (for all toolboxes)</label>
                                <textarea className="form-control" id="commonInput" rows="3"
                                    value={this.state.commonValue} onChange={(e) => { this.handleChange(e, "COMMON") }} readOnly={this.state.buttonText != 'Edit'}></textarea>
                            </div> */}

                            <p style={{ fontSize: '8pt' }}>Last modified: {this.state.timestampValue ? new Date(this.state.timestampValue).toLocaleString() : null}</p>
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
        const { private: isPrivate } = this.state;
        const { usernameValue, passwordValue } = this.state;
        const isSaveDisabled = ((isPrivate && (!usernameValue || !passwordValue)) || (this.state.buttonText != 'Edit'));

        return (
            <span>
                <MDBBtn className="white-text" size="sm" color="warning" onClick={this.toggle}>
                    {this.state.buttonText}
                </MDBBtn>

                {/* MODAL */}
                <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
                    <MDBModalHeader className="light-green darken-4 white-text" toggle={this.toggle}>Edit Project
                    </MDBModalHeader>
                    <small style={{ padding: '0px 30px', textAlign: 'right', color: '#c0c0c0' }}>Id:{this.state.idValue}</small>
                    <MDBModalBody>
                        {this.renderForm()}
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="blue-grey" onClick={this.toggle} >Cancel</MDBBtn>
                        <MDBBtn className="white-text darken-4 light-green" onClick={this.handleSubmit} disabled={isSaveDisabled}>Save changes</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
            </span>
        );
    }
}
export default EditProjectModalForm;
