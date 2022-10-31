import React from 'react';
import { MDBFooter, MDBBtn, MDBIcon } from 'mdbreact';

const Footer = () => {
    return (
        <MDBFooter className="ml-0 text-center font-small darken-2 sdk4ed-color">
            <div className="pt-4">
            
            </div>
            <div className="pb-4">
                <a href="https://www.facebook.com/sdk4ed/" target="_blank"> <MDBIcon fab icon="facebook" className="mr-3"/></a>
                <a href="https://twitter.com/SDK4ED" target="_blank"> <MDBIcon fab icon="twitter" className="mr-3"/></a>
                <a href="https://www.youtube.com/channel/UCb-lXERcbHCY5ScKmxfNAYQ" target="_blank"> <MDBIcon fab icon="youtube" className="mr-3"/></a>
                <a href="https://www.linkedin.com/groups/8692949/" target="_blank"> <MDBIcon fab icon="linkedin" className="mr-3"/></a>
                <a href="https://gitlab.seis.iti.gr/sdk4ed-wiki/wiki-home/wikis/home" target="_blank"> <MDBIcon fab icon="gitlab" className="mr-3"/></a>
                <a href="https://sdk4ed.eu/" target="_blank"> SDK4ED Consortium </a>
            </div>
            <p className="footer-copyright mb-0 py-3 text-center">
                &copy; {new Date().getFullYear()} Copyright Dashboard Template: <a href="https://www.MDBootstrap.com"> MDBootstrap.com </a>
            </p>
        </MDBFooter>
    );
}

export default Footer;