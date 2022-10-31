import React from 'react';
import PropTypes from 'prop-types'
import { MDBCard, MDBCardBody, MDBCardHeader, MDBContainer } from 'mdbreact'


/**
 * Generic component to render a panel used to display generic content.
 */
class ContentPanel extends React.Component{
    static propTypes ={
        /**
         * The title of the panel.
         */
        title: PropTypes.string,

        /**
         * The classes to pass to the inner CardBody.
         */
        className: PropTypes.string,

        /**
         * The React components to display within the panel.
         */
        children: PropTypes.element
    }

    render(){
        return (
            <MDBContainer>
            <MDBCard>
            <MDBCardHeader className="sdk4ed-color">{this.props.title}</MDBCardHeader>
            <MDBCardBody className={this.props.className}>
                {this.props.children}
            </MDBCardBody>
            </MDBCard>
            </MDBContainer>
        )
    }
}
  
export default ContentPanel;