import React from 'react';
import PropTypes from 'prop-types'

/**
 * Simple loading animation to notify the user it is necessary to wait.
 */
class Loader extends React.Component{
    
    static propTypes = {
        /**
         * The height in pixels of the spinner. Default is 100.
         */
        height: PropTypes.number,

        /**
         * The width in pixels of the spinner. Default is 100.
         */
        width: PropTypes.number,

        /**
         * The text to visualize below the spinner. Default is 'Loading...'.
         */
        text: PropTypes.string
    }

    constructor(props){
        super(props)
        this.height = props.height == null ? 100 : props.height;
        this.width = props.width == null ? 100 : props.width;
        this.text = props.text == null ? "Loading..." : props.text;
    }

    render(){
    return (<div>
                <div className="d-flex justify-content-center">
                  <div className="spinner-border text-primary" role="status" style={{height: this.height, width: this.width}}/>
                </div>
                <div className="mt-3 text-center">{this.text}</div>
              </div>)
    }
}

export default Loader;