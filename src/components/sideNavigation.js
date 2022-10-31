import React, {PureComponent} from 'react';
import FileExplorer from "./pages/sections/FileExplorer"


class SideNavigation extends React.Component {
   
    render(){
        return (
            <div className="sidebar-fixed position-fixed">
            <FileExplorer/>
            </div>
        );
    }
}

export default SideNavigation;