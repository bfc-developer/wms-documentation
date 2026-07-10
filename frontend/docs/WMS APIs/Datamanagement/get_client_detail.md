# Get Client Detail
Fetch detailed portfolio information for a client given their name and PAN. Aggregates data from both CAMS and KARVY sources.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    Request --> Validate{Validate Schema}
    
    Validate -- Valid --> Parallel[Run Parallel Aggregations]
    Validate -- Invalid --> Response400([Return 400 Bad Request])
    
    subgraph Aggregation_CAMS
        Parallel --> MatchCAMS[Match CAMS Transc]
        MatchCAMS --> LookupFolioC[Lookup Folio CAMS]
        LookupFolioC --> LookupPortfolioC[Lookup Foliowise Portfolio]
        LookupPortfolioC --> GroupCAMS[Group by Scheme & Folio]
        GroupCAMS --> ProjectCAMS[Project CAMS Data]
    end
    
    subgraph Aggregation_KARVY
        Parallel --> MatchKARVY[Match KARVY Transk]
        MatchKARVY --> LookupFolioK[Lookup Folio KARVY]
        LookupFolioK --> LookupPortfolioK[Lookup Foliowise Portfolio]
        LookupPortfolioK --> GroupKARVY[Group by Scheme & Folio]
        GroupKARVY --> ProjectKARVY[Project KARVY Data]
    end
    
    ProjectCAMS & ProjectKARVY --> Combine[Combine Results]
    Combine --> Sort[Sort by Scheme Name]
    
    Sort --> CheckResult{Data Found?}
    
    CheckResult -- Yes --> Response200([Return 200 OK: Success])
    CheckResult -- No --> Response404([Return 404: No data found])
    
    Parallel -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/get-client-detail
```

### Authorization
```
None
```

### Request Body
```json
{
    "name": "Client Name",
    "pan": "ABCDE1234F"
}
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Success",
    "payload": {
        "length": 2,
        "clientDetails": [
            {
                "PAN": "ABCDE1234F",
                "SCHEME": "Scheme A",
                "FOLIO": "12345/67",
                "PRODCODE": "P001",
                "NAME": "Client Name",
                "UNIT": 100,
                "RTA": "CAMS",
                "SCHEMECODE": "SCH001",
                "GPAN": "",
                "STATUS": "OK",
                "DATE": "01-01-2024"
            },
            {
                "PAN": "ABCDE1234F",
                "SCHEME": "Scheme B",
                "FOLIO": "98765/43",
                "PRODCODE": "P002",
                "NAME": "Client Name",
                "UNIT": 50,
                "RTA": "KARVY",
                "SCHEMECODE": "SCH002",
                "GPAN": "",
                "STATUS": "OK",
                "DATE": "01-01-2024"
            }
        ]
    }
}
```

### Response `Status: (404)`
```json
{
    "status": false,
    "message": "No data  found"
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
