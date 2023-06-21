import React, { Component } from "react";
import {
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBBtn,
  MDBIcon,
  MDBCardHeader,
  MDBFormInline,
  MDBDataTable,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBInput,
} from "mdbreact";
import Loader from "./sections/Loading";
//============== Import Highcharts ==============//
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// class ProjectItem extends Component {
//   render() {
//     const { project } = this.props;
//     return (
//       <MDBDropdownItem
//         key={project.kee}
//         onClick={() => this.props.onProjectSelection(project)}
//       >
//         {project.name}
//       </MDBDropdownItem>
//     );
//   }
// }

class IssuesTracker extends Component {
  state = {
    isLoading: true,
    issuesCollection: undefined,
  };

  async componentDidMount() {
    if (sessionStorage.getItem("selected_project") !== null) {
      let storedProject = sessionStorage.getItem("selected_project");
      let storedProjectJson = JSON.parse(storedProject);

      /* let rq = "";
      if (storedProjectJson["technicaldebt"] !== "") {
        let tdInfo = JSON.parse(storedProjectJson["technicaldebt"]);
        if ("jiraURL" in tdInfo && "jiraKey" in tdInfo) {
          rq += "?url=" + tdInfo["jiraURL"] + "&key=" + tdInfo["jiraKey"];
          if ("jiraUsername" in tdInfo && "jiraParssword" in tdInfo) {
            rq +=
              "&username=" +
              tdInfo["jiraUsername"] +
              "&password=" +
              tdInfo["jiraParssword"];
          }

          this.setState({ isLoading: true });

          try {
            const response = await fetch(
              "http://195.251.210.147:8989/api/jira/issues" + rq,
              {
                method: "GET", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, cors, *same-origin
                //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                //credentials: 'include', // include, *same-origin, omit
                // headers: new Headers({ Authorization: key })
              }
            );
            if (!response.ok) {
              throw Error(response.statusText);
            }
            const data = await response.json();
            this.setState({ isLoading: false, issuesCollection: data });
          } catch (error) {
            console.log(error);
          }
        }
        else if ("redmineURL" in tdInfo && "redmineProject" in tdInfo) {
          rq += "?url=" + tdInfo["redmineURL"] + "&project=" + tdInfo["redmineProject"];
          if ("redmineUsername" in tdInfo && "redmineParssword" in tdInfo) {
            rq +=
              "&username=" +
              tdInfo["redmineUsername"] +
              "&password=" +
              tdInfo["redmineParssword"];
          }

          this.setState({ isLoading: true });

          try {
            const response = await fetch(
              "http://195.251.210.147:8989/api/redmine/issues" + rq,
              {
                method: "GET", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, cors, *same-origin
                //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                //credentials: 'include', // include, *same-origin, omit
                // headers: new Headers({ Authorization: key })
              }
            );
            if (!response.ok) {
              throw Error(response.statusText);
            }
            const data = await response.json();
            this.setState({ isLoading: false, issuesCollection: data });
          } catch (error) {
            console.log(error);
          }
        }
        else {
          this.setState({
            isError: true,
          });
        }
      } else {
        this.setState({
          isError: true,
        });
      } */
    }
  }

  // async componentDidUpdate(prevProps) {
  //   if (
  //     this.props.project !== undefined &&
  //     this.props.project.kee.trim() !== "" &&
  //     prevProps.project.kee !== this.props.project.kee
  //   ) {
  //     this.setState({ isLoading: true });

  //     try {
  //       const response = await fetch(
  //         "http://195.251.210.147:8989/api/jira/issues/" +
  //           this.props.project.kee,
  //         {
  //           method: "GET", // *GET, POST, PUT, DELETE, etc.
  //           mode: "cors", // no-cors, cors, *same-origin
  //         }
  //       );
  //       if (!response.ok) {
  //         throw Error(response.statusText);
  //       }
  //       const data = await response.json();
  //       this.setState({ isLoading: false, issuesCollection: data });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // }

  render() {
    const { issuesCollection, isLoading, isError } = this.state;

    const columns = [
      { label: "Key", field: "key", sort: "asc", width: 15 },
      { label: "Summary", field: "summary" },
      { label: "Priority", field: "priority" },
      { label: "Status", field: "status" },
      { label: "Created At", field: "created" },
    ];

    let rows = [];

    if (issuesCollection) {
      issuesCollection.map((ic) =>
        rows.push({
          // key: ic.key,
          key: (
            <a href={ic.issueLink} target="_blank">
              {ic.key}
            </a>
          ),
          summary: ic.summary,
          priority: ic.priorityName,
          status: decodeURI(ic.status),
          created: ic.created.replace("T", " ").replace(/\..*/g, ""),
        })
      );
    }

    var data = {
      columns: columns,
      rows: rows,
    };

    let cardBody = null;
    if (issuesCollection && issuesCollection.length !== 0) {
      cardBody = (
        <MDBDataTable striped small bordered responsive hover data={data} />
      );
    } else {
      cardBody = <div>Either there are no Issues</div>;
    }

    return (
      <MDBRow className="mb-4">
        <MDBCol md="12" lg="12" className="mb-12">
          <MDBCard className="mb-12">
            <MDBCardHeader className="sdk4ed-color">Issue Tracker</MDBCardHeader>
            <MDBCardBody>
              {isError ? (
                <React.Fragment>
                  <div>
                    Please specify a Jira or Redmine Issue Tracker, on the Extra info for
                    Technical Debt Toolbox, using the following format:
                    <MDBFormInline className="md-form m-0">
                      <MDBCol md="12" lg="5" className="mb-12">
                        <pre>
                          <code>
                            {"\n{\n"}
                            {"\t"}...{"\n"}
                            {"\t"}"jiraURL":"https://jira.sdk4ed.digkas.nl",{"\n"}
                            {"\t"}"jiraKey":"TEST",{"\n"}
                            {"\t"}"jiraUsername":"sdk4ed", (optional){"\n"}
                            {"\t"}"jiraParssword":"sdk4ed" (optional){"\n"}
                            {"}"}
                          </code>
                        </pre>
                      </MDBCol>
                      <MDBCol md="12" lg="2" className="mb-12">
                        <div>or</div>
                      </MDBCol>
                      <MDBCol md="12" lg="5" className="mb-12">
                        <pre>
                          <code>
                            {"\n{\n"}
                            {"\t"}...{"\n"}
                            {"\t"}"redmineURL":"https://redmine.sdk4ed.digkas.nl",{"\n"}
                            {"\t"}"redmineProject":"sdk4ed",{"\n"}
                            {"\t"}"redmineUsername":"sdk4ed", (optional){"\n"}
                            {"\t"}"redmineParssword":"sdk4edde4kds" (optional){"\n"}
                            {"}"}
                          </code>
                        </pre>
                      </MDBCol>
                    </MDBFormInline>
                  </div>
                </React.Fragment>
              ) : (
                  <React.Fragment>
                    {isLoading ? <Loader /> : cardBody}
                  </React.Fragment>
                )}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    );
  }
}

const ProjectItem = ({ project, onProjectSelection }) => {
  return (
    <MDBDropdownItem
      key={project.kee}
      onClick={() => onProjectSelection(project)}
    >
      {project.name}
    </MDBDropdownItem>
  );
};

class ProjectsDropdown extends Component {
  render() {
    const {
      // areProjectsLoading,
      project,
      projects,
      onProjectSelection,
    } = this.props;

    // if (areProjectsLoading) {
    //   return <Loader />;
    // }

    return (
      <React.Fragment>
        <h3 style={{ color: "#548235" }}>Project: </h3>
        <MDBDropdown>
          <MDBDropdownToggle
            caret
            className="white-text"
            color="  light-green darken-4"
          >
            {project.name}
          </MDBDropdownToggle>
          <MDBDropdownMenu basic>
            {projects.map((project) => (
              <ProjectItem
                key={project.kee}
                onProjectSelection={onProjectSelection}
                project={project}
              />
            ))}
          </MDBDropdownMenu>
        </MDBDropdown>
      </React.Fragment>
    );
  }
}

class TecnicalDebtDensityOverTime extends Component {
  state = {
    isLoading: true,
    data: null,
  };

  async componentDidUpdate(prevProps) {
    if (
      this.props.project !== undefined &&
      this.props.project.kee &&
      this.props.project.kee.trim() !== "" &&
      prevProps.project.kee !== this.props.project.kee
    ) {
      this.setState({ isLoading: true });

      try {
        const response = await fetch(
          "http://195.251.210.147:8989/api/sdk4ed/nc/tddot/" +
          this.props.project.kee,
          {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'include', // include, *same-origin, omit
            // headers: new Headers({ Authorization: key })
          }
        );
        if (!response.ok) {
          throw Error(response.statusText);
        }
        const data = await response.json();
        this.setState({ isLoading: false, data: data });
      } catch (error) {
        console.log(error);
      }
    }
  }

  getChartOptions() {
    return {
      chart: {
        zoomType: "x",
      },
      title: {
        text: "Technical Debt Density over time",
      },
      pane: {
        size: "90%",
      },
      subtitle: {
        text:
          document.ontouchstart === undefined
            ? "Click and drag in the plot area to zoom in"
            : "Pinch the chart to zoom in",
      },
      xAxis: {
        type: "datetime",
        lineWidth: 0,
      },
      yAxis: {
        title: {
          text: "Technical Debt Density",
        },
        lineWidth: 0,
      },
      legend: {
        enabled: false,
      },

      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              [
                1,
                Highcharts.Color(Highcharts.getOptions().colors[0])
                  .setOpacity(0)
                  .get("rgba"),
              ],
            ],
          },

          marker: {
            radius: 2,
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1,
            },
          },
          threshold: null,
        },
        scatter: {
          tooltip: {
            // headerFormat: "<b>{series.name}</b><br>",
            pointFormat: "Technical Debt Density: {point.y} Minutes/LOC",
          },
        },
      },

      series: [
        {
          type: "area",
          name: "Technical Debt Density",
          data: this.state.data,
        },
        {
          type: "scatter",
          name: "Quality Gate",
          data: this.props.qgData,
        },
      ],
    };
  }

  render() {
    const options = this.getChartOptions();
    const { isLoading } = this.state;

    return (
      <MDBRow className="mb-4">
        <MDBCol md="12" lg="12" className="mb-12">
          <MDBCard className="mb-12">
            <MDBCardHeader className="sdk4ed-color">
              Technical Debt Density Over Time
            </MDBCardHeader>
            <MDBCardBody>
              <MDBRow className="mb-6">
                <MDBCol
                  // size="8"
                  className="m-3"
                >
                  {isLoading ? (
                    <Loader />
                  ) : (
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                      />
                    )}
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    );
  }
}

class BranchCommits extends Component {
  getQualityGateAnalysisMDBBtnClasses() {
    return this.props.qualityGateRunning ? " disabled" : "";
  }

  render() {
    const {
      // QGloading,
      branch,
      sha,
      branchCommits,
      onBranchSelection,
      onSHASelection,
      onQualityGateAnalysis,
    } = this.props;

    return (
      // <React.Fragment>
      //   {QGloading ? (
      //     <Loader />
      //   ) : (
      <React.Fragment>
        <h3 style={{ color: "#548235" }}>Branch: </h3>
        <MDBDropdown>
          <MDBDropdownToggle
            caret
            className="white-text"
            color="  light-green darken-4"
          >
            {branch}
          </MDBDropdownToggle>
          <MDBDropdownMenu basic className="force-scroll-branches">
            {branchCommits.map((bc) => (
              <MDBDropdownItem
                key={bc.branch}
                onClick={() => onBranchSelection(bc.branch)}
              >
                {bc.branch}
              </MDBDropdownItem>
            ))}
          </MDBDropdownMenu>
        </MDBDropdown>
        <h3 style={{ color: "#548235" }}>Commit: </h3>
        <MDBDropdown>
          <MDBDropdownToggle
            caret
            className="white-text"
            color="  light-green darken-4"
          >
            {sha}
          </MDBDropdownToggle>
          <MDBDropdownMenu basic className="force-scroll-commits">
            {this.props.branchCommits
              .filter((bc) => bc.branch === this.props.branch)
              .map((bc) =>
                bc.commits.map((c) => (
                  <MDBDropdownItem key={c} onClick={() => onSHASelection(c)}>
                    {c}
                  </MDBDropdownItem>
                ))
              )}
          </MDBDropdownMenu>
        </MDBDropdown>
        {/* <MDBTooltip placement="top"> */}
        <MDBBtn
          onClick={() => onQualityGateAnalysis()}
          className={"white-text" + this.getQualityGateAnalysisMDBBtnClasses()}
          color="  light-green darken-4"
        >
          <MDBIcon icon="compress-alt" className="mr-1" size="lg" />
          Quality Gate
        </MDBBtn>
        {/* <div>Perform Quality Gate Analysis</div>
        </MDBTooltip> */}
      </React.Fragment>
      //   )}
      // </React.Fragment>
    );
  }
}

class IntroducedNewIssues extends Component {
  state = {
    isLoading: true,
    ini: [],
    modals: [],
  };

  async componentDidUpdate(prevProps) {
    if (
      this.props.project !== undefined &&
      this.props.project.kee &&
      this.props.project.kee.trim() !== "" &&
      prevProps.project.kee !== this.props.project.kee
    ) {
      this.setState({ isLoading: true });

      try {
        const response = await fetch(
          "http://195.251.210.147:8989/api/sdk4ed/nc/introducedNewIssues/" +
          this.props.project.kee,
          // +"?amount=30",
          {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'include', // include, *same-origin, omit
            // headers: new Headers({ Authorization: key })
          }
        );
        if (!response.ok) {
          throw Error(response.statusText);
        }
        const ini = await response.json();
        let modals = [];
        ini.map((ii) =>
          modals.push({
            id: ii.rank,
            modal: false,
          })
        );
        this.setState({ isLoading: false, ini, modals });
      } catch (error) {
        console.log(error);
      }
    }
  }

  toggle = (nr) => () => {
    const modals = [...this.state.modals];
    modals[nr].modal = !modals[nr].modal;
    this.setState({ modals });
  };

  render() {
    const { isLoading, ini } = this.state;

    const columns = [
      { label: "Rank", field: "rank", sort: "asc", width: 15 },
      { label: "Rule", field: "rule" },
      // { label: "Description", field: "description" },
      { label: "Language", field: "language" },
      { label: "Count", field: "count" },
    ];

    let r = [];

    ini.map((ii) =>
      r.push({
        rank: ii.rank,
        rule: [
          <div key={ii.rank}>
            <div onClick={this.toggle(ii.rank - 1)}>
              <u>{ii.rule}</u>
            </div>
            <MDBModal
              isOpen={this.state.modals[ii.rank - 1].modal}
              toggle={this.toggle(ii.rank - 1)}
            >
              <MDBModalHeader toggle={this.toggle(ii.rank - 1)}>
                {ii.rule}
                {/* <div style={{textDecorationLine: "underline"}}>{ii.rule}</div> */}
              </MDBModalHeader>
              <MDBModalBody>
                <div
                  dangerouslySetInnerHTML={{
                    __html: ii.description,
                  }}
                />
              </MDBModalBody>
              <MDBModalFooter>
                Rule Description Retrieved from&nbsp;
                <a href="https://www.sonarqube.org/" target="_blank">
                  SonarQube
                </a>
              </MDBModalFooter>
            </MDBModal>
          </div>,
        ],
        language: ii.language,
        count: ii.count,
      })
    );

    var data = {
      columns: columns,
      rows: r,
    };

    return (
      <MDBRow className="mb-4">
        <MDBCol md="12" lg="12" className="mb-12">
          <MDBCard className="mb-12">
            {/* <MDBCardHeader className="sdk4ed-color">Technical Debt Issues Introduced On New Methods (Last Month)</MDBCardHeader> */}
            <MDBCardHeader className="sdk4ed-color">
              New Technical Debt Issues Introduced (Last Month)
            </MDBCardHeader>
            <MDBCardBody>
              {isLoading ? (
                <Loader />
              ) : (
                  <React.Fragment>
                    {data.rows.length === 0 ? (
                      // <div>No Technical Debt Issues Introduced On New Methods In The Last Month</div>
                      <div>
                        No New Technical Debt Issues Introduced In The Last Month
                      </div>
                    ) : (
                        <MDBDataTable
                          striped
                          small
                          bordered
                          responsive
                          hover
                          data={data}
                        />
                      )}
                  </React.Fragment>
                )}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    );
  }
}

{
  /* *************************************** QG *************************************** */
}
class QualityGate extends Component {
  render() {
    const {
      qgExecution,
      qualityGateRunning,
      qgComponents,
      qgModals,
      onToggleQualityGateModal,
    } = this.props;

    const columns = [
      { label: "Component", field: "component", sort: "asc", width: 15 },
      { label: "Classifier", field: "classifier" },
      { label: "Contribution %", field: "contribution" },
    ];

    let rows = [];
    let i = 0;

    qgComponents.map((qg) =>
      rows.push({
        // method: i.path + "::" + i.method,
        component: [
          <div key={i}>
            <div onClick={onToggleQualityGateModal(i)}>
              {/* <u>{qg.filePath + " :: " + qg.methodName}</u> */}
              <u>
                {qg.methodName
                  ? qg.filePath + " :: " + qg.methodName
                  : qg.filePath}
              </u>
            </div>
            <MDBModal
              isOpen={qgModals[i].modal}
              toggle={onToggleQualityGateModal(i)}
            >
              <MDBModalHeader toggle={onToggleQualityGateModal(i++)}>
                {qg.methodName
                  ? qg.filePath + " :: " + qg.methodName
                  : qg.filePath}
              </MDBModalHeader>
              <MDBModalBody>
                {qg.issues.length > 0 ? (
                  <MDBTable hover>
                    <caption>
                      Introduced Technical Debt Issues On Method
                    </caption>
                    <MDBTableHead>
                      <tr>
                        <th>Rule</th>
                        <th>Line</th>
                        <th>Effort</th>
                      </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                      {qg.issues.map((issue) => (
                        <tr key={issue.line}>
                          <td>{issue.rule}</td>
                          <td>{issue.line}</td>
                          <td>{issue.effort}</td>
                        </tr>
                      ))}
                    </MDBTableBody>
                  </MDBTable>
                ) : (
                    "No Technical Debt Issues were introduced"
                  )}
              </MDBModalBody>
              <MDBModalFooter>
                {/* Introduced Technical Debt Issues On Method */}
                Rule Description Retrieved from&nbsp;
                <a href="https://www.sonarqube.org/" target="_blank">
                  SonarQube
                </a>
              </MDBModalFooter>
            </MDBModal>
          </div>,
        ],
        classifier: qg.classifier,
        contribution: Number(qg.contribution.toFixed(3)),
      })
    );

    var data = {
      columns: columns,
      rows: rows,
    };

    return (
      <MDBRow className="mb-4">
        <MDBCol md="12" lg="12" className="mb-12">
          <MDBCard className="mb-12">
            <MDBCardHeader className="sdk4ed-color">
              Quality Gate Results: methods that contribute negatively to the
              Technical Debt Density
            </MDBCardHeader>
            <MDBCardBody>
              {qualityGateRunning ? (
                <Loader />
              ) : (
                  <React.Fragment>
                    {qgExecution === "FAILURE" ? (
                      <React.Fragment>
                        <div class="alert alert-danger" role="alert">
                          Quality Gate Failed! Possible reasons:
                        <ul>
                            <li>The Target Commit has Syntax Errors</li>
                            <li>
                              For Maven projects, please confirm that the pom.xml
                              exists on the Target Commit
                          </li>
                          </ul>
                        </div>
                      </React.Fragment>
                    ) : (
                        <React.Fragment>
                          {data.rows.length === 0 ? (
                            <div>
                              The Tecnical Debt Density of All Added/Modified
                              Methods was better than average. No methods are listed
                            </div>
                          ) : (
                              <MDBDataTable
                                striped
                                small
                                bordered
                                responsive
                                hover
                                data={data}
                              />
                            )}
                        </React.Fragment>
                      )}
                  </React.Fragment>
                )}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    );
  }
}

{
  /* *************************************** QG Java *************************************** */
}

{
  /* *************************************** QG C *************************************** */
}

/* *************************************** Create Project Form *************************************** */

// const ProjectItem = ({ project, onProjectSelection }) => {
//   return (
//     <MDBDropdownItem
//       key={project.kee}
//       onClick={() => onProjectSelection(project)}
//     >
//       {project.name}
//     </MDBDropdownItem>
//   );
// };

{
  /* <MDBRow className="mb-4">
  <MDBCol md="12" lg="12" className="mb-12">
    <MDBCard className="mb-12">
      <MDBCardHeader className="sdk4ed-color">
        Technical Debt Density Over Time
      </MDBCardHeader>
      <MDBCardBody>
        <MDBRow className="mb-6">
          <MDBCol
            // size="8"
            className="m-3"
          >
            {isLoading ? (
              <Loader />
            ) : (
              <HighchartsReact highcharts={Highcharts} options={options} />
            )}
          </MDBCol>
        </MDBRow>
      </MDBCardBody>
    </MDBCard>
  </MDBCol>
</MDBRow>; */
}

class CreateProjectForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gitURI: "",
      owner: "",
      repositoryName: "",
      token: "",
      password: "",
    };
  }

  formChangeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  formSubmitHandler = (e) => {
    e.preventDefault();
    console.log(this.state);
  };

  render() {
    const { gitURI, owner, repositoryName, token, password } = this.state;

    return (
      <MDBRow className="mb-4">
        <MDBCol md="12" lg="12" className="mb-12">
          <MDBCard className="mb-12">
            <MDBCardHeader className="sdk4ed-color">
              Create New Project
            </MDBCardHeader>
            <MDBCardBody>
              {/* <MDBRow className="mb-6">
              <MDBContainer>
                <MDBRow>
                  <MDBCol md="6"> */}
              <form onSubmit={this.formSubmitHandler}>
                <div className="grey-text">
                  <MDBInput
                    label="Git URI"
                    icon="link"
                    type="text"
                    name="gitURI"
                    value={gitURI}
                    onChange={this.formChangeHandler}
                  // group
                  // error="wrong"
                  // success="right"
                  />
                  <MDBInput
                    label="Owner"
                    icon="user"
                    type="text"
                    name="owner"
                    value={owner}
                    onChange={this.formChangeHandler}
                  // group
                  // error="wrong"
                  // success="right"
                  />
                  <MDBInput
                    label="Repository Name"
                    icon="project-diagram"
                    type="text"
                    name="repositoryName"
                    value={repositoryName}
                    onChange={this.formChangeHandler}
                  // group
                  // error="wrong"
                  // success="right"
                  />
                  <br />
                  <MDBInput
                    label="Token"
                    icon="key"
                    type="text"
                    name="token"
                    value={token}
                    onChange={this.formChangeHandler}
                  // group
                  // error="wrong"
                  // success="right"
                  />
                  OR
                  <MDBInput
                    label="Password"
                    icon="lock"
                    type="text"
                    name="password"
                    value={password}
                    onChange={this.formChangeHandler}
                  // group
                  // type="password"
                  // validate
                  />
                </div>
                <div className="text-center">
                  <MDBBtn type="submit">create</MDBBtn>
                </div>
              </form>
              {/* </MDBCol>
                </MDBRow>
              </MDBContainer>
            </MDBRow> */}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    );
  }
}

// class CreateProjectForm extends Component {
//   render() {
//     return (
//       <form>
//         <h1>Hello</h1>
//         <p>Enter your name:</p>
//         <input
//           type="text"
//         />
//       </form>
//     );
//   }
// }

class TDNewCodeDashPage extends Component {
  state = {
    // areProjectsLoading: true,
    // projects: [],
    project: {},

    testLoading: false,
    qualityGateRunning: false,

    branchCommits: [],
    branch: "",
    sha: "",

    showQualityGate: false,
    qualityGateRunning: false,
    qgData: null,
    qgComponents: [],
    qgExecution: null,

    projectPendingAnalyses: null,

    isError: false,
    error: {},

    cancelHistoricalAnalysisEnabled: true,
    pendingHistoricalAnalyses: [],
  };

  async componentDidMount() {
    if (sessionStorage.getItem("selected_project") === null) {
      this.setState({
        error: {
          message:
            'No project selected. Please select a project from the "Projects" panel and retry.',
        },
        errorMessage:
          'No project selected. Please select a project from the "Projects" panel and retry.',
        // isLoadingProject: false,
        isError: true,
      });
    } else {
      var selectedProjectSession = JSON.parse(
        sessionStorage.getItem("selected_project")
      );

      try {
        const response = await fetch(
          "http://195.251.210.147:8989/api/sdk4ed/project/findByUri?uri=" +
          selectedProjectSession["endpoint"],
          {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'include', // include, *same-origin, omit
            // headers: new Headers({ Authorization: key })
          }
        );
        if (!response.ok) {
          throw Error(response.statusText);
        }
        const body = await response.json();
        this.setState({
          // projects: body,
          // areProjectsLoading: false,
          // project: body[0],
          isError: false,
          project: body,
          projectPendingAnalyses: body.projectPendingAnalyses,
        });
      } catch (error) {
        console.log(error);
      }
    }

    // pendingHistoricalAnalyses
    // try {
    //   const response = await fetch(
    //     "http://195.251.210.147:8989/api/sdk4ed/pending-historical-analyses",
    //     {
    //       method: "GET",
    //       mode: "cors",
    //     }
    //   );
    //   if (!response.ok) {
    //     throw Error(response.statusText);
    //   }
    //   const body = await response.json();
    //   this.setState({
    //     pendingHistoricalAnalyses: body,
    //   });
    // } catch (error) {
    //   console.log(error);
    // }

    if (this.state.project.kee !== undefined) {
      try {
        const response = await fetch(
          // "http://195.251.210.147:8989/api/sdk4ed/nc/branchCommits/" +
          "http://195.251.210.147:8989/api/sdk4ed/branch-commits" +
          "?url=" +
          selectedProjectSession["endpoint"] +
          "&username=" +
          selectedProjectSession["username"] +
          "&password=" +
          selectedProjectSession["password"],
          {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'include', // include, *same-origin, omit
            // headers: new Headers({ Authorization: key })
          }
        );
        if (!response.ok) {
          throw Error(response.statusText);
        }
        const data = await response.json();
        this.setState({
          // QGloading: false,
          areProjectsLoading: false,
          branchCommits: data,
          branch: data[0].branch,
          sha: data[0].commits[0],
          // ,projectPendingAnalyses: data[0].projectPendingAnalyses
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  // async componentDidMount() {
  //   try {
  //     const response = await fetch(
  //       "http://195.251.210.147:8989/api/sdk4ed/nc/projects",
  //       {
  //         method: "GET", // *GET, POST, PUT, DELETE, etc.
  //         mode: "cors", // no-cors, cors, *same-origin
  //         //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  //         //credentials: 'include', // include, *same-origin, omit
  //         // headers: new Headers({ Authorization: key })
  //       }
  //     );
  //     if (!response.ok) {
  //       throw Error(response.statusText);
  //     }
  //     const body = await response.json();
  //     this.setState({
  //       projects: body,
  //       project: body[0],
  //       projectPendingAnalyses: body[0].projectPendingAnalyses,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   if (this.state.project.kee !== undefined) {
  //     try {
  //       const response = await fetch(
  //         "http://195.251.210.147:8989/api/sdk4ed/nc/branchCommits/" +
  //           this.state.project.kee,
  //         {
  //           method: "GET", // *GET, POST, PUT, DELETE, etc.
  //           mode: "cors", // no-cors, cors, *same-origin
  //           //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  //           //credentials: 'include', // include, *same-origin, omit
  //           // headers: new Headers({ Authorization: key })
  //         }
  //       );
  //       if (!response.ok) {
  //         throw Error(response.statusText);
  //       }
  //       const data = await response.json();
  //       this.setState({
  //         // QGloading: false,
  //         areProjectsLoading: false,
  //         branchCommits: data,
  //         branch: data[0].branch,
  //         sha: data[0].commits[0],
  //         // ,projectPendingAnalyses: data[0].projectPendingAnalyses
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // }

  async componentDidUpdate(prevProps, prevState) {
    console.log("prevState", prevState);
    if (prevState.project !== undefined) {
      console.log("prevState.project.kee", prevState.project.kee);
      console.log("this.state.project.kee", this.state.project.kee);
    }
    if (this.state.project.kee !== undefined)
      console.log(
        "this.state.project.kee !== undefined",
        this.state.project.kee
      );

    console.log(
      "1. this.state.project !== undefined",
      this.state.project !== undefined,
      this.state.project.kee
    );

    if (
      prevState.project !== undefined &&
      this.state.project !== undefined &&
      prevState.project.kee !== this.state.project.kee
    ) {
      // console.log("componentDidUpdate prevState", prevState.project.kee);
      console.log("componentDidUpdate state", this.state.project.kee);
      // console.log("1. this.state.project.kee !== undefined", (this.state.project.kee !== undefined))
      // console.log("2. ", (prevState.project.kee !== undefined &&
      //   prevState.project.kee !== this.state.project.kee))

      this.setState({
        // QGloading: true,
        areProjectsLoading: true,
        introducedIssuesOnNewMethodsLoading: true,
      });
      if (prevState.project !== undefined) {
        console.log(
          "2. prevState.project.kee !== undefined",
          prevState.project.kee !== undefined,
          prevState.project.kee
        );
        console.log(
          "3. prevState.project.kee !== this.state.project.kee",
          prevState.project.kee !== this.state.project.kee,
          prevState.project.kee,
          this.state.project.kee
        );
      }

      var selectedProjectSession = JSON.parse(
        sessionStorage.getItem("selected_project")
      );

      //*********************************************************** */
      try {
        const response = await fetch(
          // "http://195.251.210.147:8989/api/sdk4ed/nc/branchCommits/" +
          //   this.state.project.kee
          "http://195.251.210.147:8989/api/sdk4ed/branch-commits" +
          "?url=" +
          selectedProjectSession["endpoint"] +
          "&username=" +
          selectedProjectSession["username"] +
          "&password=" +
          selectedProjectSession["password"],
          {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'include', // include, *same-origin, omit
            // headers: new Headers({ Authorization: key })
          }
        );
        if (!response.ok) {
          throw Error(response.statusText);
        }
        const data = await response.json();
        this.setState({
          // QGloading: false,
          areProjectsLoading: false,
          branchCommits: data,
          branch: data[0].branch,
          sha: data[0].commits[0],
          // ,projectPendingAnalyses: data[0].projectPendingAnalyses
          // sha: data[0].commits[0].substring(0, 7)
        });
      } catch (error) {
        console.log(error);
      }
      //*********************************************************** */
    }
  }

  handleQualityGateAnalysis = () => {
    console.log("handleQualityGateAnalysis Clicked");
    this.setState({
      qgData: null,
      showQualityGate: true,
      qualityGateRunning: true,
    });

    try {
      fetch(
        "http://195.251.210.147:8989/api/sdk4ed/qg/" +
        // "test/" +
        this.state.project.kee +
        "/" +
        this.state.branch +
        "/" +
        this.state.sha,
        {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, cors, *same-origin
          //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          //credentials: 'include', // include, *same-origin, omit
          // headers: new Headers({ Authorization: key })
        }
      )
        .then((response) => response.json())
        .then((response) => {
          let modals = [];
          response.qgComponents.map((p) => modals.push({ modal: false }));
          this.setState({
            qgExecution: response.execution,
            qgData: response.qgData,
            qgComponents: response.qgComponents,
            qgModals: modals,
            qualityGateRunning: false,
          });
        });
    } catch (error) {
      console.log(error);
    }
    console.log("handleQualityGateAnalysis-qgModals ", this.state.qgModals);
  };

  handleProjectSelection = (project) => {
    this.setState({
      qgData: null,
      showQualityGate: false,
      project,
      projectPendingAnalyses: project.projectPendingAnalyses,
    });
  };

  cancelHistoricalAnalysis = () => {
    console.log("cancelHistoricalAnalysis clicked");
    this.setState({ cancelHistoricalAnalysisEnabled: false });

    try {
      fetch(
        "http://195.251.210.147:8989/api/sdk4ed/ha/cancel/" +
        this.state.project.kee,
        {
          method: "POST",
          mode: "cors",
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  handleHistoricalAnalysis = () => {
    console.log("handleHistoricalAnalysis clicked");
    this.setState({ projectPendingAnalyses: 9999 });

    let storedProject = sessionStorage.getItem("selected_project");
    let storedProjectJson = JSON.parse(storedProject);

    let usernameInfo = storedProjectJson["username"];
    let passwordInfo = storedProjectJson["password"];
    let urlInfo = storedProjectJson["endpoint"];

    let languageInfo = "";
    if (storedProjectJson["common"] !== "") {
      let commonInfo = JSON.parse(storedProjectJson["common"]);
      if ("language" in commonInfo) {
        languageInfo = commonInfo["language"];
      }
    }

    let tdBuildToolInfo = "";
    if (storedProjectJson["technicaldebt"] !== "") {
      let tdInfo = JSON.parse(storedProjectJson["technicaldebt"]);
      if ("buildTool" in tdInfo) {
        tdBuildToolInfo = tdInfo["buildTool"];
      }
    }

    try {
      fetch(
        "http://195.251.210.147:8989/api/sdk4ed/ha/analyze" +
        "?uri=" +
        urlInfo +
        "&language=" +
        languageInfo +
        "&buildTool=" +
        tdBuildToolInfo +
        "&gitUsername=" +
        usernameInfo +
        "&gitPassword=" +
        passwordInfo,
        {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, cors, *same-origin
          //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          //credentials: 'include', // include, *same-origin, omit
          // headers: new Headers({ Authorization: key })
        }
      );
      // .then(response => response.json())
      // .then(response => {
      //   let modals = [];
      //   response.qgMethods.map(p => modals.push({ modal: false }));
      //   this.setState({
      //     qgData: response.qgData,
      //     qgMethods: response.qgMethods,
      //     qgModals: modals,
      //     qualityGateRunning: false
      //   });
      // });
    } catch (error) {
      console.log(error);
    }
  };

  getHistoricalAnalysisMDBBtnClasses() {
    return this.state.projectPendingAnalyses > 0 ? " disabled" : "";
  }

  getCancelHistoricalAnalysisMDBBtnClasses() {
    return this.state.cancelHistoricalAnalysisEnabled ? "" : " disabled";
  }

  getpendingNumber() {
    return this.state.projectPendingAnalyses > 0 &&
      this.state.projectPendingAnalyses !== 9999
      ? " (" + this.state.projectPendingAnalyses + ")"
      : "";
  }

  getQualityGateMDBBtnClasses() {
    return this.state.qualityGateRunning ? " disabled" : "";
  }

  // showQualityGate = () => {
  //   this.setState({ showQG: true });
  // };

  handleBranchSelection = (branch) => {
    this.setState({ branch });
    this.updateSelectedSHA(branch);
  };

  updateSelectedSHA = (branch) => {
    let sha = this.state.branchCommits
      .filter((bc) => bc.branch === branch)
      .map((bc) => bc.commits[0]);
    this.setState({ sha });
  };

  handleSHASelection = (sha) => {
    this.setState({ sha });
  };

  toggleQualityGateModal = (nr) => () => {
    const qgModals = [...this.state.qgModals];
    qgModals[nr].modal = !qgModals[nr].modal;
    this.setState({ qgModals });
  };

  render() {
    const { isError, error, areProjectsLoading, showQualityGate } = this.state;
    return (
      <React.Fragment>
        {/* Pending Project Analyses */}
        {/* {this.state.pendingHistoricalAnalyses.length > 0 ? (
          <React.Fragment>
            <div class="alert alert-info" role="alert">
              Pending Project Analyses:
              <ul>
                {this.state.pendingHistoricalAnalyses.map((p) => (
                  <li>
                    <a href={p.url} target="_blank">
                      {p.name}
                    </a>
                    &nbsp;({p.projectPendingAnalyses})
                  </li>
                ))}
              </ul>
            </div>
          </React.Fragment>
        ) : null} */}

        <React.Fragment>
          {isError ? (
            <React.Fragment>
              <div class="alert alert-danger" role="alert">
                {error.message}
              </div>
            </React.Fragment>
          ) : (
              <React.Fragment>
                <MDBRow className="mb-4">
                  <MDBCol md="12" lg="12" className="mb-12">
                    <MDBCard className="mb-12">
                      <MDBCardHeader className="sdk4ed-color">
                        Projects
                    </MDBCardHeader>
                      <MDBCardBody>
                        {areProjectsLoading ? (
                          <MDBRow className="mb-6">
                            <MDBCol className="m-3">
                              <Loader />
                            </MDBCol>
                          </MDBRow>
                        ) : (
                            <React.Fragment>
                              <MDBFormInline className="md-form m-0">
                                {/* <ProjectsDropdown
                        key={"projectsDropdown"}
                        projects={this.state.projects}
                        project={this.state.project}
                        // areProjectsLoading={this.state.areProjectsLoading}
                        onProjectSelection={this.handleProjectSelection}
                      /> */}

                                <BranchCommits
                                  key={"bc"}
                                  project={this.state.project}
                                  branchCommits={this.state.branchCommits}
                                  branch={this.state.branch}
                                  sha={this.state.sha}
                                  // QGloading={this.state.QGloading}
                                  onBranchSelection={this.handleBranchSelection}
                                  onSHASelection={this.handleSHASelection}
                                  onQualityGateAnalysis={
                                    this.handleQualityGateAnalysis
                                  }
                                  qualityGateRunning={this.state.qualityGateRunning}
                                />

                                {/* <MDBTooltip placement="top"> */}
                                <MDBBtn
                                  onClick={this.handleHistoricalAnalysis}
                                  className={
                                    "white-text" +
                                    this.getHistoricalAnalysisMDBBtnClasses()
                                  }
                                  color="  light-green darken-4"
                                >
                                  <MDBIcon
                                    icon="sync-alt"
                                    className="mr-1"
                                    size="lg"
                                  />
                                  {"Historical Analysis" + this.getpendingNumber()}
                                </MDBBtn>

                                {this.state.projectPendingAnalyses > 0 ? (
                                  <MDBBtn
                                    onClick={this.cancelHistoricalAnalysis}
                                    className={
                                      "white-text" +
                                      this.getCancelHistoricalAnalysisMDBBtnClasses()
                                    }
                                    color="danger"
                                  >
                                    <MDBIcon
                                      // icon="ban"
                                      icon="power-off"
                                      className="mr-1"
                                      size="lg"
                                    />
                                    {"Cancel Analysis" + this.getpendingNumber()}
                                  </MDBBtn>
                                ) : null}

                                {/* <div>
                              Performs Historical Analysis till the last commit
                            </div>
                          </MDBTooltip> */}
                              </MDBFormInline>
                            </React.Fragment>
                          )}
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                </MDBRow>

                <TecnicalDebtDensityOverTime
                  key={"tddot"}
                  project={this.state.project}
                  qgData={this.state.qgData}
                />

                {showQualityGate ? (
                  <QualityGate
                    key={"qgate"}
                    qgExecution={this.state.qgExecution}
                    qgComponents={this.state.qgComponents}
                    qgModals={this.state.qgModals}
                    onToggleQualityGateModal={this.toggleQualityGateModal}
                    qualityGateRunning={this.state.qualityGateRunning}
                  />
                ) : null}

                <IntroducedNewIssues key={"ini"} project={this.state.project} />

                {/* <IssuesTracker key={"issuesTracker"} /> */}

                {/* <CreateProjectForm /> */}
              </React.Fragment>
            )}
        </React.Fragment>
      </React.Fragment>
    );
  }
}

export default TDNewCodeDashPage;
