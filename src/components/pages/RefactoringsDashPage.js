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
  MDBCardHeader,
  MDBDataTable,
  MDBTooltip,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
} from "mdbreact";
import Loader from "./sections/Loading";

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
      areProjectsLoading,
      project,
      projects,
      onProjectSelection,
    } = this.props;

    if (areProjectsLoading) {
      return <Loader />;
    }

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

class IssuesTable extends Component {
  render() {
    const { issues } = this.props;

    const columns = [
      { label: "File", field: "file", sort: "asc", width: 15 },
      { label: "Line", field: "line" },
      { label: "Effort", field: "effort" },
    ];

    let rows = [];
    let i = 0;

    issues.map((issue) =>
      rows.push({
        file: issue.file,
        line: issue.line,
        effort: issue.effort,
      })
    );

    var data = {
      columns: columns,
      rows: rows,
    };

    return (
      <React.Fragment>
        <MDBDataTable striped small bordered responsive hover data={data} />
      </React.Fragment>
    );
  }
}

class Refactorings extends Component {
  state = {
    isLoading: true,
    refactorings: [],
    modals: [],
  };

  async componentDidMount() {
    console.log("componentDidMount");
    if (this.props.project !== undefined)
      console.log("props.project is NOT undefined");
    console.log("1. componentDidMount" + this.props.project);
    if (
      this.props.project !== undefined &&
      this.props.project.kee.trim() !== ""
    )
      console.log("props.project is NOT empty");
    console.log("2. componentDidMount" + this.props.project.kee);
    console.log("prevProps.kee and props.kee are the SAME");
    console.log("3. componentDidMount" + this.props.project.kee);

    if (
      this.props.project !== undefined &&
      this.props.project.kee.trim() !== ""
    ) {
      this.setState({ isLoading: true });

      try {
        const response = await fetch(
          "http://195.251.210.147:8989/api/sdk4ed/refactorings/ruleViolationPrct/" +
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
        let modals = [];
        data.map((d) =>
          modals.push({
            id: d.rank,
            modal: false,
          })
        );
        this.setState({ isLoading: false, refactorings: data, modals });
        // this.setState({ isLoading: false});
      } catch (error) {
        console.log(error);
      }
    }
  }

  async componentDidUpdate(prevProps) {
    console.log("componentDidUpdate");
    if (this.props.project !== undefined)
      console.log("props.project is NOT undefined");
    console.log("1. componentDidUpdate" + this.props.project);
    if (
      this.props.project !== undefined &&
      this.props.project.kee.trim() !== ""
    )
      console.log("props.project is NOT empty");
    console.log("2. componentDidUpdate" + this.props.project.kee);
    if (
      this.props.project !== undefined &&
      this.props.project.kee.trim() !== "" &&
      prevProps.project.kee !== this.props.project.kee
    )
      console.log("prevProps.kee and props.kee are the SAME");
    console.log("3. componentDidUpdate" + this.props.project.kee);

    if (
      this.props.project !== undefined &&
      this.props.project.kee.trim() !== "" &&
      prevProps.project.kee !== this.props.project.kee
    ) {
      this.setState({ isLoading: true });

      try {
        const response = await fetch(
          "http://195.251.210.147:8989/api/sdk4ed/refactorings/ruleViolationPrct/" +
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
        let modals = [];
        data.map((d) =>
          modals.push({
            id: d.rank,
            modal: false,
          })
        );
        this.setState({ isLoading: false, refactorings: data, modals });
        // this.setState({ isLoading: false});
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
    const { isLoading, refactorings } = this.state;
    const columns = [
      { label: "Rank", field: "rank", sort: "asc", width: 20 },
      { label: "Rule", field: "rule", width: 10 },
      // { label: "Description", field: "description", width: 10 },
      { label: "Language", field: "language", width: 10 },
      { label: "Rule Probability", field: "rp", width: 10 },
      // { label: "Change Proneness", field: "cp", width: 10 },
      {
        label: [
          <MDBTooltip placement="top">
            <div>Change Proneness</div>
            <div>Quality Gate Analysis</div>
          </MDBTooltip>,
        ],
        field: "cp",
        width: 10,
      },
      { label: "Urgency To Resolve", field: "value", width: 10 },
      // { label: [<i key="Lorem" className="fa fa-leaf mr-2 blue-text" aria-hidden="true"></i>, 'Value1'], field: "value", width: 10 }
    ];

    let r = [];

    refactorings.map((refactoring) =>
      r.push({
        rank: refactoring.rank,
        rule: [
          <div key={refactoring.rank}>
            <div onClick={this.toggle(refactoring.rank - 1)}>
              <u>{refactoring.rule}</u>
            </div>
            <MDBModal
              isOpen={this.state.modals[refactoring.rank - 1].modal}
              toggle={this.toggle(refactoring.rank - 1)}
            >
              <MDBModalHeader toggle={this.toggle(refactoring.rank - 1)}>
                {refactoring.rule}
              </MDBModalHeader>
              <MDBModalBody>
                <div
                  dangerouslySetInnerHTML={{
                    __html: refactoring.description,
                  }}
                />
                <hr />
                <IssuesTable issues={refactoring.issues} />
              </MDBModalBody>
              <MDBModalFooter>
                <div>
                  Rule Description Retrieved from&nbsp;
                  <a href="https://www.sonarqube.org/" target="_blank">
                    SonarQube
                  </a>
                </div>
              </MDBModalFooter>
            </MDBModal>
          </div>,
        ],
        language: refactoring.language,
        rp: Number(refactoring.rp.toFixed(3)),
        cp: Number(refactoring.cp.toFixed(3)),
        value: Number(refactoring.value.toFixed(3)),
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
            <MDBCardHeader className="sdk4ed-color">Refactorings</MDBCardHeader>
            <MDBCardBody>
              {isLoading ? (
                <Loader />
              ) : (
                <React.Fragment>
                  {data.rows.length === 0 ? (
                    <div>There are NO Refactoring Suggestions</div>
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

class RefactoringsDashPage extends Component {
  state = {
    project: {},
    // isLoadingProject: true,
    isError: false,
    error: {},
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
          "http://195.251.210.147:8989/api/sdk4ed/project-details/findByUri?uri=" +
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
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  // state = {
  //   areProjectsLoading: true,
  //   projects: [],
  //   project: {},
  // };

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
  //       areProjectsLoading: false,
  //       project: body[0],
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // handleProjectSelection = (project) => {
  //   this.setState({ qgData: null, project });
  // };

  render() {
    const { isError, error } = this.state;
    return (
      <React.Fragment>
        {/* <MDBRow className="mb-4">
          <MDBCol md="12" lg="12" className="mb-12">
            <MDBCard className="mb-12">
              <MDBCardHeader className="sdk4ed-color">Projects</MDBCardHeader>
              <MDBCardBody>
                <MDBFormInline className="md-form m-0">
                  <ProjectsDropdown
                    key={"projectsDropdown"}
                    projects={this.state.projects}
                    project={this.state.project}
                    areProjectsLoading={this.state.areProjectsLoading}
                    onProjectSelection={this.handleProjectSelection}
                  />
                </MDBFormInline>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow> */}

        {isError ? (
          <React.Fragment>
            <div class="alert alert-danger" role="alert">
              {error.message}
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {this.state.project.kee === undefined ? (
              <React.Fragment>
                <div class="alert alert-danger" role="alert">
                  No data to display. Please select another project or perform
                  analysis for this one
                </div>
              </React.Fragment>
            ) : (
              <Refactorings key={"refactorings"} project={this.state.project} />
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default RefactoringsDashPage;
