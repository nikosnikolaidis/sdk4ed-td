import { MDBCard, MDBCardBody, MDBCardHeader, MDBContainer } from 'mdbreact';
import PropTypes from 'prop-types';
import React, { useState } from 'react';


function CollapsibleTable({ title, children, className, isCollapsed, cardHeaderColor }) {
    const [collapsed, setCollapsed] = useState(isCollapsed || false);

    const handleToggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    return (
        //<MDBContainer>
            <MDBCard>
                <MDBCardHeader color={cardHeaderColor} className="sdk4ed-color" onClick={handleToggleCollapse} style={{ cursor: 'pointer' }}>{title}</MDBCardHeader>
                {!collapsed && (<MDBCardBody className={className}>
                    {children}
                </MDBCardBody>
                )}
            </MDBCard>
        //</MDBContainer>
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

        isCollapsed: PropTypes.bool,

        cardHeaderColor: PropTypes.string
    }

    render() {
        const color = this.props.cardHeaderColor ? this.props.cardHeaderColor : "sdk4ed-color";

        return (
            <CollapsibleTable title={this.props.title} className={this.props.className} children={this.props.children} isCollapsed={this.props.isCollapsed} cardHeaderColor={color} />
        )
    }
}

export default ContentPanel;