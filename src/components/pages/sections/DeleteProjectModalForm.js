import React from 'react';
import jwt_decode from "jwt-decode";
import { MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBAlert } from 'mdbreact';
import { deleteProject, fetchSingleProject } from '../../../apis/projects';
import history from '../../../history';

class DeleteProjectModalForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            responseStatus: null,
            sdk4edUser: '',
            sdk4edRoles: [],
            deleteAccess: false,
            isAdmin: false
        };
    }

    toggle = () => {
        console.log("delete state modal = " + this.state.modal)
        if (!this.state.modal) {
            history.push('/projects');
        }

        this.setState({
            modal: !this.state.modal
        });
        console.log("delete state modal = " + this.state.modal)
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
                        // console.log('IS ADMIN: ' + this.props.project.name, this.state.isAdmin ); 
                        // console.log('IS PRIVATE ' + this.props.project.name, this.props.project.private ); 
                        if (this.state.sdk4edUser == this.props.project.sdk4edUser) {
                            this.setState({ deleteAccess: true });
                        } else if (this.state.isAdmin && this.props.project.private) {
                            this.setState({ deleteAccess: true });
                        } else if (this.state.isAdmin && !this.props.project.private) {
                            this.setState({ deleteAccess: true });
                        } else if (!this.state.isAdmin && !this.props.project.private) {
                            this.setState({ deleteAccess: true });
                        } else if (!this.state.isAdmin && this.props.project.private) {
                            this.setState({ deleteAccess: false });
                        }
                    });
            } else {
                if (this.state.sdk4edUser == this.props.project.sdk4edUser) {
                    this.setState({ deleteAccess: true });
                } else if (this.state.isAdmin && this.props.project.private) {
                    this.setState({ deleteAccess: true });
                } else if (this.state.isAdmin && !this.props.project.private) {
                    this.setState({ deleteAccess: true });
                } else if (!this.state.isAdmin && !this.props.project.private) {
                    this.setState({ deleteAccess: true });
                } else if (!this.state.isAdmin && this.props.project.private) {
                    this.setState({ deleteAccess: false });
                }
            }
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let respStat;
        deleteProject(this.props.project.id).then(resp => {
            respStat = resp.status;
            this.setState({ responseStatus: respStat });
            // Update project list
            this.props.updateList();
        }, error => {
            console.log('delete error', error);
        });
    }

    renderAlert(status) {
        if (status === 200) {
            // Success, show feedback
            return <MDBAlert color="success">The project was deleted successfully</MDBAlert>
        } else if (status === 400) {
            // Show error message
            return <MDBAlert color="danger">The project could not be deleted, please try again.</MDBAlert>
        }
        return null;
    }


    renderConfirmMessage() {
        if (this.state.responseStatus == null) {
            return <span>Are you sure that you want to delete project: <b>{this.props.project.name}</b>?</span>
        }
        return null;
    }

    render() {
        return (
            <span>
                <MDBBtn className="white-text" size="sm" color="red darken-4" onClick={this.toggle} disabled={!this.state.deleteAccess}>
                    Delete
                </MDBBtn>

                {/* MODAL */}
                <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
                    <MDBModalHeader toggle={this.toggle}>Delete Project
                    </MDBModalHeader>
                    <MDBModalBody>
                        {this.renderConfirmMessage()}
                        <div>
                            {this.renderAlert(this.state.responseStatus)}
                        </div>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="blue-grey" onClick={this.toggle}>Cancel</MDBBtn>
                        <MDBBtn className="white-text" color="red darken-4" onClick={this.handleSubmit}>Delete</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
            </span>
        );
    }
}

export default DeleteProjectModalForm;
