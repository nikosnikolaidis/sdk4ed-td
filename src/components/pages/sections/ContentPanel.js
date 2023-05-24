import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { MDBCard, MDBCardBody, MDBCardHeader, MDBContainer } from 'mdbreact'


function CollapsibleTable({ title, children, className, isCollapsed }) {
    const [collapsed, setCollapsed] = useState(isCollapsed || false);
  
    const handleToggleCollapse = () => {
      setCollapsed(!collapsed);
    };
  
    return (
        <MDBContainer>
            <MDBCard>
                <MDBCardHeader className="sdk4ed-color" onClick={handleToggleCollapse} style={{ cursor: 'pointer' }}>{title}</MDBCardHeader>
                {!collapsed && (<MDBCardBody className={className}>
                    {children}
                </MDBCardBody>
                )}
            </MDBCard>
        </MDBContainer>
    );
  }

/**
 * Generic component to render a panel used to display generic content.
 */
class ContentPanel extends React.Component {
    static propTypes = {
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
        children: PropTypes.element,

        isCollapsed: PropTypes.bool
    }

    render() {
        return (
            
            <CollapsibleTable title={this.props.title} className={this.props.className} children={this.props.children} isCollapsed={this.props.isCollapsed}/>
        )
    }
}

export default ContentPanel;