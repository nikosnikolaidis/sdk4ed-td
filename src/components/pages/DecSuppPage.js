import React from 'react';
import { MDBCol, MDBCard, MDBCardBody, MDBCardHeader, MDBRow, MDBDropdown, MDBInput, MDBFormInline, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBContainer, MDBDataTable, MDBBtn, MDBIcon, MDBJumbotron } from 'mdbreact';
import Highcharts from 'highcharts';
import Loader from './sections/Loading'
import HighchartsReact from 'highcharts-react-official';
import vector from 'highcharts/modules/vector.js';
import PropTypes from 'prop-types'
import { Line } from 'react-chartjs-2';

const TD_refs = {place: 'holder',
                  opportunities: {
                    hello: 'world',
                    I: 'amAnUnstoppableForce',
                    hello2: 'world',
                    I2: 'amAnUnstoppableForce',
                    hello3: 'world',
                    I3: 'amAnUnstoppableForce',
                    hello4: 'world',
                    I4: 'amAnUnstoppableForce',
                    hello5: 'world',
                    I5: 'amAnUnstoppableForce',
                    hello6: 'world',
                    I7: 'amAnUnstoppableForce',
                    hello7: 'world',
                    I5: 'amAnUnstoppableForce',
                    hello8: 'world',
                    I0: 'amAnUnstoppableForce',
                    hello0: 'world',
                    I9: 'amAnUnstoppableForce',
                    hello9: 'world',
                  }
                }

vector(Highcharts);

const projKey = 'Basic c2lhdnZhc21AaXRpLmdyOjAyODdQQU9LNjYxMyEh'
const projAuthObjSec = {
	method: 'GET',
	mode: 'cors',
	headers: new Headers ({
		'Authorization': projKey
	})
}
const dash_link = process.env.REACT_APP_DASHBOARD_IP
const en_link = dash_link + 'energy'
const td_link = dash_link + 'tdanalysis'
const sec_link = dash_link + 'security'

/*
Below, the endpoints of the Energy, TD and Security toolboxes are declared.
It is these endpoints, concatenated with the specific Refactorings API information,
that are going to be hit with the project info.
*/
const en_ep = process.env.REACT_APP_ENERGY_TOOLBOX_ENDPOINT
var endP1 = en_ep + '/analysis?type=full&new=&'
const endP2 = process.env.REACT_APP_TD_TOOL_INTEREST_ENDPOINT
const endP3 = process.env.REACT_APP_DEPENDABILITY_TOOL_SERVER_IP + '/DependabilityToolbox/DependabilityDatabase?analysis_type=securityAssessment&'

//Below the DB endpoint and API for invoking the LUT is declared.
const dbEndp = process.env.REACT_APP_DECSUPP_IP
const lutAPI = '/query'
const dec = '/decide'
const mcdmEndp = dbEndp + dec
var myHead = new Headers ();
const lutAuth = {
	method: 'GET',
	credentials: 'include',
}

function greeting () {
	alert ('Hello, world!');
}

const classNum = 5;
const center = Math.floor ((classNum - 1) / 2)

function getHC (normAng) {
	if (normAng <= 270) {
		return 270 - normAng;
	}	else {
		return 360 + 270 - normAng;
	}
}

function realVictorizer (objArray) {
	const count = objArray.length
	var data12 = {
		title: 'Energy vs Technical Debt',
		series: []
	}
	var data23 = {
		title: 'Technical Debt vs Security',
		series: []
	}
	var data13 = {
		title: 'Energy vs Security',
		series: []
	}
	for (var i = 0; i < count; i++) {
		let indRef = objArray[i]
		let randColor = '#'+(Math.random()*0xEFFFFF<<0).toString(16)
		let datChunk12 = {
			type: 'vector',
			name: indRef.name,
			color: randColor,
			vectorLength: 0.8 * indRef.vectors["1v2"].len * secret,
			data: [[center, center, indRef.vectors["1v2"].len, getHC (indRef.vectors["1v2"].ang)]]
		}
		data12.series.push (datChunk12)
		let datChunk23 = {
			type: 'vector',
			name: indRef.name,
			color: randColor,
			vectorLength: 0.8 * indRef.vectors["2v3"].len * secret,
			data: [[center, center, indRef.vectors["2v3"].len, getHC (indRef.vectors["2v3"].ang)]]
		}
		data23.series.push (datChunk23)
		let datChunk13 = {
			type: 'vector',
			name: indRef.name,
			color: randColor,
			vectorLength: 0.8 * indRef.vectors["1v3"].len * secret,
			data: [[center, center, indRef.vectors["1v3"].len, getHC (indRef.vectors["1v3"].ang)]]
		}
		data13.series.push (datChunk13)
	}
	return [data12, data23, data13]
}

function invokeLUT (jsonRefs, count, callback) {
   var whole = [];
	var n = ""
	for (var i = 0; i < jsonRefs.length; i++) {
      let params = '?' + 'name=' + jsonRefs[i];
      fetch (dbEndp + lutAPI + params, lutAuth)
      .then ((response) => {
         return response.json()
      })
      .then ((data) => {
			if (!(data.error == 'Record does not exist')) {
				data['count'] = count[data['name']]
         	whole.push(data);
				callback (whole, realVictorizer (whole))
			}
      });
  }
}

function updateCount (count, refName, toAdd) {
	if ((typeof count[refName]).includes ('undefined')) {
		count[refName] = toAdd
	} else {
		count[refName] += toAdd
	}
	return count
}

function unrollEnergy (count, arr, data) {
	var writeAcc = true
	var writeCach = true
  if ("OptimizationFunc" in data) {
	const funcBlock = data.OptimizationFunc.rows
	const funcount = Object.keys (funcBlock).length
	for (var i = 0; i < funcount; i++) {
		if (funcBlock["" + i].optimization === 'no') {
			continue
		} else {
			if (funcBlock["" + i].optimization.includes ('Acceleration')) { 
				if (writeAcc) {
					arr.push ('Acceleration')
					writeAcc = false
				}
				count = updateCount (count, 'Acceleration', 1)
			}
			if (funcBlock["" + i].optimization.includes ('ache')) { 
				if (writeCach) {
					arr.push ('Cache Blocking')
					writeCach = false
				}
				count = updateCount (count, 'Cache Blocking', 1)
			}
		}
	}
  }
  if ("OptimizationLoop" in data) {
	const loopBlock = data.OptimizationLoop.rows
	const loopcount = Object.keys (loopBlock).length
	for (var i = 0; i < loopcount; i++) {
		if (loopBlock["" + i].optimization === 'no') {
			continue
		} else {
			if (loopBlock["" + i].optimization.includes ('Acceleration')) { 
				if (writeAcc) {
					arr.push ('Acceleration')
					writeAcc = false
				}
				count = updateCount (count, 'Acceleration', 1)
			}
			if (loopBlock["" + i].optimization.includes ('ache')) { 
				if (writeCach) {
					arr.push ('Cache Blocking')
					writeCach = false
				}
				count = updateCount (count, 'Cache Blocking', 1)
			}
		}
	}
  }
	var obj = sessionStorage.getItem('selected_project')
	var mag = JSON.parse (obj)

  if (mag.name.includes ("olisun")) {
   var stick = data.anadroidenergy.values[7]
  } else {
    var stick = data.totalenergyIndicator.mainplatforms[0]
  }
	return [count, arr, parseFloat (stick)]
}

function unrollSecurity (count, arr, data) {
	const refBlock = data.report.issues
	for (var i=0; i < Object.keys (refBlock).length; i++) {
		if (refBlock["" + i].issues.length === 0) {
			continue
		} else {
			arr.push (refBlock[""+i].propertyName)
			count = updateCount (count, refBlock[""+i].propertyName, refBlock[""+i].issues.length)
		}
	}
	return [count, arr, data.report.security_index.eval]
}

function unrollTD (count, arr, data, opt) {
	const loCount = Object.keys (data).length
	if (loCount == 0) {
		return count
	} else {
		return updateCount (count, 'Extract Method', loCount)
	}
}

function gatherRefactorings (callback, callback2) {
	var arr = [];
	var count = {}
	var obj = sessionStorage.getItem('selected_project')
	var mag = JSON.parse (obj)
	var url = mag.endpoint
  var usr = mag.username
  var refAPI_1 = "url=" + url + "&user=" + usr
	var tdanok = true
  if (mag.name.includes ("rasmus")) {
      var refAPI_3 = "project_name=sdk4ed-healthcare-use-case"
      var refAPI_2 = "search?projectID=sdk4ed-healthcare-use-case"
    }
  else if (mag.name.includes ("irbus")) {
      var refAPI_3 = "project_name=kameleon-sdk4ed"
      var refAPI_2 = "search?projectID=Airbus"
    }
  else if (mag.name.includes ("olisun")) {
      var refAPI_3 = "project_name=arassistance"
      var refAPI_2 = "search?projectID=arassistance"
      endP1 = en_ep + '/analysis?type=android&new=&'
    }
  else {
      var refAPI_3 = mag.endpoint.split ("/")
      var myCheck = refAPI_3[refAPI_3.length - 1]
      if (myCheck.includes (".git")) {
        refAPI_3[refAPI_3.length - 1] = myCheck.slice (0, myCheck.length - 4)
      }
      var refAPI_2 = "search?projectID=" + refAPI_3[refAPI_3.length - 1]
      refAPI_3 = "project_name=" + refAPI_3[refAPI_3.length - 1] + "&user_name=" + usr
  }
	
  fetch (endP1 + refAPI_1)
	.then ((response) => {
		return response.json ()
	})
	.then ((data) => {
		let darr = unrollEnergy (count, arr, data)
		count = darr[0]
		arr = darr[1]
		callback2 (darr[2], 'Energy')
	})
	.then (() => {
		invokeLUT (arr, count, callback) 
	});
	fetch (endP2 + 'extractMethodOpportunities/' + refAPI_2)
	.then ((response) => {
		return response.json ()
	})
	.then ((data) => {
    let darr = unrollTD (count, arr, data.opportunities)
    if (count > 0) {
		  arr.push ('Extract Method')
    }
	})
	.then (() => {
		invokeLUT (arr, count, callback) 
	});
	fetch (endP3 + refAPI_3, projAuthObjSec)
	.then ((response) => {
		return response.json ()	
	})
	.then ((data) => {
		let darr2 = unrollSecurity (count, arr, data)
		count = darr2[0]
		arr = darr2[1]
		callback2 (darr2[2], 'Security')
	})
	.then (() => {
		invokeLUT (arr, count, callback) 
	})

	fetch (endP2 + 'principalSummary/' + refAPI_2)
	.then ((response) => {
		if (!response.ok) {
			tdanok = false
		}
		return response.json ()	
	})
	.then ((data) => {
		if (tdanok) {
			callback2 (data.principalSummary.tdInCurrency, 'TD')
		} else {
			alert ('Request for initial TD analysis failed. A dummy value of 1500 will be used as initial TD. Please check network logs.')
		}
	})

}

class Alert extends React.Component {
	render () {
		if (this.props.permit === false) {
			return (
				<div class="alert alert-danger alert-dismissible fade show" role="alert">
					<h4 class="alert-heading">Just a moment</h4>
					<p>For this page to be functional, your project should already be analyzed from the <a href={en_link} class="alert-link">Energy</a>, <a href={td_link} class="alert-link">Technical Debt</a>, and <a href={sec_link} class="alert-link">Security</a>, toolboxes.</p>
					<hr />
					<p class="mb-0">Upon dismissing this message, you acknowledge that the above holds true.</p>
					<button type="button" class="close" data-dismiss="alert" aria-label="Close" onClick = {() => {this.props.handleClick ()}}>
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
			);
		} else {
			return null;
		}
	}
}

function MCDMWelcome (props) {
	if (props.refLen === 0) {
		return null;
	} else {
		return (
			  <React.Fragment>
                  <h2 class="display-4">Confused?</h2>
                  <p class="lead">We will help you sort things out.</p>
                  <hr />
                  <p>The only thing you have to do is inform the tool about your preferences. Which one of the 3 code qualities are you most interested in? Which one do you least care about? And how important is each one of these when compared to the remaining quality? Fill these in the below form, and our decision-making algorithm will take care of the rest.</p>
          </React.Fragment>
		);
	}
}

function StackedColsPanel (props) {
	if (!props.refLen) {
		return null;
	} else {
		var dim = secret * classNum
		var vectRefData12 = {
            plotOptions: {
					column: {
						stacking: 'normal',
						dataLabels: {
							enabled: true
						},
					},
            },
            chart: {
					type: 'column',
               inverted: false,
            },
            xAxis: {
               categories: props.mcdmDat.cats,
               gridLineWidth: 1,
               title: {
                  text: 'Proposed refactorings'
               }
            },
            yAxis: {
               gridLineWidth: 1,
               title: {
                  text: 'Calculated value'
               },
					stackLabels: {
						enabled: true,
						style: {
							fontWeight: 'bold',
							color: (
								Highcharts.defaultOptions.title.style &&
                    		Highcharts.defaultOptions.title.style.color
							) || 'gray'
						},
					},
            },
				legend: {
        			align: 'right',
        			x: -30,
        			verticalAlign: 'top',
        			y: 25,
        			floating: true,
        			backgroundColor:
            		Highcharts.defaultOptions.legend.backgroundColor || 'white',
        			borderColor: '#CCC',
        			borderWidth: 1,
        			shadow: false
    			},
				tooltip: {
        			headerFormat: '<b>{point.x}</b><br/>',
        			pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    			},
            series: props.mcdmDat.series,
				title: {
					text: 'Code quality-specific refactoring values',
				}
      }
		var vectRefData13 = {
            plotOptions: {
					column: {
						dataLabels: {
							enabled: true
						},
					},
            },
            chart: {
					type: 'column',
               inverted: false,
            },
            xAxis: {
               categories: props.mcdmDat.cats,
               gridLineWidth: 1,
               title: {
                  text: 'Proposed refactorings'
               }
            },
            yAxis: {
               gridLineWidth: 1,
               title: {
                  text: 'Calculated value'
               },
					stackLabels: {
						enabled: true,
						style: {
							fontWeight: 'bold',
							color: (
								Highcharts.defaultOptions.title.style &&
                    		Highcharts.defaultOptions.title.style.color
							) || 'gray'
						},
					},
            },
				legend: {
        			align: 'right',
        			x: -30,
        			verticalAlign: 'top',
        			y: 25,
        			floating: true,
        			backgroundColor:
            		Highcharts.defaultOptions.legend.backgroundColor || 'white',
        			borderColor: '#CCC',
        			borderWidth: 1,
        			shadow: false
    			},
				tooltip: {
        			headerFormat: '<b>{point.x}</b><br/>',
        			pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    			},
            series: props.mcdmDat.seriesTotal,
				title: {
					text: 'Best ranked refactoring is ' + props.mcdmDat.prop.name,
				}
      }
		return (
		<React.Fragment>
			<MDBRow className="mb-4">
				<MDBCol md="6" lg="6" className="mb-12">
                  <MDBCard className="mb-12">
                     <MDBCardHeader className="sdk4ed-color">Value-breakdown of refactorings</MDBCardHeader>
                     <MDBCardBody>
                        <HighchartsReact highcharts={Highcharts} options={vectRefData12} immutable = {true} />
                     </MDBCardBody>
                  </MDBCard>
            </MDBCol>
				<MDBCol md="6" lg="6" className="mb-12">
                  <MDBCard className="mb-12">
                     <MDBCardHeader className="sdk4ed-color">Overall values of refactorings</MDBCardHeader>
                     <MDBCardBody>
                        <HighchartsReact highcharts={Highcharts} options={vectRefData13} immutable = {true} />
                     </MDBCardBody>
                  </MDBCard>
            </MDBCol>
			</MDBRow>
		</React.Fragment>
		);
	}
}

// The Vectorized Refactoring Visualization panel
function VectRefVizPanel (props) {
	 var dim = secret * classNum
	 if (props.refLen === 0) {
			return null;
	 } else {
    		var vectRefData12 = {
				plotOptions: {
					vector: {
						enableMouseTracking: false,
						label: {
							connectorAllowed: true
						},
						clip: false,
						rotationOrigin: 'start',
						selected: 'true',
						showCheckBox: true,
						allowPointSelect: true
					}
				},
				chart: {
					inverted: false,
					height: dim,
					width:dim
				},
        		xAxis: {
					angle: 0,
            	min: 0,
            	max: classNum - 1,
					categories: ['Worsen', 'Slightly Worsen', 'No Impact', 'Slightly Improve', 'Improve'],
					gridLineWidth: 1,
					title: {
						text: 'Technical Debt'
					}
        		},
		  		yAxis: {
					angle: 90,
					min: 0,
            	max: classNum - 1,
					categories: ['Worsen', 'Slightly Worsen', 'No Impact', 'Slightly Improve', 'Improve'],
					gridLineWidth: 1,	
					title: {
						text: 'Energy'
					}
		  		},
				series: props.data12.series,
				title: props.data12.title
   	 	}
    		var vectRefData23 = {
				plotOptions: {
					vector: {
						enableMouseTracking: false,
						label: {
							connectorAllowed: true
						},
						clip: false,
						rotationOrigin: 'start',
						selected: 'true',
						showCheckBox: true,
						allowPointSelect: true
					}
				},
				chart: {
					inverted: false,
					height: dim,
					width:dim
				},
        		xAxis: {
					angle: 0,
            	min: 0,
            	max: classNum - 1,
					categories: ['Worsen', 'Slightly Worsen', 'No Impact', 'Slightly Improve', 'Improve'],
					gridLineWidth: 1,
					title: {
						text: 'Security'
					}
        		},
		  		yAxis: {
					angle: 90,
					min: 0,
            	max: classNum - 1,
					categories: ['Worsen', 'Slightly Worsen', 'No Impact', 'Slightly Improve', 'Improve'],
					gridLineWidth: 1,	
					title: {
						text: 'Technical Debt'
					}
		  		},
				series: props.data23.series,
				title: props.data23.title
   	 	}
    		var vectRefData13 = {
				plotOptions: {
					vector: {
						enableMouseTracking: false,
						label: {
							connectorAllowed: true
						},
						clip: false,
						rotationOrigin: 'start',
						selected: 'true',
						showCheckBox: true,
						allowPointSelect: true
					}
				},
				chart: {
					inverted: false,
					height: dim,
					width:dim
				},
        		xAxis: {
					angle: 0,
            	min: 0,
            	max: classNum - 1,
					categories: ['Worsen', 'Slightly Worsen', 'No Impact', 'Slightly Improve', 'Improve'],
            	gridLineWidth: 1,
					title: {
						text: 'Security'
					}
        		},
		  		yAxis: {
					angle: 90,
					min: 0,
            	max: classNum - 1,
					categories: ['Worsen', 'Slightly Worsen', 'No Impact', 'Slightly Improve', 'Improve'],
					gridLineWidth: 1,	
					title: {
						text: 'Energy'
					}
		  		},
				series: props.data13.series,
				title: props.data13.title
   	 	}
    		return (
        		<MDBRow className="mb-4">
            	<MDBCol md="6" lg="4" className="mb-12">
              		<MDBCard className="mb-12">
                		<MDBCardHeader className="sdk4ed-color">Energy vs Technical Debt</MDBCardHeader>
                		<MDBCardBody>
                    		<HighchartsReact highcharts={Highcharts} options={vectRefData12} immutable = {true} />
                		</MDBCardBody>
                	</MDBCard>
            	</MDBCol>
            	<MDBCol md="6" lg="4" className="mb-12">
              		<MDBCard className="mb-12">
                		<MDBCardHeader className="sdk4ed-color">Technical Debt vs Security</MDBCardHeader>
                		<MDBCardBody>
                    		<HighchartsReact highcharts={Highcharts} options={vectRefData23} immutable = {true} />
                		</MDBCardBody>
                	</MDBCard>
            	</MDBCol>
            	<MDBCol md="6" lg="4" className="mb-12">
              		<MDBCard className="mb-12">
                		<MDBCardHeader className="sdk4ed-color">Energy vs Security</MDBCardHeader>
                		<MDBCardBody>
                    		<HighchartsReact highcharts={Highcharts} options={vectRefData13} immutable = {true} />
                		</MDBCardBody>
                	</MDBCard>
            	</MDBCol>
        		</MDBRow>
    		);
	}
}

function doorMan (prefs) {
	var ladyBWgems = 0
	var ladyBWJgems = 0
	for (var key in prefs) {
		if (key === 'best' || key === 'worst') {
			for (var subkey in prefs[key]) {
				if (prefs[key][subkey]) {
					ladyBWgems += 1
				}
			}
		} else if (!(prefs[key] === null)){
			ladyBWJgems += 1
		}
	}
	var test = ladyBWgems === 2 && ladyBWJgems === 4
	return test
}

function MCDMInputs (props) {
	if (props.refLen === 0) {
		return (
			<React.Fragment>
				<h2 class="display-4">Not yet ready</h2>
  				<p class="lead">Please gather suggested refactorings first.</p>
			</React.Fragment>
		)
	} else {
		var control = {
			best: {
				energy: null,
				td: true,
				sec: false
			},
		};
		return (
			<React.Fragment>
					<hr />
					<p>What is the BEST criterion?</p>	
					<div class="custom-control custom-radio custom-control-inline">
               	<input type="radio" class="custom-control-input" id="defaultInline1" name="inlineDefaultRadiosExample" disabled = {props.mcdmInfo['worst']['energy']} onClick = {() => {props.handleIn ('best', 'energy')}}/>
               	<label class="custom-control-label" for="defaultInline1">Energy</label>
            	</div>
            	<div class="custom-control custom-radio custom-control-inline">
               	<input type="radio" class="custom-control-input" id="defaultInline2" name="inlineDefaultRadiosExample" disabled = {props.mcdmInfo['worst']['td']} onClick = {() => {props.handleIn ('best', 'td')}}/>
               	<label class="custom-control-label" for="defaultInline2">Technical Debt</label>
            	</div>
            	<div class="custom-control custom-radio custom-control-inline">
               	<input type="radio" class="custom-control-input" id="defaultInline3" name="inlineDefaultRadiosExample" disabled = {props.mcdmInfo['worst']['sec']} onClick = {() => {props.handleIn ('best', 'sec')}}/>
               	<label class="custom-control-label" for="defaultInline3">Security</label>
            	</div>
					<hr />
					<p>What is the WORST criterion?</p>	
					<div class="custom-control custom-radio custom-control-inline">
               	<input type="radio" class="custom-control-input" id="defaultInline4" name="inlineDefaultRadiosExample2" disabled = {props.mcdmInfo['best']['energy']} onClick = {() => {props.handleIn ('worst', 'energy')}}/>
               	<label class="custom-control-label" for="defaultInline4">Energy</label>
            	</div>
            	<div class="custom-control custom-radio custom-control-inline">
               	<input type="radio" class="custom-control-input" id="defaultInline5" name="inlineDefaultRadiosExample2"  disabled = {props.mcdmInfo['best']['td']} onClick = {() => {props.handleIn ('worst', 'td')}}/>
               	<label class="custom-control-label" for="defaultInline5">Technical Debt</label>
            	</div>
            	<div class="custom-control custom-radio custom-control-inline">
               	<input type="radio" class="custom-control-input" id="defaultInline6" name="inlineDefaultRadiosExample2" disabled = {props.mcdmInfo['best']['sec']} onClick = {() => {props.handleIn ('worst', 'sec')}}/>
               	<label class="custom-control-label" for="defaultInline6">Security</label>
            	</div>
					<hr />
					<p>How important is the BEST criterion when compared to the WORST?</p>	
					<div class="custom-control custom-radio custom-control-inline">
               	<input type="radio" class="custom-control-input" id="defaultInline7" name="inlineDefaultRadiosExample3" onClick = {() => {props.handleIn ('bw', 0)}}/>
               	<label class="custom-control-label" for="defaultInline7">Equally important</label>
            	</div>
            	<div class="custom-control custom-radio custom-control-inline">
               	<input type="radio" class="custom-control-input" id="defaultInline8" name="inlineDefaultRadiosExample3" onClick = {() => {props.handleIn ('bw', 1)}}/>
               	<label class="custom-control-label" for="defaultInline8">A bit more important</label>
            	</div>
					<div class="custom-control custom-radio custom-control-inline">
               	<input type="radio" class="custom-control-input" id="defaultInline9" name="inlineDefaultRadiosExample3" onClick = {() => {props.handleIn ('bw', 2)}}/>
               	<label class="custom-control-label" for="defaultInline9">Quite more important</label>
            	</div>
            	<div class="custom-control custom-radio custom-control-inline">
               	<input type="radio" class="custom-control-input" id="defaultInline10" name="inlineDefaultRadiosExample3" onClick = {() => {props.handleIn ('bw', 3)}}/>
               	<label class="custom-control-label" for="defaultInline10">Much more important</label>
            	</div>
            	<div class="custom-control custom-radio custom-control-inline">
               	<input type="radio" class="custom-control-input" id="defaultInline12" name="inlineDefaultRadiosExample3" onClick = {() => {props.handleIn ('bw', 5)}}/>
               	<label class="custom-control-label" for="defaultInline12">ABSOLUTELY more important</label>
            	</div>
					<hr />
					<p>How important is the BEST criterion when compared to the third one (neither the best, nor the worst)?</p>	
					<div class="custom-control custom-radio custom-control-inline">
               	<input type="radio" class="custom-control-input" id="defaultInline13" name="inlineDefaultRadiosExample4" onClick = {() => {props.handleIn ('bj', 0)}}/>
               	<label class="custom-control-label" for="defaultInline13">Equally important</label>
            	</div>
            	<div class="custom-control custom-radio custom-control-inline">
               	<input type="radio" class="custom-control-input" id="defaultInline14" name="inlineDefaultRadiosExample4" onClick = {() => {props.handleIn ('bj', 1)}}/>
               	<label class="custom-control-label" for="defaultInline14">A bit more important</label>
            	</div>
					<div class="custom-control custom-radio custom-control-inline">
               	<input type="radio" class="custom-control-input" id="defaultInline15" name="inlineDefaultRadiosExample4" onClick = {() => {props.handleIn ('bj', 2)}}/>
               	<label class="custom-control-label" for="defaultInline15">Quite more important</label>
            	</div>
            	<div class="custom-control custom-radio custom-control-inline">
               	<input type="radio" class="custom-control-input" id="defaultInline16" name="inlineDefaultRadiosExample4" onClick = {() => {props.handleIn ('bj', 3)}}/>
               	<label class="custom-control-label" for="defaultInline16">Much more important</label>
            	</div>
            	<div class="custom-control custom-radio custom-control-inline">
               	<input type="radio" class="custom-control-input" id="defaultInline18" name="inlineDefaultRadiosExample4" onClick = {() => {props.handleIn ('bj', 5)}}/>
               	<label class="custom-control-label" for="defaultInline18">ABSOLUTELY more important</label>
            	</div>
					<hr />
					<p>How important is the third criterion when compared to the WORST?</p>	
					<div class="custom-control custom-radio custom-control-inline">
               	<input type="radio" class="custom-control-input" id="defaultInline19" name="inlineDefaultRadiosExample5" onClick = {() => {props.handleIn ('jw', 0)}}/>
               	<label class="custom-control-label" for="defaultInline19">Equally important</label>
            	</div>
            	<div class="custom-control custom-radio custom-control-inline">
               	<input type="radio" class="custom-control-input" id="defaultInline20" name="inlineDefaultRadiosExample5" onClick = {() => {props.handleIn ('jw', 1)}}/>
               	<label class="custom-control-label" for="defaultInline20">A bit more important</label>
            	</div>
					<div class="custom-control custom-radio custom-control-inline">
               	<input type="radio" class="custom-control-input" id="defaultInline21" name="inlineDefaultRadiosExample5" onClick = {() => {props.handleIn ('jw', 2)}}/>
               	<label class="custom-control-label" for="defaultInline21">Quite more important</label>
            	</div>
            	<div class="custom-control custom-radio custom-control-inline">
               	<input type="radio" class="custom-control-input" id="defaultInline22" name="inlineDefaultRadiosExample5" onClick = {() => {props.handleIn ('jw', 3)}}/>
               	<label class="custom-control-label" for="defaultInline22">Much more important</label>
            	</div>
            	<div class="custom-control custom-radio custom-control-inline">
               	<input type="radio" class="custom-control-input" id="defaultInline24" name="inlineDefaultRadiosExample5" onClick = {() => {props.handleIn ('jw', 5)}}/>
               	<label class="custom-control-label" for="defaultInline24">ABSOLUTELY more important</label>
            	</div>
					<hr />
					<p>Last but not least, would you like to scale each refactoring value with the number of times that the tools propose for it to be applied? BEWARE of the bias introduced by this option. It is recommended that you experiment with this option repeatedly and closely examine the returned results.</p>	
					<div class="custom-control custom-radio custom-control-inline">
               	<input type="radio" class="custom-control-input" id="defaultInline25" name="inlineDefaultRadiosExample6" onClick = {() => {props.handleIn ('sc', false)}}/>
               	<label class="custom-control-label" for="defaultInline25">Yes</label>
            	</div>
            	<div class="custom-control custom-radio custom-control-inline">
               	<input type="radio" class="custom-control-input" id="defaultInline26" name="inlineDefaultRadiosExample6"  onClick = {() => {props.handleIn ('sc', true)}}/>
               	<label class="custom-control-label" for="defaultInline26">No</label>
            	</div>
					<hr />
					<button class="btn btn-primary btn-lg"  type="button" onClick={() => {props.triggerBeast ()}} disabled={!props.isClear}>Invoke MCDM</button>
			</React.Fragment>
		);
	}
}

function RefButt (props) {
	if (props.butt === false) {
		return (
			<React.Fragment>
				<h2 class="display-4">Welcome!</h2>
  				<p class="lead">This is the Trade-off Manager for SDK4ED Decision Support.</p>
				<hr />
  				<p>In here you can get a bird-eye view of the proposed refactorings and, more importantly, decide which ones best suit your needs. As a first step, you are encouraged to gather all the suggestions produced from the rest of the analysis tooolboxes. This will give you a unified picture of the trade-offs between each refactoring. When ready, proceed with pressing the below button!</p>
  				<a class="btn btn-primary btn-lg"  type="button" disabled = {props.butt} onClick={() => {props.handleClick ()}}>Retrieve Refactorings</a>
			</React.Fragment>
		);
	} else {
		let r = []
		for (var i = 0; i < props.refs.length; i++) {
			r.push ({
				name: props.refs[i].name,
				im_1: props.refs[i].impacts.Energy,
				im_2: props.refs[i].impacts["Technical Debt"],
				im_3: props.refs[i].impacts.Security
			});
		}
		const data = {
			columns: [
				{
					label: 'Refactoring',
					field: 'name'
				},
				{
					label: 'Impact on Energy',
					field: 'im_1'
				},
				{
					label: 'Impact on Technical Debt',
					field: 'im_2'
				},
				{
					label: 'Impact on Security',
					field: 'im_3'
				},
			],
			rows: r
		}
		if (r.length != 0) {
		return (
				<React.Fragment>
					<h2 class="display-4">Welcome!</h2>
  					<p class="lead">This is the Trade-off Manager for SDK4ED Decision Support.</p>
					<hr />
  					<p>In here you can get a bird-eye view of the proposed refactorings and, more importantly, decide which ones best suit your needs. As a first step, you are encouraged to gather all the suggestions produced from the rest of the analysis tooolboxes. This will give you a unified picture of the trade-offs between each refactoring. When ready, proceed with pressing the below button!</p>
  					<a class="btn btn-primary btn-lg"  type="button" disabled={props.butt} onClick={() => {props.handleClick ()}}>Retrieve Refactorings</a>
        			<MDBRow className="mb-4">
            		<MDBCol md="6" lg="12" className="mb-12">
              			<MDBCard className="mb-12">
                			<MDBCardHeader className="sdk4ed-color">Retrieved Refactorings</MDBCardHeader>
                			<MDBCardBody>
         						<MDBDataTable
										bordered
										hover
										data = {data}
									/>
                			</MDBCardBody>
                		</MDBCard>
            		</MDBCol>
					</MDBRow>
				</React.Fragment>
		);
		} else {
			return (	
				<React.Fragment>
					<h2 class="display-4">Welcome!</h2>
  					<p class="lead">This is the Trade-off Manager for SDK4ED Decision Support.</p>
					<hr />
  					<p>In here you can get a bird-eye view of the proposed refactorings and, more importantly, decide which ones best suit your needs. As a first step, you are encouraged to gather all the suggestions produced from the rest of the analysis tooolboxes. This will give you a unified picture of the trade-offs between each refactoring. When ready, proceed with pressing the below button!</p>
  					<a class="btn btn-primary btn-lg"  type="button" disabled={props.butt} onClick={() => {props.handleClick ()}}>Retrieve Refactorings</a>
					<Loader/>
				</React.Fragment>
			)
		}
	}
}

function ForecastPanel (props) {
	if (!props.ready) {
		return (
			<React.Fragment>
				<h2 class="display-4">Not yet ready</h2>
  				<p class="lead">Please complete the actions above first.</p>
			</React.Fragment>
		)
	} else {
			return (	
			<React.Fragment>
             <h2 class="display-4">What about the future?</h2>
             <p class="lead">Take the SDK4ED Forecaster into consideration.</p>
             <hr />
             <p>The above values are with regard to the current version of your project. It would be useful to consolidate them with the predictions that the SDK4ED Forecaster provides about the fluctuations of each code quality in the upcoming versions. Hence your decision making will be as fully-informed as possible.</p>
				<MDBRow className="mb-4">
				 <MDBCol md="12" lg="6" className="mb-12">
                <MDBCard className="mb-12">
                <MDBCardHeader className="sdk4ed-color">Forecasting Algorithm</MDBCardHeader>
                <MDBCardBody>
                    <MDBFormInline className="md-form m-0">
                        <MDBDropdown>
                            <MDBDropdownToggle caret className="white-text" color="  light-green darken-4">
                                Algorithm
                            </MDBDropdownToggle>
                            <MDBDropdownMenu basic>
                                <MDBDropdownItem onClick={(param) => props.updateForecasterInput('mlr',undefined)}>MLR</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecasterInput('lasso',undefined)}>Lasso</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecasterInput('ridge',undefined)}>Ridge</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecasterInput('svr_linear',undefined)}>SVR(linear)</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecasterInput('svr_rbf',undefined)}>SVR(rbf)</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecasterInput('random_forest',undefined)}>Random Forest</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecasterInput('arima',undefined)}>ARIMA</MDBDropdownItem>
                                <MDBDropdownItem divider />
                                <MDBDropdownItem onClick={(param) => props.updateForecasterInput('auto',undefined)}>Auto</MDBDropdownItem>
                            </MDBDropdownMenu>
                        </MDBDropdown>
                        <h4 style={{color:'#548235'}}>{props.my_current_algorithm}</h4>
                    </MDBFormInline>
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
            <MDBCol md="12" lg="6" className="mb-12">
                <MDBCard className="mb-12">
                <MDBCardHeader className="sdk4ed-color">Forecasting Horizon</MDBCardHeader>
                <MDBCardBody>
                    <MDBFormInline className="md-form m-0">
                        <MDBDropdown>
                            <MDBDropdownToggle caret className="white-text" color="  light-green darken-4">
                                Horizon
                            </MDBDropdownToggle>
                            <MDBDropdownMenu basic>
                                <MDBDropdownItem onClick={(param) => props.updateForecasterInput(undefined,'1')}>1 version</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecasterInput(undefined,'5')}>5 versions</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecasterInput(undefined,'10')}>10 versions</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecasterInput(undefined,'15')}>15 versions</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecasterInput(undefined,'20')}>20 versions</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecasterInput(undefined,'25')}>25 versions</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecasterInput(undefined,'30')}>30 versions</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecasterInput(undefined,'35')}>35 versions</MDBDropdownItem>
                                <MDBDropdownItem onClick={(param) => props.updateForecasterInput(undefined,'40')}>40 versions</MDBDropdownItem>
                            </MDBDropdownMenu>
                        </MDBDropdown>
                        <h4 style={{color:'#548235'}}>{props.my_current_horizon}</h4>
                    </MDBFormInline>
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
			</MDBRow>
				<button class="btn btn-primary btn-lg"  type="button" onClick={() => {props.triggerBeast ()}} disabled={props.invoked}>Retrieve forecasts</button>
         </React.Fragment>
			);
	}
}

function ForecastRes (props) {
	if ((!props.invoked) & (!props.gathered)) {
		return null
	} else if (!props.gathered) {
		return <Loader/>;
	} else {
		var QualReg = {
    		title: {
        		text: 'Forecasted Evolution of Code Qualities'
    		},
    		subtitle: {
        		text: 'Source: SDK4ED Forecasting Toolbox'
    		},
    		yAxis: {
        		title: {
            	text: 'Future-to-current ratio'
        		}
    		},
    		xAxis: {
        		accessibility: {
            	rangeDescription: 'Range: ' + props.hor + ' next versions.'
        		},
				title: {
					text: 'Versions from now'
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
    		series: props.qualReg,
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
		var RefReg = {
    		title: {
        		text: 'Refactoring Values Projected in the Future'
    		},
    		subtitle: {
        		text: 'Higher is better'
    		},
    		yAxis: {
        		title: {
            	text: 'Horizon-dependent overall value'
        		}
    		},
    		xAxis: {
        		accessibility: {
            	rangeDescription: 'Range: ' + props.hor + ' next versions.'
        		},
				title: {
					text: 'Versions from now'
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
    		series: props.refReg,
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
                     <MDBCardHeader className="sdk4ed-color">Qualities Forecasting</MDBCardHeader>
                     <MDBCardBody>
                        <HighchartsReact highcharts={Highcharts} options={QualReg} immutable = {true} />
                     </MDBCardBody>
                  </MDBCard>
            </MDBCol>
				<MDBCol md="6" lg="6" className="mb-12">
                  <MDBCard className="mb-12">
                     <MDBCardHeader className="sdk4ed-color">Corresponding Refactoring Values</MDBCardHeader>
                     <MDBCardBody>
                        <HighchartsReact highcharts={Highcharts} options={RefReg} immutable = {true} />
                     </MDBCardBody>
                  </MDBCard>
            </MDBCol>
			</MDBRow>
		</React.Fragment>
	  )
	}
}

function findMyDpi () {
	var base = 70
	while (!window.matchMedia ("(resolution: " + base.toString(10) + "dpi)").matches) {
		base = base + 1
	}
	var w = 0.77 * window.innerWidth / (3 * classNum)
	return w
}

const secret = findMyDpi ()

function consFc (overall, chunk, qual, mcdm, currVal, hor) {
  var ln = Object.keys (chunk).length
  if (ln < 3) {
    alert ('Forecaster received invalid input! Some qualities will not be projected . . .')
    var fores = []
    for (let i = 0; i < hor; i++) {
      fores.push ({value: currVal})
    }
  }
  else {
    var fores = chunk.results.forecasts
  }
	var pop = Object.keys (fores).length
	var data = [1]
	var indvals = mcdm.series
	var refReg = []
	var mult = []
	if (qual == 'Energy') {
		var qualReg = [{name: 'Energy'}]
		for (let key in fores) {
			data.push (currVal / fores[key].value)
			mult.push (1 / (currVal / fores[key].value))
		}
		qualReg[0].data = data
	} else if (qual == 'TD') {
		var qualReg = overall[0]
		qualReg.push ({name: 'Technical Debt'})
		for (let key in fores) {
			data.push (currVal / fores[key].value)
			mult.push (1 / (currVal / fores[key].value))
		}
		qualReg[1].data = data
	} else {
		var qualReg = overall[0]
		qualReg.push ({name: 'Security'})
		for (let key in fores) {
			data.push (currVal / fores[key].value)
			mult.push (1 / (currVal / fores[key].value))
		}
		qualReg[2].data = data
		overall.push (mult)
		for (let i = 0; i < mcdm.cats.length; i++) {
			var valsReg = [mcdm.seriesTotal[0].data[i]]
			for (let j = 0; j < pop; j++) {
				valsReg.push (indvals[0].data[i] * overall[2][j] + indvals[1].data[i] * overall[3][j] + indvals[2].data[i] * overall[4][j])
			}
			refReg.push ({name: mcdm.cats[i], data: valsReg})
		}
		overall[0] = qualReg
		overall[1] = refReg

		return overall
	}
	overall[0] = qualReg
	overall[1] = refReg
	overall.push (mult)

	return overall
}

class DecSupp extends React.Component {
	constructor (props) {
		super (props);
		this.state = {
			alertAcknowledged: false,
			buttPressed: false,
			refsList: [],
			datAll: [],
			media: findMyDpi (),
			mcdm: {
				best: {
					energy: false,
					td: false,
					sec: false
				},
				worst: {
					energy: false,
					td: false,
					sec: false,
				},
				bw: null,
				bj: null,
				jw: null,
				sc: null,
			},
			clarity: false,
			readyForCols: false,
			mcdmDatAll: [],
			fcData: [],
			current_algorithm: 'mlr',
			current_horizon: '5',
			current_values: {
				Energy: 1e-6,
				TD: 1500,
				Security: 0.3,
			}
		}
	}
	
	mcdmInAction (cat, pressed) {
			var cop = this.state.mcdm
			if (cat === 'best' || cat === 'worst') {
				if (pressed === 'energy') {
					cop[cat]['energy'] = true
					cop[cat]['td'] = false
					cop[cat]['sec'] = false
				} else if (pressed === 'td') {
					cop[cat]['energy'] = false
					cop[cat]['td'] = true
					cop[cat]['sec'] = false
				} else {
					cop[cat]['energy'] = false
					cop[cat]['td'] = false
					cop[cat]['sec'] = true
				}
			} else {
				cop[cat] = pressed
			}
			var subcop = doorMan(cop)
			this.setState ({
				mcdm: cop,
				clarity: subcop,
			});
	}

	hClick () {
		this.setState ({	
			alertAcknowledged: true,
		});
	}
	
	statesMan (refCopy, dat) {
		this.setState ({
			refsList: refCopy,
			datAll: dat,
		});
	}

	refsRequest ()  {
		this.setState ({
			buttPressed: true,
		})
		gatherRefactorings ((refCopy, dat) => {
			this.statesMan (refCopy, dat)
		}, (cv, vn) => {this.currValMan (cv, vn)});
	}

	currValMan (val, name) {
		var clone = this.state.current_values
		if (name == 'Energy') {
			clone.Energy = val
		} else if (name == 'Security') {
			clone.Security = val
		} else {
			clone.TD = val
		}
		this.setState ({current_values: clone})
	}

	getFc () {
		var obj = sessionStorage.getItem('selected_project')
		var mag = JSON.parse (obj)
    if (mag.name.includes ("rasmus")) {
      var refAPI_4_1 = "neurasmus"
      var refAPI_4_2 = "imd_technical_debt"
      var refAPI_4_3 = "sdk4ed-healthcare-use-case"
    }
    else if (mag.name.includes ("lisun")) {
      var refAPI_4_1 = "holisun"
      var refAPI_4_2 = "holisun"
      var refAPI_4_3 = "holisun"
    }
    else {
      var refAPI_4_1 = mag.endpoint.split ("/")
      var refAPI_4_2 = refAPI_4_1[refAPI_4_1.length - 1]
      var refAPI_4_3 = mag.username + ":" + refAPI_4_2
      refAPI_4_1 = refAPI_4_2
      refAPI_4_2 = refAPI_4_3
    }
    this.setState ({
         gathered: false,
			gatherer_invoked: true,
		})
				fetch (process.env.REACT_APP_FORECASTING_TOOL_SERVER_IP + "/ForecasterToolbox/EnergyForecasting?horizon=" + this.state.current_horizon + "&project=" + refAPI_4_1 + "&regressor=" + this.state.current_algorithm + "&ground_truth=no&test=no")
               .then (response => response.json ())
               .then (data => {
							var locFc = consFc ([], data, 'Energy', this.state.mcdmDatAll, this.state.current_values.Energy, this.state.current_horizon)
					fetch (process.env.REACT_APP_FORECASTING_TOOL_SERVER_IP + "/ForecasterToolbox/TDForecasting?horizon=" + this.state.current_horizon + "&project=" + refAPI_4_2 + "&regressor=" + this.state.current_algorithm + "&ground_truth=no&test=no")
               	.then (response => response.json ())
               	.then (data => {
							locFc = consFc (locFc, data, 'TD', this.state.mcdmDatAll, this.state.current_values.TD, this.state.current_horizon)
						fetch (process.env.REACT_APP_FORECASTING_TOOL_SERVER_IP + "/ForecasterToolbox/DependabilityForecasting?horizon=" + this.state.current_horizon + "&project=" + refAPI_4_3 + "&regressor=" + this.state.current_algorithm + "&ground_truth=no&test=no")
               		.then (response => response.json ())
               		.then (data => {
								locFc = consFc (locFc, data, 'Security', this.state.mcdmDatAll, this.state.current_values.Security, this.state.current_horizon)
								this.setState ({
									gatherer_invoked: false,
									gathered: true,
									fcData: locFc
								})
            			})
            		})
					})
   }

	    // Update forecasts
    updateForecasterInput = (new_algorithm, new_horizon) => {
        const {current_algorithm, current_horizon } = this.state
        if(new_algorithm === undefined){new_algorithm = current_algorithm}
        if(new_horizon === undefined){new_horizon = current_horizon}
			this.setState ({
				current_algorithm: new_algorithm,
				current_horizon: new_horizon
			})
    }


	render () {
		return (	
			<div className = "decsupp">
				<div classname = "introalert">
					<Alert 
						handleClick = {() => {this.hClick ()}}
						permit = {this.state.alertAcknowledged}
					/>
				</div>
				<div class = "jumbotron">
					<RefButt
						handleClick = {() => {this.refsRequest ()}}
						refs = {this.state.refsList}
						butt = {this.state.buttPressed}
					/>
				</div>
				<div className = "energyVtd">
					<VectRefVizPanel
						refLen = {this.state.refsList.length}
						data12 = {this.state.datAll[0]}
						data23 = {this.state.datAll[1]}
						data13 = {this.state.datAll[2]}
					/>
				</div>
				<div class="jumbotron">
					<MCDMWelcome
						refLen = {this.state.refsList.length}
            	/>
					<MCDMInputs
						mcdmInfo = {this.state.mcdm}
						refLen = {this.state.refsList.length}
						handleIn = {(a, b) => {this.mcdmInAction (a, b)}}
						isClear = {this.state.clarity}
						triggerBeast = {() => {
								fetch (mcdmEndp, {
									method: 'POST',
									headers: {
										'Content-Type': 'text/plain',
									},
									body: JSON.stringify ({
										prefs: this.state.mcdm,
										refs: this.state.refsList,
									}),
								})
								.then(response => response.json())
								.then(data => {
                  if (data.CR >= 0.1) {
                    alert (`Inconsistent comparisons! Consistency Ratio is ${data.CR}. Decision making is unreliable if this value is equal or greater than 0.1. Please check whether any of your preferences do not make sense, and try again.`)
                  }
									this.setState ({
										readyForCols: true,
										mcdmDatAll: data,
									});
								});
							}
						}
					/>
				</div>
				<div className = "bigPicture">
					<StackedColsPanel
						refLen = {this.state.readyForCols}
						mcdmDat = {this.state.mcdmDatAll}
					/>
				</div>
				<div class = "jumbotron">
					<ForecastPanel
						ready = {this.state.readyForCols}
						invoked = {this.state.gatherer_invoked}
						updateForecasterInput = {(a, h) => {this.updateForecasterInput (a, h)}}
						triggerBeast = {() => {
							this.getFc ()}}
						my_current_horizon = {this.state.current_horizon}
						my_current_algorithm = {this.state.current_algorithm}
					/>
				</div>
				<div className = "finres">
					<ForecastRes
						invoked = {this.state.gatherer_invoked}
						gathered = {this.state.gathered}
						qualReg = {this.state.fcData[0]}
						refReg = {this.state.fcData[1]}
						hor = {this.state.current_horizon}
					/>
				</div>
			</div>
		);
	}		
}

export default DecSupp;	
