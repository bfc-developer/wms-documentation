# List AUM Scheme
Retrieves a list of schemes for specified AMC codes, including scheme names and product codes, grouped by unique scheme-product combinations.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    
    Request --> Verify[Verify Token]
    
    Verify -- Valid --> ValidateSchema[Validate Request Schema]
    Verify -- Invalid --> Response401([Return 401 Unauthorized])
    
    ValidateSchema -- Valid --> CheckArray{AMC Array<br/>Valid?}
    ValidateSchema -- Invalid --> Response400A([Return 400 Bad Request])
    
    CheckArray -- Empty/Invalid --> Response400B([Return 400: amc must be non-empty array])
    CheckArray -- Valid --> MatchAMC[Match Schemes by AMC Codes]
    
    MatchAMC --> GroupScheme[Group by Scheme Name & CAMS Code]
    
    GroupScheme --> ProjectFields[Project Scheme Fields]
    
    ProjectFields --> SortByName[Sort by Scheme Name]
    
    SortByName --> BuildPayload[Build Payload with Length & List]
    
    BuildPayload --> Response200([Return 200 OK: Success with Scheme List])
    
    Request -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/list-aum-scheme
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "amc": ["AB001", "HD001", "IP001"]
}
```

**Note:** `amc` must be a non-empty array of AMC codes.

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Success",
    "payload": {
        "length": 125,
        "schemeList": [
            {
                "SCHEMENAME": "Aditya Birla Sun Life Equity Fund",
                "PRODUCTCODE": "AB-EQ-001"
            },
            {
                "SCHEMENAME": "HDFC Balanced Advantage Fund",
                "PRODUCTCODE": "HD-BA-002"
            },
            {
                "SCHEMENAME": "ICICI Prudential Bluechip Fund",
                "PRODUCTCODE": "IP-BC-003"
            }
        ]
    }
}
```

### Response `Status: (400)`
```json
{
    "status": false,
    "message": "amc must be a non-empty array"
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
