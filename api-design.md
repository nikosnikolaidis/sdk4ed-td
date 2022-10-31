# SDK4ED APIs
This document quickly defines and describes the design of the REST APIs the SDK4ED system will provide to both retrieve web-pages and data from the backend database.

## Architecture & Design
The architecture design envisioned is shown below.

```
┌────────┐                       ┌────────────┐                       ┌──────────────┐
│ Remote │                       │ Dashboard  │                       │ QA-specific  │
│ Client │ ─── REST request ───> │ Container  │ ─── REST request ───> │  Container   │
└────────┘                       └────────────┘                       └──────────────┘
```

Remote clients (browsers, scripts, etc.) will send their requests to the dashboard, who in turn will forward the request to a specific QA container to retrieve the data before tailoring it as a custom HTML response and sending it back to the client.

Some clients may need to retrieve the raw data directly and in an automatic fashion.
Thus, to separate pure data requests APIs from dasboard requests, it is necessary to use the  root `/dashboard/`.
Whenever this is optional, `/[dashboard]/` is used.

| API Link | Description|
|----------|------------|
|`/dashboard` | Homepage. |
|`/dashboard/login`    | Login page. |
|`/dashboard/settings` | The settings page. |
|`/dashboard/profile/:user-id` | The user page containing a summary of the user's projects. |
|`/[dashboard]/profile/:user-id/assigned-issues` | The list of issues assigned to the user. |
|`/dashboard/:project/:quality` | Quality management dashboard (multiple summary panels related to the quality are shown in this page).|
|`/dashboard/:project/:quality/:panel` | Panel-specific detailed information. |
|`/:project/:quality/issues` | The list of issues detected for the quality attribute. |
|`/[dashboard]/:project/:quality/:panel/issue/:issue-id` | The specific visualization ssue visualization |

In the above table, the variables are defined in the following format `:variable`.
Their description is the following:

| API Variable | Description| Domain |
|--------------|------------|-----------------|
|`:user-id`    | The id the system uses to identify the user. | Hash-values |
|`:project`    | The name of the project the user has defined when he/she added the project for definition. | User-defined string |
|`:quality`    | The name of the quality to consider. | `[techdebt, energy, security, forecast, refactorings, trade-offs]` |
|`:panel`      | The name of the analysis type.       | `[principal, interest, consumption, ...]` (Incomplete) |
|`:issue-id`   | The id the system uses to identify an issue for the provided `:quality` and `:panel` | Integer |