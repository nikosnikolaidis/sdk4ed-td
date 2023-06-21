import { MDBCol, MDBCollapse, MDBContainer, MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle, MDBIcon, MDBListGroupItem, MDBNavbar, MDBNavbarNav, MDBNavbarToggler, MDBNavItem, MDBNavLink, MDBRow } from 'mdbreact';
import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import logo from "../assets/logo.png";

class TopNavigation extends Component {
    state = {
        collapse: false
    }

    onClick = () => {
        this.setState({
            collapse: !this.state.collapse,
        });
    }

    toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    componentDidMount() {
    }

    render() {
        return (
            <React.Fragment>
                <MDBNavbar className="flexible-navbar" light expand="md" scrolling>
                    <a href="#!" className="navbar-left logo-wrapper waves-effect">
                        <img alt="SDK4ED logo" className="mr-3 ml-4" src={logo} style={{ height: 40 }} />
                    </a>
                    <MDBNavbarToggler onClick={this.onClick} />
                    <MDBCollapse isOpen={this.state.collapse} navbar>
                        <MDBNavbarNav left>
                            <MDBNavItem active={this.props.location.pathname === '/'}>
                                <MDBNavLink to="/">Projects</MDBNavLink>
                            </MDBNavItem>
                            {/* <MDBNavItem active={this.props.location.pathname === '/' || this.props.location.pathname === '/projects'}>
                                <MDBNavLink to="/">Projects</MDBNavLink>
                            </MDBNavItem> */}
                            <MDBNavItem>
                                {/* <a className="nav-link Ripple-parent" href="https://13.69.242.34/keycloak/auth/realms/SDK4ED/account" target="_blank">Settings</a> */}
                                {/* <a className="nav-link Ripple-parent" href="https://gitlab.seis.iti.gr:2443/keycloak/auth/realms/SDK4ED/account" target="_blank">Settings</a> */}
                                <a className="nav-link Ripple-parent" href={process.env.REACT_APP_USER_MANAGEMENT_SERVER_IP + "/realms/SDK4ED/account"} target="_blank">Settings</a>
                            </MDBNavItem>
                            <MDBNavItem>
                                <a className="nav-link Ripple-parent" href={"https://gitlab.seis.iti.gr/sdk4ed-wiki/wiki-home/wikis/home"} target="_blank">Documentation</a>
                            </MDBNavItem>
                        </MDBNavbarNav>
                        <MDBNavbarNav right>
                            {/* <MDBNavItem>
                                <a className="nav-link navbar-link" rel="noopener noreferrer" target="_blank" href="https://www.facebook.com/sdk4ed/"><MDBIcon fab icon="facebook" /></a>
                            </MDBNavItem>
                            <MDBNavItem>
                                <a className="nav-link navbar-link" rel="noopener noreferrer" target="_blank" href="https://twitter.com/SDK4ED"><MDBIcon fab icon="twitter" /></a>
                            </MDBNavItem>
                            <MDBNavItem>
                                <a className="border border-light rounded mr-1 nav-link Ripple-parent" rel="noopener noreferrer" href="http://160.40.52.130/" target="_blank"><MDBIcon fab icon="gitlab" className="mr-2" />SDK4ED GitLab</a>
                            </MDBNavItem> */}
                            <MDBNavItem>
                                {/* TODO!!! Change redirect_url from localhost!!! */}
                                {/* <a className="border border-success rounded mr-1 nav-link Ripple-parent" href="https://13.69.242.34/keycloak/auth/realms/SDK4ED/protocol/openid-connect/logout?redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F">Logout</a> */}
                                {/* <a className="border border-success rounded mr-1 nav-link Ripple-parent" href="https://gitlab.seis.iti.gr:2443/keycloak/auth/realms/SDK4ED/protocol/openid-connect/logout?redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F">Logout</a> */}
                                <a className="border border-success rounded mr-1 nav-link Ripple-parent" href={process.env.REACT_APP_USER_MANAGEMENT_SERVER_IP + "/realms/SDK4ED/protocol/openid-connect/logout?redirect_uri=http%3A%2F%2F195.251.210.147%3A3000"}>Logout</a>
                            </MDBNavItem>
                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBNavbar>

                <MDBNavbar className="flexible-navbar z-depth-0" expand="md" scrolling>
                    <MDBNavbarToggler onClick={this.onClick} />
                    <MDBCollapse isOpen={this.state.collapse} navbar>
                        <MDBNavbarNav left>
                            <MDBContainer>
                                <MDBRow>
                                    <MDBCol md="3" className="my-1 mx-0">
                                        <MDBNavItem active>
                                            <NavLink exact={true} to="/" activeClassName="activeClass">
                                                <MDBListGroupItem>
                                                    <MDBIcon icon="home" className="mr-3" />
                                                    Projects
                                                </MDBListGroupItem>
                                            </NavLink>
                                        </MDBNavItem>
                                    </MDBCol>

                                    <MDBCol md="3" className="my-1 mx-0">
                                        <MDBNavItem activeClassName="activeClass">
                                            <MDBDropdown activeClassName="activeClass">
                                                <MDBListGroupItem activeClassName="activeClass">
                                                    <MDBDropdownToggle className="pb-0 pr-0 pl-0 pt-0" nav caret activeClassName="activeClass">
                                                        <MDBIcon icon="chart-area" className="mr-3" />
                                                        <span className="mr-2">Technical Debt</span>
                                                    </MDBDropdownToggle>
                                                    <MDBDropdownMenu>
                                                        <MDBDropdownItem>
                                                            <NavLink to="/tdanalysis" activeClassName="activeClass">
                                                                TD Analysis
                                                            </NavLink>
                                                        </MDBDropdownItem>
                                                        <MDBDropdownItem>
                                                            <NavLink to="/tdnewcode" activeClassName="activeClass">
                                                                TD New Code
                                                            </NavLink>
                                                        </MDBDropdownItem>
                                                        <MDBDropdownItem>
                                                            <NavLink to="/tdclassifier" activeClassName="activeClass">
                                                                TD Classifier
                                                            </NavLink>
                                                        </MDBDropdownItem>
                                                    </MDBDropdownMenu>
                                                </MDBListGroupItem>
                                            </MDBDropdown>

                                        </MDBNavItem>
                                    </MDBCol>

                                    {/*<MDBCol md="3" className="my-1 mx-0"><MDBNavItem >
                                    <NavLink to="/energy" activeClassName="activeClass">
                                        <MDBListGroupItem className="h-100">
                                            <MDBIcon icon="bolt" className="mr-3" />
                                            Energy
                                </MDBListGroupItem>
                                    </NavLink>
                                </MDBNavItem></MDBCol>

								<MDBCol md="3" className="my-1 mx-0">
                                    <MDBNavItem  activeClassName="activeClass">
                                        <MDBDropdown activeClassName="activeClass">
                                            <MDBListGroupItem activeClassName="activeClass">
                                                <MDBDropdownToggle className="pb-0 pr-0 pl-0 pt-0" nav caret activeClassName="activeClass">
                                                    <MDBIcon icon="shield-alt" className="mr-3" />
                                                    <span className="mr-2">Dependability</span>
                                                </MDBDropdownToggle>
                                                <MDBDropdownMenu>
                                                    <MDBDropdownItem>
                                                        <NavLink to="/security" activeClassName="activeClass">
                                                            Security
        				                                </NavLink>
                                                    </MDBDropdownItem>
                                                    <MDBDropdownItem>
                                                        <NavLink to="/optimalcheckpoint" activeClassName="activeClass">
                                                            Optimal Checkpoint
                                      				  </NavLink>
                                                    </MDBDropdownItem>
                                                    <MDBDropdownItem>
                                                        <NavLink to="/evit" activeClassName="activeClass">
                                                            Exploitable Vulnerabilities Identification 
                                                        </NavLink>
                                                    </MDBDropdownItem>
                                                </MDBDropdownMenu>
                                            </MDBListGroupItem>
                                        </MDBDropdown>

                                    </MDBNavItem>

                                     </MDBCol>
                                     
                                <MDBCol md="3" className="my-1 mx-0"><MDBNavItem >

                                </MDBNavItem></MDBCol>*/}

                                    <MDBCol md="3" className="my-1 mx-0">
                                        <MDBNavItem activeClassName="activeClass">
                                            <MDBDropdown activeClassName="activeClass">
                                                <MDBListGroupItem activeClassName="activeClass">
                                                    <MDBDropdownToggle className="pb-0 pr-0 pl-0 pt-0" nav caret activeClassName="activeClass">
                                                        <MDBIcon icon="wrench" className="mr-3" />
                                                        <span className="mr-2">Refactorings</span>
                                                    </MDBDropdownToggle>
                                                    <MDBDropdownMenu>
                                                        <MDBDropdownItem>
                                                            <NavLink to="/refactoring" activeClassName="activeClass">
                                                                Code Refactoring
                                                            </NavLink>
                                                        </MDBDropdownItem>
                                                        <MDBDropdownItem>
                                                            <NavLink to="/designrefactoring" activeClassName="activeClass">
                                                                Design Refactoring
                                                            </NavLink>
                                                        </MDBDropdownItem>
                                                        {/*<MDBDropdownItem>
                                                        <NavLink to="/atdanalysis" activeClassName="activeClass">
                                                            Architecture Refactoring
                                       </NavLink>
                                                    </MDBDropdownItem>*/}
                                                    </MDBDropdownMenu>
                                                </MDBListGroupItem>
                                            </MDBDropdown>

                                        </MDBNavItem>
                                    </MDBCol>

                                    {/*<MDBCol md="3" className="my-1 mx-0">
                                    <MDBNavItem  activeClassName="activeClass">
                                        <MDBDropdown activeClassName="activeClass">
                                            <MDBListGroupItem activeClassName="activeClass">
                                                <MDBDropdownToggle className="pb-0 pr-0 pl-0 pt-0" nav caret activeClassName="activeClass">
                                                    <MDBIcon icon="chart-line" className="mr-3" />
                                                    <span className="mr-2">Forecast</span>
                                                </MDBDropdownToggle>
                                                <MDBDropdownMenu>
                                                    <MDBDropdownItem>
                                                        <NavLink to="/tdforecast" activeClassName="activeClass">
                                                            TD Forecast
                                        </NavLink>
                                                    </MDBDropdownItem>
                                                    <MDBDropdownItem>
                                                        <NavLink to="/energyforecast" activeClassName="activeClass">
                                                            Energy Forecast
                                        </NavLink>
                                                    </MDBDropdownItem>
                                                    <MDBDropdownItem>
                                                        <NavLink to="/securityforecast" activeClassName="activeClass">
                                                            Security Forecast
                                       </NavLink>
                                                    </MDBDropdownItem>
                                                </MDBDropdownMenu>
                                            </MDBListGroupItem>
                                        </MDBDropdown>

                                    </MDBNavItem>

                                     </MDBCol>*/}

                                    {/* <MDBCol md="3" className="my-1 mx-0">                            
                                <MDBNavItem >
                                    <NavLink to="/decsupp" activeClassName="activeClass">
                                        <MDBListGroupItem>
                                            <MDBIcon icon="balance-scale" className="mr-3" />
                                            Decision Support
                                </MDBListGroupItem>
                                    </NavLink>
                                </MDBNavItem>   
                                </MDBCol> */}

                                    <MDBCol md="3" className="my-1 mx-0">
                                        <MDBNavItem activeClassName="activeClass">
                                            <MDBDropdown activeClassName="activeClass">
                                                <MDBListGroupItem activeClassName="activeClass">
                                                    <MDBDropdownToggle
                                                        className="pb-0 pr-0 pl-0 pt-0"
                                                        nav
                                                        caret
                                                        activeClassName="activeClass"
                                                    >
                                                        <MDBIcon icon="compass" className="mr-3" />
                                                        <span className="mr-2">Decision Support</span>
                                                    </MDBDropdownToggle>
                                                    <MDBDropdownMenu>
                                                        {/*<MDBDropdownItem>
                              <NavLink
                                to="/decsupp"
                                activeClassName="activeClass"
                              >
                                Trade-off Manager
                              </NavLink>
                            </MDBDropdownItem>*/}
                                                        <MDBDropdownItem>
                                                            <NavLink
                                                                to="/refactoringsFinancialInvestment"
                                                                activeClassName="activeClass"
                                                            >
                                                                Refactorings as Financial Investment
                                                            </NavLink>
                                                        </MDBDropdownItem>
                                                    </MDBDropdownMenu>
                                                </MDBListGroupItem>
                                            </MDBDropdown>
                                        </MDBNavItem>
                                    </MDBCol>





                                </MDBRow></MDBContainer>
                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBNavbar>
            </React.Fragment >
        );
    }
}

export default withRouter(TopNavigation);
