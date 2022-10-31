import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TDAnalysisDashPage from './pages/TDAnalysisDashPage';
import TDPrincipalDashPage from './pages/TDPrincipalDashPage';
import TDNewCodeDashPage from './pages/TDNewCodeDashPage';
import TDClassifierDashPage from './pages/TDClassifierDashPage'
import SecurityDashPage from './pages/SecurityDashPage';
import EvitDashPage from './pages/EvitDashPage';
import EnergyDashPage from './pages/EnergyDashPage';
import ForecastDashPage from './pages/ForecastDashPage';
import ForecastEnergyDashPage from './pages/ForecastEnergyDashPage';
import ForecastSecurityDashPage from './pages/ForecastSecurityDashPage';
import OptimalCheckpoint from './pages/OptimalCheckpointPage';
import RefactoringsDashPage from './pages/RefactoringsDashPage';
import DesignRefactoringDashPage from './pages/DesignRefactoringDashPage';
import SystemViewer from './pages/ATDAnalysisDashPage'
import DecSupp from './pages/DecSuppPage';
import RefactoringsFinancialInvestmentPage from "./pages/RefactoringsFinancialInvestmentPage";
import MapsPage from './pages/MapsPage';
import NotFoundPage from './pages/NotFoundPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import TablesPage from './pages/TablesPage';
import ProjectList from './pages/ProjectList';

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        {/* Actual routes (incomplete, please refer to API design document) */}
        <Route path='/tdanalysis' component={TDAnalysisDashPage}/>        
        <Route path='/tdprincipal' component={TDPrincipalDashPage}/>
        <Route path='/tdnewcode' component={TDNewCodeDashPage}/>
        <Route path='/tdclassifier' component={TDClassifierDashPage}/>
        <Route path='/atdanalysis' component={SystemViewer}/>
        <Route path="/refactoring" component={RefactoringsDashPage}/>
        <Route path="/designrefactoring" component={DesignRefactoringDashPage}/>
        <Route path='/optimalcheckpoint' component={OptimalCheckpoint}/>
        <Route path='/security' component={SecurityDashPage}/>
        <Route path='/evit' component={EvitDashPage}/>
        <Route path='/energy' component={EnergyDashPage}/>
        <Route path='/tdforecast' component={ForecastDashPage}/>
        <Route path='/energyforecast' component={ForecastEnergyDashPage}/>
        <Route path='/securityforecast' component={ForecastSecurityDashPage}/>
        <Route path='/dashboard' component={DashboardPage}/>
        <Route path='/decsupp' component={DecSupp}/>
        <Route path="/refactoringsFinancialInvestment" component={RefactoringsFinancialInvestmentPage}/>
        <Route path='/' exact component={ProjectList}/>
        {/* <Route path='/' exact component={DashboardPage}/> */}
        {/* <Route path='/projects' exact component={ProjectList} /> */}

        {/* Examples and templates  */}
        <Route path='/tables' component={TablesPage} />
        <Route path='/maps' component={MapsPage} />
        <Route path='/404' component={NotFoundPage} />
      </Switch>
    );
  }
}

export default Routes;
