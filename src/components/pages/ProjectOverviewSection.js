import React from 'react';
import { MDBCard, MDBCardBody, MDBIcon, MDBRow, MDBCol, MDBCardText, MDBCardHeader } from 'mdbreact';

const ProjectOverviewSection = () => {
    return (
        <React.Fragment>
            <MDBCard className="mb-4">
                <MDBCardHeader><h3 style={{color:'#548235'}}><b>Project: <span style={{color:'#000000'}}>Holisun</span></b></h3></MDBCardHeader>
                <MDBCardBody>
                    <MDBRow className="mb-6">
                        <MDBCol xl="3" className="mb-r">
                            <MDBCard className="cascading-admin-card">
                                <div className="admin-up">
                                    <MDBIcon icon="chart-area" className="sdk4ed-color"/>
                                    <div className="data">
                                        <p>TECHNICAL DEBT PRINCIPAL</p>
                                        <h4>
                                            <strong>909.33€</strong>
                                        </h4>
                                        <p>TECHNICAL DEBT INTEREST</p>
                                        <h4>
                                            <strong>46.74€</strong>
                                        </h4>
                                    </div>
                                </div>
                                <MDBCardBody>
                                    <div className="progress">
                                        <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="25" className="progress-bar sdk4ed-color" role="progressbar"
                                            style={{width: '25%'}}>
                                        </div>
                                    </div>
                                    <MDBCardText>Better than last week (25%)</MDBCardText>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                        <MDBCol xl="3" md="6" className="mb-r">
                            <MDBCard className="cascading-admin-card">
                                <div className="admin-up">
                                    <MDBIcon icon="bolt" className="sdk4ed-color"/>
                                        <div className="data">
                                        <p>CPU CYCLES</p>
                                        <h4>
                                            <strong>3158456</strong>
                                        </h4>
                                        <p>MEMORY ACCESSES</p>
                                        <h4>
                                            <strong>154000</strong>
                                        </h4>
                                    </div>
                                </div>
                                <MDBCardBody>
                                    <div className="progress">
                                        <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="25" className="progress-bar bg grey" role="progressbar"
                                            style={{width: '25%'}}>
                                        </div>
                                    </div>
                                    <MDBCardText>Worse than last week (25%)</MDBCardText>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                        <MDBCol xl="3" md="6" className="mb-r">
                            <MDBCard className="cascading-admin-card">
                                <div className="admin-up">
                                    <MDBIcon icon="shield-alt" className="sdk4ed-color"/>
                                    <div className="data">
                                        <p>SECURITY INDEX</p>
                                        <h4>
                                            <strong>72%</strong>
                                        </h4>
                                        <p>POTENTIALLY VULNERABLE CLASSES</p>
                                        <h4>
                                            <strong>10</strong> of 31
                                        </h4>
                                    </div>
                                </div>
                                <MDBCardBody>
                                    <div className="progress">
                                        <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="25" className="progress-bar grey darken-2" role="progressbar"
                                            style={{width: '75%'}}>
                                        </div>
                                    </div>
                                    <MDBCardText>Worse than last week (75%)</MDBCardText>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                        <MDBCol xl="3" md="6" className="mb-r">
                            <MDBCard className="cascading-admin-card">
                                <div className="admin-up">
                                    <MDBIcon icon="compass" className="sdk4ed-color"/>
                                    <div className="data">
                                        <p>TECHNICAL DEBT FORECAST</p>
                                        <h4>
                                            <i key="cell1" className="far fa-arrow-alt-circle-up mr-2 red-text" aria-hidden="true"></i><strong>0.5%</strong>
                                        </h4>
                                        <p>SECURITY INDEX FORECAST</p>
                                        <h4>
                                            <i key="cell1" className="far fa-arrow-alt-circle-up mr-2 green-text" aria-hidden="true"></i><strong>3.2%</strong>
                                        </h4>
                                    </div>
                                </div>
                                <MDBCardBody>
                                    <div className="progress">
                                        <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="25" className="progress-bar sdk4ed-color" role="progressbar"
                                            style={{width: '25%'}}>
                                        </div>
                                    </div>
                                    <MDBCardText>Better than last week (25%)</MDBCardText>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBCardBody>
            </MDBCard>

            
            <MDBCard className="mb-4">
                <MDBCardHeader><h3 style={{color:'#548235'}}><b>Project: <span style={{color:'#000000'}}>Neurasmus</span></b></h3></MDBCardHeader>
                <MDBCardBody>
                    <MDBRow className="mb-6">
                        <MDBCol xl="3" md="6" className="mb-r">
                            <MDBCard className="cascading-admin-card">
                                <div className="admin-up">
                                    <MDBIcon icon="chart-area" className="sdk4ed-color"/>
                                    <div className="data">
                                        <p>TECHNICAL DEBT PRINCIPAL</p>
                                        <h4>
                                            <strong>850.00€</strong>
                                        </h4>
                                        <p>TECHNICAL DEBT INTEREST</p>
                                        <h4>
                                            <strong>126.74€</strong>
                                        </h4>
                                    </div>
                                </div>
                                <MDBCardBody>
                                    <div className="progress">
                                        <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="25" className="progress-bar sdk4ed-color" role="progressbar"
                                            style={{width: '25%'}}>
                                        </div>
                                    </div>
                                    <MDBCardText>Better than last week (25%)</MDBCardText>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                        <MDBCol xl="3" md="6" className="mb-r">
                            <MDBCard className="cascading-admin-card">
                                <div className="admin-up">
                                    <MDBIcon icon="bolt" className="sdk4ed-color"/>
                                        <div className="data">
                                        <p>CPU CYCLES</p>
                                        <h4>
                                            <strong>608599</strong>
                                        </h4>
                                        <p>MEMORY ACCESSES</p>
                                        <h4>
                                            <strong>36585</strong>
                                        </h4>
                                    </div>
                                </div>
                                <MDBCardBody>
                                    <div className="progress">
                                        <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="25" className="progress-bar bg grey" role="progressbar"
                                            style={{width: '25%'}}>
                                        </div>
                                    </div>
                                    <MDBCardText>Worse than last week (25%)</MDBCardText>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                        <MDBCol xl="3" md="6" className="mb-r">
                            <MDBCard className="cascading-admin-card">
                                <div className="admin-up">
                                    <MDBIcon icon="shield-alt" className="sdk4ed-color"/>
                                    <div className="data">
                                        <p>SECURITY INDEX</p>
                                        <h4>
                                            <strong>93%</strong>
                                        </h4>
                                        <p>POTENTIALLY VULNERABLE CLASSES</p>
                                        <h4>
                                            <strong>1</strong> of 19
                                        </h4>
                                    </div>
                                </div>
                                <MDBCardBody>
                                    <div className="progress">
                                        <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="25" className="progress-bar grey darken-2" role="progressbar"
                                            style={{width: '75%'}}>
                                        </div>
                                    </div>
                                    <MDBCardText>Worse than last week (75%)</MDBCardText>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                        <MDBCol xl="3" md="6" className="mb-r">
                            <MDBCard className="cascading-admin-card">
                                <div className="admin-up">
                                    <MDBIcon icon="compass" className="sdk4ed-color"/>
                                    <div className="data">
                                        <p>TECHNICAL DEBT FORECAST</p>
                                        <h4>
                                            <i key="cell1" className="far fa-arrow-alt-circle-up mr-2 red-text" aria-hidden="true"></i><strong>3.0%</strong>
                                        </h4>
                                        <p>SECURITY INDEX FORECAST</p>
                                        <h4>
                                            <i key="cell1" className="far fa-arrow-alt-circle-up mr-2 green-text" aria-hidden="true"></i><strong>0.2%</strong>
                                        </h4>
                                    </div>
                                </div>
                                <MDBCardBody>
                                    <div className="progress">
                                        <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="13" className="progress-bar grey darken-2" role="progressbar"
                                            style={{width: '25%'}}>
                                        </div>
                                    </div>
                                    <MDBCardText>Worse than last week (13%)</MDBCardText>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBCardBody>
            </MDBCard>
            
            <MDBCard className="mb-4">
                <MDBCardHeader><h3 style={{color:'#548235'}}><b>Project: <span style={{color:'#000000'}}>Airbus</span></b></h3></MDBCardHeader>
                <MDBCardBody>
                    <MDBRow className="mb-6">
                        <MDBCol xl="3" md="6" className="mb-r">
                            <MDBCard className="cascading-admin-card">
                                <div className="admin-up">
                                    <MDBIcon icon="chart-area" className="sdk4ed-color"/>
                                    <div className="data">
                                        <p>TECHNICAL DEBT PRINCIPAL</p>
                                        <h4>
                                            <strong>609060.00€</strong>
                                        </h4>
                                        <p>TECHNICAL DEBT INTEREST</p>
                                        <h4>
                                            <strong>2874.74€</strong>
                                        </h4>
                                    </div>
                                </div>
                                <MDBCardBody>
                                    <div className="progress">
                                        <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="25" className="progress-bar sdk4ed-color" role="progressbar"
                                            style={{width: '25%'}}>
                                        </div>
                                    </div>
                                    <MDBCardText>Better than last week (25%)</MDBCardText>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                        <MDBCol xl="3" md="6" className="mb-r">
                            <MDBCard className="cascading-admin-card">
                                <div className="admin-up">
                                    <MDBIcon icon="bolt" className="sdk4ed-color"/>
                                        <div className="data">
                                        <p>CPU CYCLES</p>
                                        <h4>
                                            <strong>18764557</strong>
                                        </h4>
                                        <p>MEMORY ACCESSES</p>
                                        <h4>
                                            <strong>249456</strong>
                                        </h4>
                                    </div>
                                </div>
                                <MDBCardBody>
                                    <div className="progress">
                                        <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="25" className="progress-bar bg grey" role="progressbar"
                                            style={{width: '25%'}}>
                                        </div>
                                    </div>
                                    <MDBCardText>Worse than last week (25%)</MDBCardText>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                        <MDBCol xl="3" md="6" className="mb-r">
                            <MDBCard className="cascading-admin-card">
                                <div className="admin-up">
                                    <MDBIcon icon="shield-alt" className="sdk4ed-color"/>
                                    <div className="data">
                                        <p>SECURITY INDEX</p>
                                        <h4>
                                            <strong>86%</strong>
                                        </h4>
                                        <p>POTENTIALLY VULNERABLE CLASSES</p>
                                        <h4>
                                            <strong>81</strong> of 256
                                        </h4>
                                    </div>
                                </div>
                                <MDBCardBody>
                                    <div className="progress">
                                        <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="25" className="progress-bar grey darken-2" role="progressbar"
                                            style={{width: '75%'}}>
                                        </div>
                                    </div>
                                    <MDBCardText>Worse than last week (75%)</MDBCardText>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                        <MDBCol xl="3" md="6" className="mb-r">
                            <MDBCard className="cascading-admin-card">
                                <div className="admin-up">
                                    <MDBIcon icon="compass" className="sdk4ed-color"/>
                                    <div className="data">
                                        <p>TECHNICAL DEBT FORECAST</p>
                                        <h4>
                                            <i key="cell1" className="far fa-arrow-alt-circle-down mr-2 green-text" aria-hidden="true"></i><strong>2.4%</strong>
                                        </h4>
                                        <p>SECURITY INDEX FORECAST</p>
                                        <h4>
                                            <i key="cell1" className="far fa-arrow-alt-circle-up mr-2 green-text" aria-hidden="true"></i><strong>2.6%</strong>
                                        </h4>
                                    </div>
                                </div>
                                <MDBCardBody>
                                    <div className="progress">
                                        <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="25" className="progress-bar sdk4ed-color" role="progressbar"
                                            style={{width: '25%'}}>
                                        </div>
                                    </div>
                                    <MDBCardText>Better than last week (25%)</MDBCardText>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBCardBody>
            </MDBCard>
        </React.Fragment>
    )
}

export default ProjectOverviewSection;