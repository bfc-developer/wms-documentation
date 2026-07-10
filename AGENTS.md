## Scope
- This purpose of this project is to create a store documentation of other software projects, - like Prodigy pro, WMS, etc.
- in this project we are building documentation for WMS - (Wealth Management System) for BFC Capital.
- This will store technical (APIs, functions) and user flow documentation of WMS.
- the document files will be store in markdown format.
- You are required to generate markdown files for WMS documentation.
- the format for markdown files for API documentation will be as given below

### for GET APIs

```
# <API Name>
<API description>

### User flow diagram
\`\`\`mermaid
<mermaid code>
\`\`\`

### Method
\`\`\`
GET
\`\`\`

### Route
\`\`\`
/<module-name>/<api-name>
\`\`\`

### Authorization
\`\`\`
Bearer <token>
\`\`\`

### Parameters
| Name | Type | Description |
|------|------|-------------|
| <parameter-name> | <parameter-type> | <parameter-description> |

### Sample Request
\`\`\`http
GET: https://<host>/<module-name>/<api-name>?<parameter-name>=<parameter-value>
\`\`\`

### Response
\`\`\`json
{
    <json response>
}
\`\`\`
```

### for POST APIs

```
# <API Name>
<API description>

### Method
\`\`\`
POST
\`\`\`

### Route
\`\`\`
/<module-name>/<api-name>
\`\`\`

### Authorization
\`\`\`
Bearer <token>
\`\`\`

### Request Body
\`\`\`json
{
    <json request body>
}
\`\`\`


### Response `Status: (200)`
\`\`\`json
{
    <json response>
}
\`\`\`

### Response `Status: (404)`
\`\`\`json
{
    <json response>
}
\`\`\`
```