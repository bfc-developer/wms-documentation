# Client Folio Detail
Retrieves detailed folio information for a specific folio number from both CAMS and KARVY RTA databases. It aggregates data including PAN, Name, Scheme details, Units, and current value date.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    
    Request --> Validate{Validate Schema}
    
    Validate -- Valid --> ParallelQuery[Execute Parallel Queries]
    Validate -- Invalid --> Response400([Return 400 Bad Request])
    
    subgraph Parallel_Query_Execution
        ParallelQuery --> QueryCams[Query CAMS Folios]
        ParallelQuery --> QueryKarvy[Query KARVY Folios]
    end
    
    subgraph CAMS_Processing
        QueryCams --> MatchCams[Match FOLIOCHK]
        MatchCams --> GroupCams[Group & Project Fields]
        GroupCams --> LookupCamsPort[Lookup foliowisePortfolio]
        LookupCamsPort --> UnwindCams[Unwind Details]
        UnwindCams --> ProjectCamsFinal[Project Final CAMS Fields]
    end
    
    subgraph KARVY_Processing
        QueryKarvy --> MatchKarvy[Match ACNO]
        MatchKarvy --> GroupKarvy[Group & Project Fields]
        GroupKarvy --> LookupKarvyPort[Lookup foliowisePortfolio]
        LookupKarvyPort --> UnwindKarvy[Unwind Details]
        UnwindKarvy --> ProjectKarvyFinal[Project Final KARVY Fields]
    end
    
    ProjectCamsFinal & ProjectKarvyFinal --> CombineResults[Combine CAMS & KARVY Data]
    
    CombineResults --> CheckData{Data Found?}
    
    CheckData -- Yes --> Response200([Return 200 OK: Success with Payload])
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
/folio-short-detail
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "searchvalue": "1234567/89"
}
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Success",
    "payload": {
        "length": 2,
        "folioDetails": [
            {
                "PAN": "ABCDE1234F",
                "GPAN": "ABCDE1234F",
                "FOLIO": "1234567/89",
                "PRODCODE": "P001",
                "SCHEME": "HDFC Liquid Fund",
                "NAME": "John Doe",
                "UNIT": 100.50,
                "RTA": "CAMS",
                "SCHEMECODE": "S001",
                "STATUS": "Active",
                "DATE": "20-12-2025",
                "JOINT1_PAN": "XYZDE1234F",
                "JOINT2_PAN": ""
            }
        ]
    }
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
