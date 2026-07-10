# Get Scheme
Retrieves a list of schemes based on the AMC code provided. The schemes are filtered to include only those with an "Active" status and are sorted by scheme name.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    
    Request --> Validate{Validate Schema}
    
    Validate -- Valid --> QueryDB[Query scheme_detail Collection]
    Validate -- Invalid --> Response400([Return 400 Bad Request])
    
    subgraph Database_Query
        QueryDB --> Match[Match amc_code & status: Active]
        Match --> Project[Project s_name, amc_code, schemecode]
        Project --> Sort[Sort by s_name]
    end
    
    Sort --> CheckData{Data Found?}
    
    CheckData -- Yes --> Response200([Return 200 OK: Scheme found successfully])
    CheckData -- No --> Response404([Return 404: No data found])
    
    Request -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/get-scheme
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "amccode": "AMC123"
}
```

### Parameters
| Name | Type | Description |
|------|------|-------------|
| amccode | String | The AMC code to filter schemes. |

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Scheme found successfully",
    "payload": {
        "length": 1,
        "schemeDetails": [
            {
                "s_name": "Axis Bluechip Fund",
                "amc_code": "AMC123",
                "schemecode": "SCH001"
            }
        ]
    }
}
```

### Response `Status: (400)`
```json
{
    "status": false,
    "message": "Validation Error"
}
```

### Response `Status: (404)`
```json
{
    "status": false,
    "message": "No data found"
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
