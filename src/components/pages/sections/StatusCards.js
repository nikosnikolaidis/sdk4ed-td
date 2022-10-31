import React from 'react';
import PropTypes from 'prop-types'
import { MDBCard, MDBCardBody, MDBIcon, MDBRow, MDBCol } from 'mdbreact';

const descriptionCard = (text, color) => {  if(text != null)
   return <MDBCardBody className={"mb-0 pb-1 pt-1 " + color}><p>{text}</p></MDBCardBody>
   else return <MDBCardBody></MDBCardBody>
  }


/**
 * A component that represents a score with star-based rating visualization.
 */
export class ScoreCard extends React.Component {
  
  static propTypes = {
    /**
     * The color to use as a background for this card. Bootstrap coloring scheme can be used.
     */  
    color: PropTypes.string,

    /**
     * The score to visualize.
     */
    score: PropTypes.oneOf([1, 2, 3, 4, 5])

  }

  render(){
    var color = "primary-color"
    if (this.props.color != null){
      color = this.props.color
    }
    var stars = []
    var score = this.props.score == null ? 0 : parseInt(this.props.score)
    for(var i = 1; i <= 5; i++){
      var star = i <= score ? "sdk4ed-color-fg" : "grey-text"
      stars.push(<i className={"fas fa-star fa-3x " + star} key={i} ></i>)
    }
    return(
      <React.Fragment>
        <MDBCard color={color} className="classic-admin-card">
          <MDBCardBody>
          <div className="float-left black-text">Score</div>
          <div className="float-right">
            <MDBRow><MDBCol>{stars}</MDBCol></MDBRow>
          </div>
          </MDBCardBody>
        </MDBCard>
      </React.Fragment>
    )
  }
}
   
/**
 * A card used to visualize a single number.
 */
export class CountCard extends React.Component {
  
  static propTypes = {
    /**
     * The backgrond color to use. Bootstrap coloring scheme can be used.
     */
    color: PropTypes.string,

    /**
     * The name of the icon to use. Icon list available at: https://mdbootstrap.com/docs/jquery/content/icons-list/
     */
    icon: PropTypes.string,

    /**
     * The title to visualize.
     */
    title: PropTypes.string,

    /**
     * A brief description that complements the information given by `value`.
     */
    description: PropTypes.string,

    /**
     * The value (usually a number) to visualize.
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }

  render(){
    var color = "dark-color"//"primary-color"
    if (this.props.color){
      color = this.props.color
    }
    var textColor = "black-text" //"white-text"
    if(this.props.textColor){
      textColor = this.props.textColor
    }
    
    var colorIcon = "dark-color"
    
    return (
      <React.Fragment>
      <MDBCard color={colorIcon} className="classic-admin-card">
        <MDBCardBody>
          <div className="grey-text"><MDBIcon icon={this.props.icon} size="3x"/></div>
          <p className={textColor}>{this.props.title}</p>
          <div className="grey-text"><h4><strong  className={textColor}>{this.props.value}</strong></h4></div>
        </MDBCardBody>
        {descriptionCard(this.props.description, color)}
      </MDBCard>
      </React.Fragment>
    )
  }
}

/**
 * A card to show progress or percentages.
 */
export class ProgressCard extends React.Component {
  
  static propTypes = {
    /**
     * The progress or percentage to visualize as a number.
     */
    progress: PropTypes.number,

    /**
     * The backgrond color to use. Bootstrap coloring scheme can be used.
     */
    color: PropTypes.string,

    /**
     * The color of the bar. Bootstrap coloring scheme can be used.
     */
    barColor: PropTypes.string,

        /**
     * The title to visualize
     */
    title: PropTypes.string,
   
    /**
     * A brief description that complements the information given by `value`.
     */
    description: PropTypes.string,
  }

  render(){
    const progress = this.props.progress + '%';
    var color = "primary-color"
    var barColor = "grey darken-3"
    if (this.props.color != null){
      color = this.props.color
    }
    if(barColor != null){
      barColor = this.props.barColor
    }
    var textColor = "white-text"
    if(this.props.textColor){
      textColor = this.props.textColor
    }
    return (
        <React.Fragment>
        <MDBCard color={color} className="classic-admin-card mb-3">
          <MDBCardBody>
            <div className="float-right"><MDBIcon icon={this.props.icon} size="3x"/></div>
            <p className="white-text">{this.props.title}</p>
            <h4><strong>{progress}</strong></h4>
          </MDBCardBody>
          <div className="progress">
            <div aria-valuemax="100" 
                  aria-valuemin="0" 
                  aria-valuenow={this.props.progress} 
                  className={"progress-bar progress-bar-striped bg " + barColor} 
                  role="progressbar" 
                  style={{width: `${progress}`}}>
            </div>
          </div>
          {descriptionCard(this.props.description, textColor)}
          </MDBCard>
        </React.Fragment>
    )
  }
}
