import 'whatwg-fetch';

let endpoint = process.env.REACT_APP_PROJECT_MANAGEMENT_SERVER_IP // 'http://160.40.52.130:3001/SDK4ED/'; // 'https://ioswagger20200221094142.azurewebsites.net/MAAXCNET/'; // 
let tdendpoint = process.env.REACT_APP_TD_TOOL_INTEREST_ENDPOINT

export const createProject = (newProject) => {
    var url = endpoint + 'ProjectManagement/1.0.0/projects';
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(newProject),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
};

export const editProject = (id, updatedProject) => {
    var url = endpoint + `ProjectManagement/1.0.0/projects/${id}`;
    return fetch(url, {
        method: 'PUT',
        body: JSON.stringify(updatedProject),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
};

export const fetchProjects = (sdk4edUser, sdk4edRoles) => {
    let roleStr = '';
    for (let i = 0; i < sdk4edRoles.length; i++) {
        if (i == sdk4edRoles.length - 1)
            roleStr += sdk4edRoles[i]
        else
            roleStr += sdk4edRoles[i] + ','
    }

    var url = endpoint + 'ProjectManagement/1.0.0/projects?sdk4edUser=' + sdk4edUser;
    if (sdk4edRoles && sdk4edRoles.length > 0) {
        url = endpoint + 'ProjectManagement/1.0.0/projects?sdk4edUser=' + sdk4edUser + '&sdk4edRoles=' + roleStr;
    }

    return fetch(url);
};

export const fetchSingleProject = (projectId) => {
    var url = endpoint + `ProjectManagement/1.0.0/projects/${projectId}`;
    return fetch(url);
};

export const deleteProject = (projectId) => {
    var url = endpoint + `ProjectManagement/1.0.0/projects/${projectId}`;
    deleteProjectFromServicedMetricsCalculator();
    return fetch(url, {
        method: 'DELETE'
    });

};

const deleteProjectFromServicedMetricsCalculator = () => {
    let storedProject = sessionStorage.getItem('selected_project');
    let storedProjectJson = JSON.parse(storedProject);
    let url = "";
    let urlPrefix = tdendpoint + "api/project/";
    url = urlPrefix + "url?url=" + storedProjectJson.endpoint.toString();
    fetch(url, {
        method: 'DELETE'
    })
}
