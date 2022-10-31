import React, { Component } from "react";
import { MDBCol, MDBCard, MDBCardBody, MDBRow, MDBCardHeader } from "mdbreact";
import Iframe from "react-iframe";

class DecisionSupportPage extends Component {

  render() {
    return (
      <MDBRow className="mb-4">
        <MDBCol md="6" lg="12" className="mb-12">
          <MDBCard className="mb-12">
            <MDBCardHeader className="sdk4ed-color">
              Decision Making Support Tool for Software Optimizations
            </MDBCardHeader>
            <MDBCardBody>
              <Iframe
                url="http://195.251.210.147:8438/"
                position="relative"
                id="IframeDS"
                width="100%"
                height="750px"
                frameBorder="0"
              />
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    );
  }
}

export default DecisionSupportPage;
