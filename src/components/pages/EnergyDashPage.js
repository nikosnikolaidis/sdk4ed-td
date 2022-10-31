import React from 'react';
    import {PagePanel} from './sections/PagePanel';
    import { MDBCol, MDBCard, MDBCardBody, MDBCardHeader, MDBRow, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBContainer, MDBDataTable, MDBBtn, MDBIcon } from 'mdbreact';
    import {ProgressCard, CountCard} from './sections/StatusCards'
    import BasicTable from './sections/Table';
    import 'whatwg-fetch';
    import Loader from './sections/Loading'
    import Highcharts from 'highcharts';
    import HighchartsReact from 'highcharts-react-official';
	const ENERGY_TOOLBOX_ENDPOINT = process.env.REACT_APP_ENERGY_TOOLBOX_ENDPOINT

    // The Project Panel
    const ProjectPanel = props => {
    	if (props.run_type == 'hotspots' || props.run_type == 'acceleration' || props.run_type == 'history'){	
    	var warning = "";
        return (
        	<PagePanel header="Project Analysis Settings" linkTo="/energy">
            <MDBRow className="mb-4">
                <MDBCol md="12" lg="12" className="mb-12">
                        <MDBRow>
                            <MDBCol>
                                <div>
                            	<MDBDropdown>   
                            		{warning}
                                </MDBDropdown>
                                </div>

                                


                            	<div>
                            	<MDBDropdown>
                            		{warning}
                                	<span style={{fontSize:'150%',color:'#548235'}}>&ensp;New/Last Analysis: </span>
                                	<MDBDropdownToggle caret className="white-text" color="  light-green darken-4">
                                        {props.new_analysis} Analysis
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu basic>
                                        <MDBDropdownItem onClick={(param) => props.updateAnalysis(0)}><MDBIcon icon="eye" className="mr-1" size="lg"/>Last Analysis</MDBDropdownItem>
                                        <MDBDropdownItem onClick={(param) => props.updateAnalysis(1)}><MDBIcon icon="sync-alt" className="mr-1" size="lg"/>New Analysis</MDBDropdownItem>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                                </div>


                                <div>
                            	<MDBDropdown>
                                	<span style={{fontSize:'150%',color:'#548235'}}>&ensp;Analysis Type: </span>
                                	<MDBDropdownToggle caret className="white-text" color="  light-green darken-4">
                                        {props.run_type} Analysis
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu basic>
                                        <MDBDropdownItem onClick={(param) => props.updateRunType(0)}><MDBIcon icon="compress-arrows-alt" className="mr-1" size="lg"/>Full Analysis</MDBDropdownItem>
                                        <MDBDropdownItem onClick={(param) => props.updateRunType(1)}><MDBIcon icon="fire-alt" className="mr-1" size="lg"/>Hot-spots</MDBDropdownItem>
                                        <MDBDropdownItem onClick={(param) => props.updateRunType(2)}><MDBIcon icon="running" className="mr-1" size="lg"/>Acceleration</MDBDropdownItem>
                                        <MDBDropdownItem onClick={(param) => props.updateRunType(3)}><MDBIcon icon="code" className="mr-1" size="lg"/>Static Analysis</MDBDropdownItem>
                                        <MDBDropdownItem onClick={(param) => props.updateRunType(4)}><MDBIcon icon="history" className="mr-1" size="lg"/>History Analysis</MDBDropdownItem>
                                        <MDBDropdownItem onClick={(param) => props.updateRunType(5)}><MDBIcon icon="mobile-alt" className="mr-1" size="lg"/>Android Analysis</MDBDropdownItem>
                                        <MDBDropdownItem onClick={(param) => props.updateRunType(6)}><MDBIcon icon="fire" className="mr-1" size="lg"/>Hot-spots & Static Analysis</MDBDropdownItem>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                                </div>
                                <form onSubmit={props.handleSubmit}>
                      <div>
    							  <button>Start</button>
    							  </div>
    							</form>
                            </MDBCol>
                        </MDBRow>
                </MDBCol>
            </MDBRow>
            </PagePanel>
        )
    	}
    	else{	
    	var warning = "";
        return (
        	<PagePanel header="Analysis Options" linkTo="/energy">
            <MDBRow className="mb-4">
                <MDBCol md="12" lg="12" className="mb-12">
                        <MDBRow>
                            <MDBCol>
                                <div>
                            	<MDBDropdown>   
                            		{warning}
                                </MDBDropdown>
                                </div>

                                

                            	<div>
                            	<MDBDropdown>
                                	<span style={{fontSize:'150%',color:'#548235'}}> &ensp;New/Last Analysis: </span>
                                	<MDBDropdownToggle caret className="white-text" color="  light-green darken-4">
                                        {props.new_analysis} Analysis
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu basic>
                                        <MDBDropdownItem onClick={(param) => props.updateAnalysis(0)}><MDBIcon icon="eye" className="mr-1" size="lg"/>Last Analysis</MDBDropdownItem>
                                        <MDBDropdownItem onClick={(param) => props.updateAnalysis(1)}><MDBIcon icon="sync-alt" className="mr-1" size="lg"/>New Analysis</MDBDropdownItem>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                                </div>


                                <div>
                            	<MDBDropdown>
                                	<span style={{fontSize:'150%',color:'#548235'}}> &ensp;Analysis Type: </span>
                                	<MDBDropdownToggle caret className="white-text" color="  light-green darken-4">
                                        {props.run_type} Analysis
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu basic>
                                        <MDBDropdownItem onClick={(param) => props.updateRunType(0)}><MDBIcon icon="compress-arrows-alt" className="mr-1" size="lg"/>Full Analysis</MDBDropdownItem>
                                        <MDBDropdownItem onClick={(param) => props.updateRunType(1)}><MDBIcon icon="fire-alt" className="mr-1" size="lg"/>Hot-spots</MDBDropdownItem>
                                        <MDBDropdownItem onClick={(param) => props.updateRunType(2)}><MDBIcon icon="running" className="mr-1" size="lg"/>Acceleration</MDBDropdownItem>
                                        <MDBDropdownItem onClick={(param) => props.updateRunType(3)}><MDBIcon icon="code" className="mr-1" size="lg"/>Static Analysis</MDBDropdownItem>
                                        <MDBDropdownItem onClick={(param) => props.updateRunType(4)}><MDBIcon icon="history" className="mr-1" size="lg"/>History Analysis</MDBDropdownItem>
                                        <MDBDropdownItem onClick={(param) => props.updateRunType(5)}     ><MDBIcon icon="mobile-alt" className="mr-1" size="lg"/>Android Analysis</MDBDropdownItem>
                                        <MDBDropdownItem onClick={(param) => props.updateRunType(6)}><MDBIcon icon="fire" className="mr-1" size="lg"/>Hot-spots & Static Analysis</MDBDropdownItem>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                                </div>
                                <form onSubmit={props.morewindows}>
{/*                                  <div>
    							  <label>
    							    <span style={{fontSize:'150%',color:'#548235'}}>Github Project Link : </span>
    							    <input id="project_url" name="project_url" type="text" />
    							  </label>
    							  </div>
    							  <div>
    							  <label>
    							    <span style={{fontSize:'150%',color:'#548235'}}>Insert Github Token: </span>
    							    <input id="github_token" name="github_token" type="text"/>
    							  </label>
    							  </div>
    							  <div>
    							  <label>
    							    <span style={{fontSize:'150%',color:'#548235'}}>Insert User Name: </span>
    							    <input id="user_name" name="user_name" type="text"/>
    							  </label>
    							  </div>
    							  <div>
    							  <label>
    							    <span style={{fontSize:'150%',color:'#548235'}}>Insert Github Commit: </span>
    							    <input id="commit" name="commit" type="text"/>
    							  </label>
    							  </div>
*/}    							  <div>
    							  <button>Start</button>
    							  </div>							  
    							</form>
                            </MDBCol>
                        </MDBRow>
                </MDBCol>
            </MDBRow>
            </PagePanel>
        )		
    	}	
    }

    const HistoryPanel = props => {
    	if (props.myprojectName == '') {
    		return (null)
    	}
      	if (props.runtype != "history"){
      		return (null)
      	}
        if (typeof props.history === 'undefined' || props.history == ''){
            return (null)
        }
    	return (
    		<PagePanel header="History Energy Analysis Results" linkTo="/energy">
    			<MDBRow className="mb-3">			
    				<MDBCol size="5" mr="2">	
    					<BasicTable title="Versions Energy Analysis" data={props.history}/>
    				</MDBCol>					
    			</MDBRow>
    		</PagePanel>
    	)
    }

    const parseFloatArray = (data) => {

        var floatdata = [];

        for (var i=0; i < data.length; i++) {
            var current = parseFloat(data[i]);
            floatdata.push(current);
        }

        return floatdata
    }

    const HistoryPlot = props => {
        if (props.myprojectName == '') {
            return (null)
        }
        if (props.runtype != "history"){
            return (null)
        }
        if (typeof props.energyplatform1 === 'undefined' || props.energyplatform1 == ''){
            return (null)
        }
        console.log(props.history);
        console.log(props.energyplatform1);
        var HistoryEnergy = {
            title: {
                text: 'Estimated Energy Consumption over project versions'
            },
            subtitle: {
                text: 'Source: SDK4ED Energy Toolbox Energy and Time Estimation'
            },
            yAxis: {
                type: 'logarithmic',
                title: {
                text: 'Energy Consumption (Joules)'
                }
            },
            xAxis: {
                accessibility: {
                rangeDescription: ''
                },
                title: {
                    text: 'Versions'
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            plotOptions: {
                series: {
                label: {
                connectorAllowed: false
                },
                pointStart: 0
                }
            },
            series: [{
                name: 'ARM Cortex-A57',
                data: parseFloatArray(props.energyplatform1)
            },
            {
                name: 'ARM Cortex-A72',
                data: parseFloatArray(props.energyplatform2)
            }
            ,
            {
                name: 'Intel i5 4210u',
                data: parseFloatArray(props.energyplatform3)
            }
            ,
            {
                name: 'ARM Cortex M0+',
                data: parseFloatArray(props.energyplatform4)
            }
            ],
            responsive: {
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
            }
      }
        var HistoryTime = {
            title: {
                text: 'Estimated Execution Time over project versions'
            },
            subtitle: {
                text: 'Source: SDK4ED Energy Toolbox Energy and Time Estimation'
            },
            yAxis: {
                type: 'logarithmic',
                title: {
                text: 'Execution Time (ms)'
                }
            },
            xAxis: {
                accessibility: {
                rangeDescription: ''
                },
                title: {
                    text: 'Versions'
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            plotOptions: {
                series: {
                label: {
                connectorAllowed: false
                },
                pointStart: 0
                }
            },
            series: [{
                name: 'ARM Cortex-A57',
                data: parseFloatArray(props.timeplatform1)
            },
            {
                name: 'ARM Cortex-A72',
                data: parseFloatArray(props.timeplatform2)
            }
            ,
            {
                name: 'Intel i5 4210u',
                data: parseFloatArray(props.timeplatform3)
            }
            ,
            {
                name: 'ARM Cortex M0+',
                data: parseFloatArray(props.timeplatform4)
            }
            ],
            responsive: {
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
            }
      }
      return (
        <React.Fragment>
            <MDBRow className="mb-4">
                <MDBCol md="6" lg="6" className="mb-12">
                  <MDBCard className="mb-12">
                     <MDBCardHeader className="sdk4ed-color">Estimated Energy consumption over project versions</MDBCardHeader>
                     <MDBCardBody>
                        <HighchartsReact highcharts={Highcharts} options={HistoryEnergy} immutable = {true} />
                     </MDBCardBody>
                  </MDBCard>
            </MDBCol>
                <MDBCol md="6" lg="6" className="mb-12">
                  <MDBCard className="mb-12">
                     <MDBCardHeader className="sdk4ed-color">Estimated Execution Time over project versions</MDBCardHeader>
                     <MDBCardBody>
                        <HighchartsReact highcharts={Highcharts} options={HistoryTime} immutable = {true} />
                     </MDBCardBody>
                  </MDBCard>
            </MDBCol>
            </MDBRow>
        </React.Fragment>
      )
    
}

    const HotspotsPanel = props => {
      	if (props.myprojectName == ''){
     		return (null)
      	}
      	if (props.hotspottype != "hotspots" && props.hotspottype != "full" && props.hotspottype != "hotstatic"){
      		return (null)
      	} 
      	if (typeof props.myEnergySummary === 'undefined' || props.myEnergySummary == ''){
      		return (null)
      	}
    	return (
    		<PagePanel header="Energy Hot-spots" linkTo="/energy">
    			<MDBRow className="mb-3">			

    				<MDBCol size="5" mr="2">			

    					<MDBDropdown>
    	                    <MDBDropdownToggle caret className="white-text" color="  light-green darken-4">
    	                        Hotspot Granularity
    	                    	</MDBDropdownToggle>
    	                    	<MDBDropdownMenu basic>
    	                    		<MDBDropdownItem onClick={(param) => props.updateHotspotsData('function')}>Function Level</MDBDropdownItem>
    	                    		<MDBDropdownItem onClick={(param) => props.updateHotspotsData('loop')}>Statements Level</MDBDropdownItem>
    	                		</MDBDropdownMenu>
    	                    </MDBDropdown>	

    					<BasicTable title="Energy Hot-spots" data={props.hotspots}/>
    				</MDBCol>

    				<MDBCol>
    					<MDBRow className="mb-3">
    						<MDBCol>
    							<CountCard title="Total CPU cycles" color="#33691e light-green darken-4" value={props.myEnergySummary.cpucycles} icon="fas fa-microchip" description="Profilling Tools"/>
    						</MDBCol>
    						<MDBCol>
    							<CountCard title="Total Data Races" color="#33691e light-green darken-4" value={props.myEnergySummary.dataraces} icon="fas fa-traffic-light" description=""/>
    						</MDBCol>
    						<MDBCol>
    							<CountCard title="Total Memory accesses" color="#33691e light-green darken-4" value={props.myEnergySummary.memoryaccesses} icon="fas fa-memory" description=""/>
    						</MDBCol>
    					</MDBRow>
    					<MDBRow className="mb-3">
    						<MDBCol>
    							<CountCard title="Total Ratio of branch misses" color="#33691e light-green darken-4" value={props.myEnergySummary.branchmiss} icon="fas fa-code-branch" description=""/>
    						</MDBCol>
    						<MDBCol>
    							<CountCard title="Total I Cache miss rate" color="#33691e light-green darken-4" icon="fas fa-terminal" value={props.myEnergySummary.Icachemiss} description=""/>
    						</MDBCol>
    						<MDBCol>
    							<CountCard title="Total D Cache miss rate" color="#33691e light-green darken-4" icon="fas fa-database" value={props.myEnergySummary.cachemiss} description="Data cache L1"/>
    						</MDBCol>
    					</MDBRow>
    				</MDBCol>
    			</MDBRow>
    		</PagePanel>
    	)
    }

    const StaticPanel = props => {
    	var Platform;
    	var Glanularities;
      	if (props.myprojectName == '' ){
     		return (null)
      	}
      	if (props.statictype != "static"  && props.statictype != "full" && props.statictype != "hotstatic"){
      		return (null)
      	}
      	if (typeof props.totalenergy === 'undefined' || props.totalenergy == ''){
      		return (null)
      	}
      	var str = '';
    	var str1 =  (props.boxforiterations.box);
    	var str2 =  <input id="project_url" name="project_url" type="text" />;
    	var strong = new Array(props.boxforiterations.box);
    	var i;
    	var itera;
    	var gooo = "text";
    	var newlength = strong.length;
    	if (props.analysiz === 'Last'){
    		newlength = 0;
    	}
    	/*for (i = 0; i < newlength; i++) {
    		itera = "iterations";
    		itera = itera.concat(i.toString());
      		strong[i] = <input id={itera} name={itera} type="text" size="5"/>;
    	}*/
    	var buttons;
    	if (props.analysiz == 'Last'){
    		buttons = '';
    	}
    	else {
    		buttons = <button>Calculate</button>;
    	}
    	var remark;
    	var evenmore1;
    	var evenmore2;
    	if (props.analysiz == 'Last'){
    		remark = '';
    		evenmore1 = '';
    		evenmore2 = '';
    	}
    	else {
    		remark = 'Insert the number of iterations for each loop statement:';
    		evenmore1 = <input id="loopnumber" name="loopnumber" type="text" size="5"/>;
    		evenmore2 = <input id="iternumber" name="iternumber" type="text" size="5"/>	
    	}	
    	var vassss;
    	if ((typeof props.propplat == 'undefined' || props.propplat == '') && (typeof props.propgran == 'undefined' || props.propgran == '')){
    		vassss = props.statics.topStaticsFunction1
    	}
    	else{
    		vassss = props.statics
    	}
    	var lengthoftotal = props.totalenergy.mainplatforms;
    	var lengthoftotal1 = props.totalenergy.mainplatformstime;
    	var tolength = lengthoftotal.length
    	var varplatform = new Array(tolength);

    	var platform_name = new Array(tolength);
    	platform_name[0] = "ARM Cortex A57 (Nvidia Jetson TX1)";
    	platform_name[1] = "ARM Cortex A72 (Raspberry Pi 4)";
    	platform_name[2] = "Intel i5 4210u";
    	platform_name[3] = "ARM Cortex M0\+ (Arduino Nano 33 IoT)"; 
 	   	
		strong[0] = <MDBDropdownItem onClick={(param) => props.updateplatform(props.propgran,platform_name[0],platform_name)}>{platform_name[0]}</MDBDropdownItem>;
		strong[1] = <MDBDropdownItem onClick={(param) => props.updateplatform(props.propgran,platform_name[1],platform_name)}>{platform_name[1]}</MDBDropdownItem>;
		strong[2] = <MDBDropdownItem onClick={(param) => props.updateplatform(props.propgran,platform_name[2],platform_name)}>{platform_name[2]}</MDBDropdownItem>;
		strong[3] = <MDBDropdownItem onClick={(param) => props.updateplatform(props.propgran,platform_name[3],platform_name)}>{platform_name[3]}</MDBDropdownItem>;
    	
        var strongss = new Array(tolength);
    	var strongss1 = new Array(tolength);
    	var countcard = new Array(tolength);	
    	countcard[0] = "Total Energy in ARM Cortex A57 (Nvidia Jetson TX1) (Joules)"
    	countcard[1] = "Total Energy in ARM Cortex A72 (Raspberry Pi 4) (Joules)"
    	countcard[2] = "Total Energy in Intel i5 4210u (Joules)"
    	countcard[3] = "Total Energy in ARM Cortex M0\+ (Arduino Nano 33 IoT) (Joules)"
    	for (i = 0; i < tolength; i++){
    		strongss[i] = <CountCard title={countcard[i]} color="#33691e light-green darken-4" value={lengthoftotal[i]} icon="fas fa-microchip" description=""/>
    	}
    	countcard[0] = "Total Time in ARM Cortex A57 (Nvidia Jetson TX1) (ms)"
    	countcard[1] = "Total Time in ARM Cortex A72 (Raspberry Pi 4) (ms)"
    	countcard[2] = "Total Time in Intel i5 4210u (ms)"
    	countcard[3] = "Total Time in ARM Cortex M0\+ (Arduino Nano 33 IoT) (ms)"
    	for (i = 0; i < tolength; i++){
    		strongss1[i] = <CountCard title={countcard[i]} color="#33691e light-green darken-4" value={lengthoftotal1[i]} icon="fas fa-microchip" description=""/>
    	}
    	return (
    		<PagePanel header="Energy consumption and execution time estimation" linkTo="/energy">
    			<MDBRow className="mb-3">			

    				<MDBCol size="5" mr="2">	
    					<MDBRow>
    						<MDBCol size="5">	
    							<MDBDropdown>	
    			                    <MDBDropdownToggle caret className="white-text" color="  light-green darken-4">
    			                        Platform
    			                    	</MDBDropdownToggle>
    			                    	<MDBDropdownMenu basic>
    			                    		{strong}
    			                		</MDBDropdownMenu>	
    			                	</MDBDropdown>	
    							</MDBCol>
    							
    						<MDBCol size="7">							
    							<MDBDropdown>			                            	
    			                    <MDBDropdownToggle caret className="white-text" color="  light-green darken-4">
    			                        Granularity
    			                    	</MDBDropdownToggle>
    			                    	<MDBDropdownMenu basic>
    			                    		<MDBDropdownItem onClick={(param) => props.updateplatform('function',props.propplat,platform_name)}>Function</MDBDropdownItem>
    			                    		<MDBDropdownItem onClick={(param) => props.updateplatform('loop',props.propplat,platform_name)}>Loop</MDBDropdownItem>
    			                		</MDBDropdownMenu>
    			                	</MDBDropdown>
    		                	</MDBCol>
    		               	</MDBRow>
    					<BasicTable title="" data={vassss}/>
    				</MDBCol>


    					<MDBCol>
    						<MDBRow className="mb-3">
    							<MDBCol size = "6">
    								{strongss1}
    							</MDBCol>
    							<MDBCol size = "6">
    								{strongss}
    							</MDBCol>							
    						</MDBRow>	
    						<MDBRow>					
    						<MDBCol>
    						<form onSubmit={props.putiterations}>
    							<div>
    							<label>
    								<span style={{fontSize:'150%',color:'#548235'}}>{remark}</span>
    								<MDBRow>
    									{evenmore1}
    									{evenmore2}																	
    								</MDBRow>
    							</label>
    							</div>
    							<div>
    							{buttons}
    							</div>	
    						</form>			
    						</MDBCol>
    						</MDBRow>
    					</MDBCol>	

    			</MDBRow>
    		</PagePanel>
    	)
    }

const AndroidPanel = props => {                                                                 
      if (props.myprojectName == '' ){
      return (null)
      }
      if (props.androidtype != 'android'){
        return (null)
      }
      return (
      <PagePanel header="Android Results" linkTo="/energy">
        <MDBRow className="mb-3">
  
          <MDBCol>
            <MDBRow>
              <MDBCol>
                <MDBRow className="mb-3">
                  <MDBCol size="3">
                    <CountCard title="Application Name" color="#33691e light-green darken-4" value     ={props.javaenergy.values[0]} icon="fas fa-mobile-alt" description="Anadroid"/>
                  </MDBCol>
                </MDBRow>
                <MDBRow className="mb-3">
                  <MDBCol size="3">
                    <CountCard title="Memory Usage (kbytes)" color="#33691e light-green darken-4" value={props.javaenergy.values[1]} icon="memory" description="Anadroid"/>
                  </MDBCol>
                  <MDBCol size="3">
                    <CountCard title="CPU Load (%)" color="#33691e light-green darken-4" value={props.     javaenergy.values[2]} icon="microchip" description="Anadroid"/>
                  </MDBCol>
                  <MDBCol size="3">
                    <CountCard title="CPU Frequency (Hz)" color="#33691e light-green darken-4" value={props.javaenergy.values[3]} icon="microchip" description="Anadroid"/>
                  </MDBCol>
                </MDBRow>
                <MDBRow className="mb-3">
                  <MDBCol size="3">
                    <CountCard title="Context Switches" color="#33691e light-green darken-4" value     ={props.javaenergy.values[4]} icon="retweet" description="Anadroid"/>
                  </MDBCol>
                  <MDBCol size="3">
                    <CountCard title="Duration of test case (sec)" color="#33691e light-green darken-4"      value={props.javaenergy.values[5]} icon="clock" description="Anadroid"/>
                  </MDBCol>
                  <MDBCol size="3">
                    <CountCard title="System calls" color="#33691e light-green darken-4" value={props.javaenergy.values[6]} icon="laptop-code" description="Anadroid"/>
                  </MDBCol>
                </MDBRow>
                <MDBRow className="mb-3">
                  <MDBCol>
                    <CountCard title="Total Energy of application (joules)" color="#33691e light-green dark     en-4" value={props.javaenergy.values[7]} icon="battery-half" description="Anadroid"/>
                  </MDBCol>
                </MDBRow>
              </MDBCol>
           </MDBRow>
         </MDBCol>
       </MDBRow>
     </PagePanel>
   )
}



    const OffloadingPanel = props => {
      	if (props.myprojectName == ''){
     		return (null)
      	}
      	if (props.offloadtype != "acceleration"  && props.offloadtype != "full"){
      		return (null)
      	}
      	if (typeof props.hotspotsGPU === 'undefined' || props.hotspotsGPU == ''){
      		return (null)
      	}
    	return (
    		<PagePanel header="Acceleration specific indicators" linkTo="/energy">
    			<MDBRow className="mb-3">

    				<MDBCol size="6" mr="2">

    					<MDBDropdown>
    	                    <MDBDropdownToggle caret className="white-text" color="  light-green darken-4">
    	                        Hotspot Granularity
    	                    	</MDBDropdownToggle>
    	                    	<MDBDropdownMenu basic>
    	                    		<MDBDropdownItem onClick={(param) => props.updateHotspotsData('function')}>Function Level</MDBDropdownItem>
    	                    		<MDBDropdownItem onClick={(param) => props.updateHotspotsData('loop')}>Statements Level</MDBDropdownItem>
    	                		</MDBDropdownMenu>
    	                </MDBDropdown>

    					<BasicTable title="Energy Hot-spots - Acceleration indicators" data={props.hotspotsGPU}/>
    				</MDBCol>

                    <MDBRow className="mb-3">
                    <MDBCol>
                    <CountCard title="GPU Nvidia Jetson TX1" color="#33691e light-green darken-4" icon="microchip" description=""/>
                    </MDBCol>
                    </MDBRow>

    			</MDBRow>
    		</PagePanel>
    	)
    }

    const OptimizationsPanel = props => {
      	if (props.myprojectName == ''){
     		return (null)
      	} 	
      	if (props.optimizetype != "acceleration"  && props.optimizetype != "full" && props.optimizetype != "hotspots" && props.optimizetype != "hotstatic"){
      		return (null)
      	}  	
      	if (typeof props.optimizations === 'undefined' || props.optimizations == ''){
      		return (null)
      	}
    	return (
    		<PagePanel header="Proposed Energy optimizations" linkTo="/energy">
    			<MDBRow className="mb-3">

    				<MDBCol size="7" mr="2">

    					<MDBDropdown>
    	                    <MDBDropdownToggle caret className="white-text" color="  light-green darken-4">
    	                        Hotspot Granularity
    	                    	</MDBDropdownToggle>
    	                    	<MDBDropdownMenu basic>
    	                    		<MDBDropdownItem onClick={(param) => props.updateHotspotsData('function')}>Function Level</MDBDropdownItem>
    	                    		<MDBDropdownItem onClick={(param) => props.updateHotspotsData('loop')}>Statements Level</MDBDropdownItem>
    	                		</MDBDropdownMenu>
    	                </MDBDropdown>

    					<BasicTable title="Proposed optimizations" data={props.optimizations}/>
    				</MDBCol>

    			</MDBRow>
    		</PagePanel>
    	)
    }

    /**
     * The technical debt dashboard page. The page is assembled using multiple panels.
     * The data is retrieved asynchronously.
     */
    class EnergyDashPage extends React.Component {
    	
    	constructor(props){
    		super(props);
    		
    		this.state = {
    			isLoading: false,
    			name: '',
    			Platform: '',
    			Granularities: '',
    			energyIndicatorsSummary: {},
    			acelerationIndicatorsSummary: {},
    			boxforiterations: {},
    			totalenergyIndicator: {},
    			topStatics: {},
    			history: {},
                timeplatform1: '',
                timeplatform2: '',
                timeplatform3: '',
                timeplatform4: '',
                energyplatform1: '',
                energyplatform2: '',
                energyplatform3: '',
                energyplatform4: '',
    			topHotspots: '',
    			topHotspotsGPU: '',
    			new_analysis: 'Last',
    			run_type: 'full',
    			user_names: '',
    			github_tokens: '',
    			github_urls: '',
    			storehotspots: '',
    			storestatics: '',
    			storeoptimize: '',
    			storehistory: '',
                timeplatform1: '',
                timeplatform2: '',
                timeplatform3: '',
                timeplatform4: '',
                mainplatform1: '',
                mainplatform2: '',
                mainplatform3: '',
                mainplatform4: '',
                javaenergy: {},
    		}
    	}

    	updateAnalysis = (new_analysis) => {
    		if (new_analysis == 0){
    			this.setState({
    				new_analysis: 'Last'
    			})
    		}
    		if (new_analysis == 1){
    			this.setState({
    				new_analysis: 'New'
    			})
    		}
    	}

    	updateRunType = (run_type) => {
    		if (run_type == 0){
    			this.setState({
    				run_type: 'full'
    			})
    		}
    		if (run_type == 1){
    			this.setState({
    				run_type: 'hotspots'
    			})
    		}
    		if (run_type == 2){
    			this.setState({
    				run_type: 'acceleration'
    			})
    		}	
    		if (run_type == 3){
    			this.setState({
    				run_type: 'static'
    			})
    		}
    		if (run_type == 4){
    			this.setState({
    				run_type: 'history'
    			})
    		}			
        if (run_type == 5){
          this.setState({
             run_type: 'android'
           })
         }
        if (run_type == 6){
          this.setState({
             run_type: 'hotstatic'
           })
         }
    	}

    	handleSubmit = (event) => {

    		this.setState({ 
    	            isLoading: true,
    	        });
    	    event.preventDefault();
    	    const data = new FormData(event.target);

    	    var new_analysis = new String();
    	    new_analysis = '';
    	    if (this.state.new_analysis === 'New'){
    	    	new_analysis = 'T';
    	    }
    	    
            var obj = sessionStorage.getItem('selected_project')
            var mag = JSON.parse (obj)
            var github_url = mag.endpoint 
            var user_name = mag.username
            var github_token = mag.password
            try {
              var commit = JSON.parse (mag.energy).commit
            }
            catch (err) {
              var commit = ""
            }

            if (sessionStorage.getItem('selected_project') === null){
            
                console.log("message No project selected. Please select a project from the Projects panel and retry")
            
            }else{
               var selectedProjectSession = JSON.parse(sessionStorage.getItem('selected_project'))
                
                console.log(selectedProjectSession['name'])

                //user_name = selectedProjectSession['username']; 
                //github_token = selectedProjectSession['password'];
                //github_url = selectedProjectSession['endpoint']; 
                //commit = data.get('commit'); 

            }

    	    var iteraurl = "";
    	    iteraurl = iteraurl.concat(data.get('loopnumber'));
    	    iteraurl = iteraurl.concat('-');
    	    iteraurl = iteraurl.concat(data.get('iternumber'))
    	    const fetch_link = `${ENERGY_TOOLBOX_ENDPOINT}/analysis?new=${new_analysis}&user=${user_name}&token=${github_token}&url=${github_url}&commit=${commit}&type=${this.state.run_type}`;
            //const fetch_link = ENERGY_TOOLBOX_ENDPOINT+`/analysis?new=${new_analysis}&user=cappadokes&token=de368e0c5b26ad400114a0f850c36e336030e991&url=https://github.com/cappadokes/neurasmus&commit=${commit}&type=${this.state.run_type}`;
    	    if(this.state.run_type == 'hotspots'){
    	    console.log(fetch_link);
    	    fetch(fetch_link)
    				.then(resp => resp.json())
    					.then(resp => {
    						console.log(resp);
                if (Object.keys (resp).length < 5) {
                  alert ('Could not analyze project. Either try again later, or check if project structure violates toolbox requirements.')
                }
                else if (Object.keys (resp).includes ('message')) {
                  alert ('The requested results could not be found in the toolbox database. Please ensure an analysis has already taken place in the past.')
                }
    						this.setState({
    							isLoading: false,
    							name: resp.projectName,
    							energyIndicatorsSummary: resp.energyIndicatorsSummary,
    							acelerationIndicatorsSummary: [],
    							boxforiterations: [],
    							totalenergyIndicator: [],
    							topHotspots: resp.topHotspotsFunction,
    							topStatics: [],							
    							history:[],
    							topHotspotsGPU: [],
    							optimizations: [],
    							topHotspotsFunction: resp.topHotspotsFunction,
    							topHotspotsLoop: resp.topHotspotsLoop,
    							topHotspotsGPUFunction: [],
    							topHotspotsGPULoop: [],
    							topStaticsFunction: [],
    							topStaticsLoop: [],							
    							OptimizationFunc: [],
    							OptimizationLoop: []						
    						})
    					})
    	    }
    	    else if (this.state.run_type == 'history'){
    		    console.log(fetch_link);
    		    fetch(fetch_link)
    					.then(resp => resp.json())
    						.then(resp => {
    							console.log(resp);
                if (Object.keys (resp).length < 5) {
                  alert ('Could not analyze project. Either try again later, or check if project structure violates toolbox requirements.')
                }
                else if (Object.keys (resp).includes ('message')) {
                  alert ('The requested results could not be found in the toolbox database. Please ensure an analysis has already taken place in the past.')
                }
    							this.setState({
    								isLoading: false,
    								name: resp.projectName,
    								history:resp.history_energy,
    								storehistory: [resp.history_energy],
                                    timeplatform1: resp.timeplatform1,
                                    timeplatform2: resp.timeplatform2,
                                    timeplatform3: resp.timeplatform3,
                                    timeplatform4: resp.timeplatform4,
                                    energyplatform1: resp.energyplatform1,
                                    energyplatform2: resp.energyplatform2,
                                    energyplatform3: resp.energyplatform3,
                                    energyplatform4: resp.energyplatform4
    							})
    						})
    	    }
    	    else if (this.state.run_type == 'acceleration'){
    		    console.log(fetch_link);
    		    fetch(fetch_link)
    					.then(resp => resp.json())
    						.then(resp => {
    							console.log(resp);
                if (Object.keys (resp).length < 5) {
                  alert ('Could not analyze project. Either try again later, or check if project structure violates toolbox requirements.')
                }
                else if (Object.keys (resp).includes ('message')) {
                  alert ('The requested results could not be found in the toolbox database. Please ensure an analysis has already taken place in the past.')
                }
    							this.setState({
    								isLoading: false,
    								name: resp.projectName,
    								energyIndicatorsSummary: [],
    								acelerationIndicatorsSummary: resp.acelerationIndicatorsSummary,
    								boxforiterations: [],							
    								totalenergyIndicator: [],
    								topHotspots: [],
    								topStatics: [],
    								history:[],
    								topHotspotsGPU: resp.topHotspotsGPUFunction,
    								optimizations: resp.OptimizationFunc,
    								topHotspotsFunction: [],
    								topHotspotsLoop: [],
    								topHotspotsGPUFunction: resp.topHotspotsGPUFunction,
    								topHotspotsGPULoop: resp.topHotspotsGPULoop,
    								topStaticsFunction: [],
    								topStaticsLoop: [],
    								OptimizationFunc: resp.OptimizationFunc,
    								OptimizationLoop: resp.OptimizationLoop
    							})
    						}) 	
    	    	}
            else if (this.state.run_type == 'android') {
              console.log(fetch_link);
              fetch(fetch_link)
               .then(resp => resp.json())
                 .then(resp => {
                   console.log(resp);
                if (Object.keys (resp).length < 5) {
                  alert ('Could not analyze project. Either try again later, or check if project structure violates toolbox requirements.')
                }
                else if (Object.keys (resp).includes ('message')) {
                  alert ('The requested results could not be found in the toolbox database. Please ensure an analysis has already taken place in the past.')
                }
                   this.setState({
                     isLoading: false,
                     name: resp.projectName,
                     javaenergy: resp.anadroidenergy
                   })
                 })
           }
           else if (this.state.run_type == 'hotstatic') {
    	        console.log(fetch_link);
    	        fetch(fetch_link)
    				    .then(resp => resp.json())
    					    .then(resp => {
    						    console.log(resp);
                if (Object.keys (resp).length < 5) {
                  alert ('Could not analyze project. Either try again later, or check if project structure violates toolbox requirements.')
                }
                else if (Object.keys (resp).includes ('message')) {
                  alert ('The requested results could not be found in the toolbox database. Please ensure an analysis has already taken place in the past.')
                }
    						    this.setState({
    							    isLoading: false,
    							    name: resp.projectName,
    							    energyIndicatorsSummary: resp.energyIndicatorsSummary,
    							    acelerationIndicatorsSummary: [],
    							    boxforiterations: [],
    						      totalenergyIndicator: [],
    							    topHotspots: resp.topHotspotsFunction,
    							    topStatics: resp.topStaticFunction,							
    							    history:[],
    							    topHotspotsGPU: [],
    							    optimizations: [],
    							    topHotspotsFunction: resp.topHotspotsFunction,
    							    topHotspotsLoop: resp.topHotspotsLoop,
    							    topHotspotsGPUFunction: [],
    							    topHotspotsGPULoop: [],
    							    topStaticsFunction: resp.topStaticsFunction,
    							    topStaticsLoop: resp.topStaticsLoop,							
    							    OptimizationFunc: [],
    							    OptimizationLoop: []						
    						    })
    					    })
           }
    		}	
    		

    	

    	morewindows = (event) => {
    		this.setState({ 
    	            isLoading: true,
    	        });
    	    event.preventDefault();
    	    const data = new FormData(event.target);
    	    var new_analysis = new String();
    	    new_analysis = '';
    	    if (this.state.new_analysis === 'New'){
    	    	new_analysis = 'T';
    	    }

            var obj = sessionStorage.getItem('selected_project')
            var mag = JSON.parse (obj)
            var github_url = mag.endpoint 
            var user_name = mag.username
            var github_token = mag.password
            try {
              var commit = JSON.parse (mag.energy).commit
            }
            catch (err) {
              var commit = ""
            }

            if (sessionStorage.getItem('selected_project') === null){
            
                console.log("message No project selected. Please select a project from the Projects panel and retry")
            
            }else{
               var selectedProjectSession = JSON.parse(sessionStorage.getItem('selected_project'))
                
                console.log(selectedProjectSession['name'])

                //user_name = selectedProjectSession['username']; 
                //github_token = selectedProjectSession['password'];
                //github_url = selectedProjectSession['endpoint']; 
                //commit = data.get('commit'); 

            }

            this.setState({ 
    	            github_urls: github_url,
    	        });
    		this.setState({ 
    	            github_tokens: github_token,
    	        });	   
    		this.setState({ 
    	            user_names: user_name,
    	        });	   	        	        	    	    
    	    var iteraurl = "";
    	    iteraurl = iteraurl.concat(data.get('loopnumber'));
    	    iteraurl = iteraurl.concat('-');
    	    iteraurl = iteraurl.concat(data.get('iternumber'));	    
    	    this.setState({
    	   			Platform: '',
    		    });
    	    this.setState({
    	    		Granularities: '',
    	    	});
    	    const fetch_link = ENERGY_TOOLBOX_ENDPOINT+`/analysis?new=${new_analysis}&user=${user_name}&token=${github_token}&url=${github_url}&commit=${commit}&type=${this.state.run_type}`;	
            //const fetch_link = `${ENERGY_TOOLBOX_ENDPOINT}/analysis?new=${new_analysis}&user=cappadokes&token=de368e0c5b26ad400114a0f850c36e336030e991&url=https://github.com/cappadokes/neurasmus&commit=${commit}&type=${this.state.run_type}`; 

    	    if (this.state.run_type == 'static'){
    		    console.log(fetch_link);
    		    fetch(fetch_link)
    					.then(resp => resp.json())
    						.then(resp => {
    							console.log(resp);
                if (Object.keys (resp).length < 5) {
                  alert ('Could not analyze project. Either try again later, or check if project structure violates toolbox requirements.')
                }
                else if (Object.keys (resp).includes ('message')) {
                  alert ('The requested results could not be found in the toolbox database. Please ensure an analysis has already taken place in the past.')
                }
    							this.setState({
    								isLoading: false,
    								name: resp.projectName,
    								energyIndicatorsSummary:[],								
    								acelerationIndicatorsSummary: [],
    								boxforiterations: resp.boxforiterations,
    								totalenergyIndicator: resp.totalenergyIndicator,
    								topHotspots: [],
    								topStatics: resp.topStaticsFunction,
    								history: [],
    								topHotspotsGPU: [],
    								optimizations: [],
    								topHotspotsFunction: [],
    								topHotspotsLoop: [],
    								topHotspotsGPUFunction: [],
    								topHotspotsGPULoop: [],
    								topStaticsFunction: resp.topStaticsFunction,
    								topStaticsLoop: resp.topStaticsLoop,
    								OptimizationFunc: [],
    								OptimizationLoop: []
    							})
    						})
    	    }
    		else {
    		    console.log(fetch_link);
    		    fetch(fetch_link)
    					.then(resp => resp.json())
    						.then(resp => {
                if (Object.keys (resp).length < 5) {
                  alert ('Could not analyze project. Either try again later, or check if project structure violates toolbox requirements.')
                }
                else if (Object.keys (resp).includes ('message')) {
                  alert ('The requested results could not be found in the toolbox database. Please ensure an analysis has already taken place in the past.')
                }
    							console.log(resp);
    							this.setState({
    								isLoading: false,
    								name: resp.projectName,
    								energyIndicatorsSummary: resp.energyIndicatorsSummary,
    								acelerationIndicatorsSummary: resp.acelerationIndicatorsSummary,
    								boxforiterations: resp.boxforiterations,							
    								totalenergyIndicator: resp.totalenergyIndicator,
    								topHotspots: resp.topHotspotsFunction,
    								topStatics: resp.topStaticsFunction,
                    javaenergy: resp.anadroidenergy,
    								topHotspotsGPU: resp.topHotspotsGPUFunction,
    								optimizations: resp.OptimizationFunc,
    								topHotspotsFunction: resp.topHotspotsFunction,
    								topHotspotsLoop: resp.topHotspotsLoop,
    								topHotspotsGPUFunction: resp.topHotspotsGPUFunction,
    								topHotspotsGPULoop: resp.topHotspotsGPULoop,
    								topStaticsFunction: resp.topStaticsFunction,
    								topStaticsLoop: resp.topStaticsLoop,
    								OptimizationFunc: resp.OptimizationFunc,
    								OptimizationLoop: resp.OptimizationLoop							 
    							})
    						})
    		}
    	}	


    	putiterations = (event) => {
    		this.setState({ 
    	            isLoading: true,
    	        });
    	    event.preventDefault();
    	    const data = new FormData(event.target);
    	    var new_analysis = new String();
    	    new_analysis = '';
    	    if (this.state.new_analysis === 'New'){
    	    	new_analysis = 'T';
    	    }
    	    

            var obj = sessionStorage.getItem('selected_project')
            var mag = JSON.parse (obj)
            var github_url = obj.endpoint
            var user_name = mag.username
            var github_token = mag.password
            try {
              var commit = JSON.parse (mag.energy).commit
            }
            catch (err) {
              var commit = ""
            }

            if (sessionStorage.getItem('selected_project') === null){
            
                console.log("message No project selected. Please select a project from the Projects panel and retry")
            
            }else{
               var selectedProjectSession = JSON.parse(sessionStorage.getItem('selected_project'))
                
                console.log(selectedProjectSession['name'])

                //user_name = selectedProjectSession['username']; 
                //github_token = selectedProjectSession['password'];
                //github_url = selectedProjectSession['endpoint']; 
                //commit = data.get('commit'); 

            }

            var iteraurl = "";
    	    var checking = data.get("loopnumber");
    	    iteraurl = iteraurl.concat(data.get('loopnumber'));
    	    iteraurl = iteraurl.concat('-');
    	    iteraurl = iteraurl.concat(data.get('iternumber'));
    	    this.setState({
    	   			Platform: '',
    		    });
    	    this.setState({
    	    		Granularities: '',
    	    	});
    	    const fetch_link = ENERGY_TOOLBOX_ENDPOINT+`/analysis?new=${new_analysis}&user=${user_name}&token=${github_token}&url=${github_url}&type=${this.state.run_type}&speciter=${iteraurl}`;
          //const fetch_link = `${ENERGY_TOOLBOX_ENDPOINT}/analysis?new=${new_analysis}&user=cappadokes&token=de368e0c5b26ad400114a0f850c36e336030e991&url=https://github.com/cappadokes/neurasmus&type=${this.state.run_type}&speciter=${iteraurl}`; 	     	
    	  if (checking <= this.state.boxforiterations.anotherbox && checking>=1) {
    	    if (this.state.run_type == 'static'){
    		    console.log(fetch_link);
    		    fetch(fetch_link)
    					.then(resp => resp.json())
    						.then(resp => {
    							console.log(resp);
                if (Object.keys (resp).length < 5) {
                  alert ('Could not analyze project. Either try again later, or check if project structure violates toolbox requirements.')
                }
                else if (Object.keys (resp).includes ('message')) {
                  alert ('The requested results could not be found in the toolbox database. Please ensure an analysis has already taken place in the past.')
                }
    							this.setState({
    								isLoading: false,
    								name: resp.projectName,
    								energyIndicatorsSummary: [],
    								acelerationIndicatorsSummary: [],
    								boxforiterations: resp.boxforiterations,
    								totalenergyIndicator: resp.totalenergyIndicator,
    								topHotspots: [],
    								topStatics: resp.topStaticsFunction,
    								history:[],
    								topHotspotsGPU: [],
    								optimizations: [],
    								topHotspotsFunction: [],
    								topHotspotsLoop: [],
    								topHotspotsGPUFunction: [],
    								topHotspotsGPULoop: [],
    								topStaticsFunction: resp.topStaticsFunction,
    								topStaticsLoop: resp.topStaticsLoop,
    								OptimizationFunc: [],
    								OptimizationLoop: []
    							})
    						})
    	    }
    	    else {	   
    			console.log(fetch_link);
    		    fetch(fetch_link)
    					.then(resp => resp.json())
    						.then(resp => {
    							console.log(resp);
                if (Object.keys (resp).length < 5) {
                  alert ('Could not analyze project. Either try again later, or check if project structure violates toolbox requirements.')
                }
                else if (Object.keys (resp).includes ('message')) {
                  alert ('The requested results could not be found in the toolbox database. Please ensure an analysis has already taken place in the past.')
                }
    							this.setState({
    								isLoading: false,
    								name: resp.projectName,
    								energyIndicatorsSummary: resp.energyIndicatorsSummary,
    								acelerationIndicatorsSummary: resp.acelerationIndicatorsSummary,
    								boxforiterations: resp.boxforiterations,							
    								totalenergyIndicator: resp.totalenergyIndicator,
    								topHotspots: resp.topHotspotsFunction,
    								topStatics: resp.topStaticsFunction,
    								topHotspotsGPU: resp.topHotspotsGPUFunction,
    								optimizations: resp.OptimizationFunc,
    								topHotspotsFunction: resp.topHotspotsFunction,
                    javaenergy: resp.anadroidenergy,
    								topHotspotsLoop: resp.topHotspotsLoop,
    								topHotspotsGPUFunction: resp.topHotspotsGPUFunction,
    								topHotspotsGPULoop: resp.topHotspotsGPULoop,
    								topStaticsFunction: resp.topStaticsFunction,
    								topStaticsLoop: resp.topStaticsLoop,
    								OptimizationFunc: resp.OptimizationFunc,
    								OptimizationLoop: resp.OptimizationLoop
    							})
    						})
    		}
    		}
    		else{
    			window.alert("Please insert suitable loop");
    			this.setState({
    								isLoading: false,							
    							})	
    		}
    	}

    	updateHotspotsData = (granularity) => {
    		this.setState({ 
                isLoading: true,
            });
    		
    		if(this.state.run_type == 'hotspots'){

    			if (granularity === 'function'){
    					this.setState({
    						isLoading: false,
    						topHotspots: this.state.topHotspotsFunction
    					})
    			}
    			else{
    					this.setState({
    						isLoading: false,
    						topHotspots: this.state.topHotspotsLoop
    					})
    			}
    		}
    		else {

    			if (granularity === 'function'){
    					this.setState({
    						isLoading: false,
    						topHotspots: this.state.topHotspotsFunction,
    						topHotspotsGPU: this.state.topHotspotsGPUFunction,
    						optimizations: this.state.OptimizationFunc
    					})
    			}
    			else{
    					this.setState({
    						isLoading: false,
    						topHotspots: this.state.topHotspotsLoop,
    						topHotspotsGPU: this.state.topHotspotsGPULoop,
    						optimizations: this.state.OptimizationLoop
    					})
    			}
    		}
    	}

      	updateplatform = (granularity,miniplatform,platformname) => {
    		this.setState({ 
                isLoading: true,
            });
            var oks = this.state.topStaticsFunction;
            var oks1 = this.state.topStaticsLoop;
            var oksss = Object.keys(oks);
            var oksss1 = Object.keys(oks1);
            var i,j;
            var something = (oksss[0]).toString();
            var sssmmm = something.substring(18,something.length)
            //window.alert(miniplatform)
    		if (this.state.run_type == 'static' || this.state.run_type == 'full'){
    			if (granularity === 'function'){
    				for (i=0; i<oksss.length; i++){
    				//	nameofplatform = "platform";
    				//	nameofplatform = nameofplatform.concat((i+1).toString())
    					for (j=0; j<oksss.length; j++){
    						something = (oksss[j]).toString();
    						sssmmm = something.substring(18,something.length)
    						sssmmm = parseInt(sssmmm)
    						if (sssmmm == i+1) {
    							sssmmm = j
    							break
    						}						
    					}
    					if (miniplatform == platformname[i]){
    						this.setState({
    							isLoading: false,
    							Platform: platformname[i],
    							Granularities: 'function',
    							topStatics: oks[Object.keys(oks)[sssmmm]]
    						})
    						break
    					}
    					if (i == oksss.length-1){
    						this.setState({
    							isLoading: false,
    							Platform: platformname[0],
    							Granularities: 'function',
    							//topStatics: oks[Object.keys(oks)[0]]
                                topStatics: this.state.topStaticsFunction.topStaticsFunction1
    						})
    					}
    				}
    			}
    			else if (granularity === 'loop'){
    				for (i=0; i<oksss1.length; i++){
    					for (j=0; j<oksss1.length; j++){
    						something = (oksss1[j]).toString();
    						sssmmm = something.substring(14,something.length)
    						sssmmm = parseInt(sssmmm)
    						if (sssmmm == i+1) {
    							sssmmm = j
    							break
    						}						
    					}
    					if (miniplatform == platformname[i]){
    						this.setState({
    							isLoading: false,
    							Platform: platformname[i],
    							Granularities: 'loop',
    							topStatics: oks1[Object.keys(oks1)[sssmmm]]
    						})
    						break
    					}
    					if (i == oksss1.length-1){
    						this.setState({
    							isLoading: false,
    							Platform: platformname[0],
    							Granularities: 'loop',
    							//topStatics: oks1[Object.keys(oks1)[0]]
                                topStatics: this.state.topStaticsLoop.topStaticsLoop1                                
    						})	
    					}
    				}
    			}
    			else {
    				for (i=0; i<oksss.length; i++){
    					//nameofplatform = "platform";
    					//nameofplatform = nameofplatform.concat((i+1).toString())
    					for (j=0; j<oksss.length; j++){
    						something = (oksss[j]).toString();
    						sssmmm = something.substring(18,something.length)
    						sssmmm = parseInt(sssmmm)
    						if (sssmmm == i+1) {
    							sssmmm = j
    							break
    						}						
    					}
    					if (miniplatform == platformname[i]){
    						this.setState({
    							isLoading: false,
    							Platform: platformname[i],
    							Granularities: 'function',
    							topStatics: oks[Object.keys(oks)[sssmmm]]
    						})
    						break
    					}
    					if (i == oksss.length-1){
    						this.setState({
    							isLoading: false,
    							Platform: platformname[0],
    							Granularities: 'function',
    							//topStatics: oks[Object.keys(oks)[0]]
                                topStatics: this.state.topStaticsFunction.topStaticsFunction1                                
    						})	
    					}
    				}
    			}
    		}
      	}


    	componentDidMount(){
    		this.setState({ 
                isLoading: true,
            });

    		this.setState({
    				isLoading: false,
    				name: [],
    				energyIndicatorsSummary: [],
    				acelerationIndicatorsSummary: [],
    				boxforiterations: [],
    				totalenergyIndicator: [],
    				topHotspots: [],
    				topStatics: [],
    				history:[],
                    timeplatform1:[],
                    timeplatform2:[],
                    timeplatform3:[],
                    timeplatform4:[],
                    energyplatform1:[],
                    energyplatform2:[],
                    energyplatform3:[],
                    energyplatform4:[],
    				topHotspotsGPU: [],
    				optimizations: [],
    				topHotspotsFunction: [],
    				topHotspotsLoop: [],
    				topHotspotsGPUFunction: [],
    				topHotspotsGPULoop: [],
    				topStaticsFunction: [],
    				topStaticsLoop: [],
    				OptimizationFunc: [],
    				OptimizationLoop: [],
            javaenergy: [],
    			})
    	}

    	render(){
    		const { isLoading, name, energyIndicatorsSummary, acelerationIndicatorsSummary, boxforiterations, totalenergyIndicator, topStaticsFunction, topStaticsLoop, topHotspotsFunction, topHotspotsLoop, topHotspotsGPUFunction, topHotspotsGPULoop, OptimizationFunc, javaenergy, new_analysis } = this.state
    		if(isLoading){
                return (<Loader/>)
            }
    		return(
    			<React.Fragment>
    				<ProjectPanel
    					myprojectName={name}
    					updateProjectData={this.updateProjectData}				
    					updateAnalysis={this.updateAnalysis}
    					updateRunType={this.updateRunType}
    					new_analysis={this.state.new_analysis}
    					run_type={this.state.run_type}
    					handleSubmit = {this.handleSubmit}
    					morewindows = {this.morewindows}
    					boxforiterations = {boxforiterations}
              javaenergy = {javaenergy}
    				/>
    				<StaticPanel 
    					myprojectName={name}
    					analysiz = {this.state.new_analysis}
    					statictype={this.state.run_type}				
    					updateplatform={this.updateplatform}
    					updateplatforms={this.updateplatforms}
    					statics={this.state.topStatics}
    					propgran={this.state.Granularities}
    					propplat={this.state.Platform}
    					boxforiterations = {boxforiterations}
    					morewindows = {this.morewindows}
    					putiterations = {this.putiterations}
    					totalenergy={totalenergyIndicator}
    				/>
                    <HotspotsPanel 
                        myprojectName={name}
                        hotspottype={this.state.run_type}
                        updateHotspotsData={this.updateHotspotsData}
                        myEnergySummary={energyIndicatorsSummary} 
                        hotspots={this.state.topHotspots}
                    />
                    <HistoryPlot
                        myprojectName={name}
                        runtype={this.state.run_type}
                        history={this.state.history}
                        timeplatform1={this.state.timeplatform1}
                        timeplatform2={this.state.timeplatform2}
                        timeplatform3={this.state.timeplatform3}
                        timeplatform4={this.state.timeplatform4}
                        energyplatform1={this.state.energyplatform1}
                        energyplatform2={this.state.energyplatform2}
                        energyplatform3={this.state.energyplatform3}
                        energyplatform4={this.state.energyplatform4}
                    />
               <AndroidPanel                                                                  
                myprojectName={name} 
                androidtype={this.state.run_type}
                javaenergy={javaenergy}
               />         
    				<OffloadingPanel
    					myprojectName={name}
    					offloadtype={this.state.run_type}
    					updateHotspotsData={this.updateHotspotsData}
    					hotspotsGPU={this.state.topHotspotsGPU}
    				/>
    				<OptimizationsPanel
    					myprojectName={name}
    					optimizetype={this.state.run_type}			
    					updateHotspotsData={this.updateHotspotsData}
    					optimizations={this.state.optimizations}
    				/>
    			</React.Fragment>
    		)
    	}
    }

    export default EnergyDashPage;

    				/*<OffloadingPanel
    					myprojectName={name}
    					updateHotspotsData={this.updateHotspotsData}
    					hotspotsGPU={this.state.topHotspotsGPU} 
    					myAccelerationSummary={acelerationIndicatorsSummary}
    				/>*/
