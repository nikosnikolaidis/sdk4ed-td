import React from 'react';
import {PagePanel} from './sections/PagePanel';
import { MDBCol, MDBRow} from "mdbreact";
import {ProgressCard, CountCard, ScoreCard} from './sections/StatusCards'
import PlotlyChart from './sections/Chart';
import BasicTable from './sections/Table';
import 'whatwg-fetch';
import Loader from './sections/Loading'
import FileExplorer from './sections/FileExplorer';
import ContentPanel from './sections/ContentPanel';

const PrincipalPanel = props => {
  return (
      <PagePanel header="Technical debt principal" linkTo="/techdebt/principal">
      <MDBRow className="mb-3">
          <MDBCol>
            <PlotlyChart title="Principal over time" 
              data={props.principal}
              layout={{
                width: 650,
                margin: {l:40, r:40, t:50, b:50}}}
              />
          </MDBCol>
          <MDBCol>
          <MDBRow className="mb-3">
            <MDBCol>
                  <ScoreCard title="Quality score" color="grey lighten-4" score={props.mysummary.qualityScore}/>
            </MDBCol>
            </MDBRow>
            <MDBRow className="mb-3">
            <MDBCol>
                  <ProgressCard title="Coverage" color="grey darken-3" barColor="green" progress={props.mysummary.coverage} icon="check-circle" description="Unit tests"/>
            </MDBCol>
            <MDBCol>
                  <CountCard title="Vulnerabilities" color="red darken" icon="lock" value={props.mysummary.vulnerabilities.count} description={props.mysummary.vulnerabilities.critical + " of them are critical"}/>

            </MDBCol>
            </MDBRow>

            <MDBRow className="mb-3">
            <MDBCol>
                  <CountCard title="Code Smells" color="orange darken-3" value={props.mysummary.codeSmells} icon="radiation-alt"/>
            </MDBCol>
            <MDBCol>
                  <ProgressCard title="Duplicated Code" color="blue lighten-1" barColor="red" progress={props.mysummary.duplCode} icon="clone"/>
            </MDBCol>
            </MDBRow>
            <MDBRow>
            <MDBCol>
                  <CountCard title="Lines of code" color="purple darken-3" value={props.mysummary.linesOfCode} icon="code"/>
            </MDBCol>
            <MDBCol>
                <CountCard title="Bugs" color="grey darken-3" value={props.mysummary.bugs} icon="bug"/>
            </MDBCol>
            </MDBRow>
          </MDBCol>
      </MDBRow>
      </PagePanel>
)}

const InterestPanel = props => {
  
  return(
  <PagePanel header="Technical debt interest" linkTo="/techdebt/interest">
      <MDBRow className="mb-3">
          <MDBCol size="3" mr="1">
            <BasicTable title="Top 5 Violations" data={props.violations}/>
          </MDBCol>
          <MDBCol size="6">
            <PlotlyChart title="Interest accumulated" data={props.interest}
                         layout={{ width: 650, margin: {l:40, r:40, t:50, b:50}}} />
          </MDBCol>
          <MDBCol size="3">
                <MDBRow className="mb-3">
                  <MDBCol>
                  <CountCard title="Breaking point" color="red darken-2" value={props.mysummary.breakpoint} icon="calendar-alt" description={props.mysummary.breakpointDaysLeft + " days left"}/>
                  </MDBCol>
                </MDBRow>
                <MDBRow className="mb-3">
                  <MDBCol>
                  <CountCard title="Interest probability" color="green darken-3" value={props.mysummary.interestprob} description={"Ranking " + props.mysummary.interestrank} icon="dollar-sign"/>
                  </MDBCol>
                </MDBRow>
                <MDBRow className="mb-3">
                  <MDBCol>
                  </MDBCol>
                </MDBRow>
          </MDBCol>
      </MDBRow>
  </PagePanel>
  )
}

const NewCodePanel = props =>{
  return (
    <PagePanel header="Technical debt new code" linkTo="/techdebt/interest">
    <MDBRow className="mb-3">
        <MDBCol size="3" mr="1">
          <PlotlyChart title="TD density of new code vs existing" data={props.densitycomparison}
          layout={{width: 300, height:600}} />
        </MDBCol>
        <MDBCol size="6">
          <PlotlyChart title="TD Density of new code over time" data={props.density}
                      layout={{ width: 650, margin: {l:40, r:40, t:50, b:50}}} />
        </MDBCol>
        <MDBCol size="3">
          <BasicTable title="Top 5 Violations in new code" data={props.violations}/>
        </MDBCol>
    </MDBRow>
    </PagePanel>
  )
}

const FileExplorerPanel = () => {
  return (
    <ContentPanel title="Project explorer">
      <FileExplorer></FileExplorer>
    </ContentPanel>
  )
}

/**
 * The technical debt dashboard page. The page is assembled using multiple panels.
 * The data is retrieved asynchronously.
 */
class TDDashPage extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      systemSummary: null, // Principal-related summary information
      interestSummary: null, // Interest-related summary information
      principalOverTimeChart: null, // Chart for principal over time
      interestOverTimeChart: null, // Chart for interest over time
      topViolations: null, // The top violations wrt frequency
      topViolationsNewCode: null, // The top violations wrt frequency in new code
      densityComparisonChart: null, // Chart of the density of TD in new and existing code
      densityOverTimeChart: null // Chart of the density over time
    }
  }

  componentDidMount(){
    fetch("http://127.0.0.1:3001")
    .then(resp => resp.json())
    .then(resp => {
      console.log("Data received")
      this.setState(resp)
    })
  }

  render(){
    if(this.state.systemSummary == null){
      return (<Loader/>)
    }else{
      return(
          <React.Fragment>
            <MDBRow>
              <MDBCol size="2">
              <FileExplorerPanel/>
              </MDBCol>
              <MDBCol>
              <PrincipalPanel mysummary={this.state.systemSummary} 
                              principal={this.state.principalOverTimeChart}/>
              <InterestPanel violations={this.state.topViolations} 
                            mysummary={this.state.interestSummary} interest={this.state.interestOverTimeChart}/>
              <NewCodePanel violations={this.state.topViolationsNewCode}
                            densitycomparison={this.state.densityComparisonChart}
                            density={this.state.densityOverTimeChart}/>
              </MDBCol>
              </MDBRow>
            </React.Fragment>
            )
    }
  }

}

export default TDDashPage;