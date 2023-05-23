import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { MDBCard, MDBCardBody, MDBCardHeader } from "mdbreact";
import { Link } from 'react-router-dom';

function CollapsibleCard({ linkTo, header, children, isCollapsed }) {
  const [collapsed, setCollapsed] = useState(isCollapsed || false);

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <MDBCard className="card-body pt-0 pl-0 pr-0 mb-4" style={{ boxShadow: "0px 0px" }}>
      <MDBCardHeader className="sdk4ed-color" tag="h3" onClick={handleToggleCollapse} style={{ cursor: 'pointer' }}>
        <Link to={linkTo}>{header}</Link>
      </MDBCardHeader>
      {!collapsed && (
        <MDBCardBody className="pl-1 pr-1">
          {children}
        </MDBCardBody>
      )}
    </MDBCard>
  );
}

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
    children: PropTypes.element,

    isCollapsed: PropTypes.bool
  }

  render() {

    return (
      <CollapsibleCard linkTo={this.props.linkTo} header={this.props.header} isCollapsed={this.props.isCollapsed}>
        {this.props.children}
      </CollapsibleCard>
    )
  }
};