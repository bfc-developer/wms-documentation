# List AUM AMC
Retrieves a list of all AMCs (Asset Management Companies) that have active schemes, including their short names, ACCORD AMC codes, AMC codes, and RTA information.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive GET Request}
    
    Request --> Verify[Verify Token]
    
    Verify -- Valid --> MatchActive[Match Active Schemes from scheme_detail]
    Verify -- Invalid --> Response401([Return 401 Unauthorized])
    
    MatchActive --> GroupAMC[Group by amc_code]
    
    GroupAMC --> LookupAMC[Lookup amc_mst_new by amc_code]
    
    LookupAMC --> UnwindDetail[Unwind AMC Details]
    
    UnwindDetail --> ProjectFields[Project AMC Fields]
    
    ProjectFields --> SortByName[Sort by Short Name]
    
    SortByName --> BuildPayload[Build Payload with Length & List]
    
    BuildPayload --> Response200([Return 200 OK: Success with AMC List])
    
    Request -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
GET
```

### Route
```
/list-aum-amc
```

### Authorization
```
Bearer <token>
```

### Parameters
| Name | Type | Description |
|------|------|-------------|
| None | - | - |

### Sample Request
```http
GET: https://<host>/list-aum-amc
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Success",
    "payload": {
        "length": 45,
        "amcList": [
            {
                "AMC_SHORTNAME": "Aditya Birla SL AMC",
                "ACCORD_AMC": "AB",
                "AMC": "AB001",
                "RTA": "CAMS"
            },
            {
                "AMC_SHORTNAME": "HDFC AMC",
                "ACCORD_AMC": "HD",
                "AMC": "HD001",
                "RTA": "CAMS"
            },
            {
                "AMC_SHORTNAME": "ICICI Prudential AMC",
                "ACCORD_AMC": "IP",
                "AMC": "IP001",
                "RTA": "KARVY"
            }
        ]
    }
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
