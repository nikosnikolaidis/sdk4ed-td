import 'whatwg-fetch';

// Perform GET call for new Dependability analysis
export const runNewDependabilityAnalysisData = (url, project_url, user_name, lang, inspection, key) => {
    // Default options are marked with *
    return fetch(url+'?project='+project_url+'&user_name='+user_name+'&lang='+lang+'&inspection='+inspection, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: 'include', // include, *same-origin, omit
        headers: new Headers(key)
    })
    //.then(response => response.json()); // parses JSON response into native JavaScript objects 
}

// Perform GET call for new Optimal Checkpoint analysis
export const runNewOptimalCheckpointAnalysisData = (url, optimal_checkpoint_body) => {
    // Default options are marked with *
    return fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        body: JSON.stringify(optimal_checkpoint_body),
        mode: 'cors', // no-cors, cors, *same-origin
        //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: 'include', // include, *same-origin, omit
        //headers: new Headers(key)
    })
    //.then(response => response.json()); // parses JSON response into native JavaScript objects 
}

// Perform GET call for new Energy analysis
export const runNewEnergyAnalysisData = (url, new_project, user_name, token, project_url, type) => {
    // Default options are marked with *
    return fetch(url+'?new='+new_project+'&user='+user_name+'&token='+token+'&url='+project_url+'&type='+type, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: 'include', // include, *same-origin, omit
        //headers: new Headers(key)
    })
    //.then(response => response.json()); // parses JSON response into native JavaScript objects 
}

// Perform GET call for new TD analysis
export const runNewTDAnalysisData = (url, lang, type, project_url, user_name, user_password, move_class_refactoring, extract_method_refactoring) => {
    // Default options are marked with *
    return fetch(url+'?language='+lang+'&typeAnalysis='+type+'&gitUrl='+project_url+'&gitUsername='+user_name+'&gitPassword='+user_password+'&moveClassRefactoring='+move_class_refactoring+'&extractMethodRefactoring='+extract_method_refactoring, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: 'include', // include, *same-origin, omit
        //headers: new Headers(key)
    })
    //.then(response => response.json()); // parses JSON response into native JavaScript objects 
}

// Perform GET call for new TD New Code analysis
export const runNewTDNewCodeAnalysisData = (url, user_name, user_password, project_url, lang, build_tool) => {
    // Default options are marked with *
    return fetch(url+'?gitUsername='+user_name+'&gitPassword='+user_password+'&uri='+project_url+'&language='+lang+'&buildTool='+build_tool, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: 'include', // include, *same-origin, omit
        //headers: new Headers(key)
    })
    //.then(response => response.json()); // parses JSON response into native JavaScript objects 
}

// Perform GET call for new TD New Code analysis
export const runNewArchitectureRefactoringAnalysisData = (url, lang, project_url, selectedProject) => {
    // Default options are marked with *
    var credentials = null
    var request = { method: 'GET', mode: 'cors'}
    if(selectedProject && selectedProject.username){
        credentials = { username: selectedProject.username, password: selectedProject.password }
        request.method = 'POST'
        request.body = JSON.stringify(credentials)
        request.headers = {'Content-Type': 'application/json' }
    }
    var params = "";
    if(selectedProject && selectedProject.archtechdebt){
        params = '&' + selectedProject.archtechdebt.split("\n").filter(x => x !== "").join("&")
    }
    url = url+'?language='+lang+'&project='+project_url+params
    return fetch(url, request)
}