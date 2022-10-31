import React from 'react';
import PropTypes from 'prop-types'
import { MDBCard, MDBCardBody, MDBCardHeader} from "mdbreact";
import { Link } from 'react-router-dom';

/**
 * A panel to use as a container for generic content.
 */
export class PagePanel extends React.Component {
  
  static propTypes = {
    /**
     * The link to use when the user clicks on the header of this panel.
     */
    linkTo: PropTypes.string,

    /**
     * The title of this panel.
     */
    header: PropTypes.string,

    /**
     * The content of this panel.
     */
    children: PropTypes.element
  }

  render(){
    return (
      <React.Fragment>
      <MDBCard className="card-body pt-0 pl-0 pr-0 mb-4" style={{boxShadow: "0px 0px"}}>
        <MDBCardHeader className="sdk4ed-color" tag="h3">
          <Link to={this.props.linkTo}>{this.props.header}</Link> 
        </MDBCardHeader>
        <MDBCardBody className="pl-1 pr-1">
        {this.props.children}
        </MDBCardBody>
      </MDBCard>
      </React.Fragment>)
  }
};