# Get Client List Folios
Retrieve comprehensive folio details for a specific user, consolidating data from CAMS, Karvy, and Portfolio sources.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    Request --> Verify[Verify Token]

    Verify -- Valid --> GetUser[Get userid]
    Verify -- Invalid --> Response401([Return 401 Unauthorized])

    GetUser --> AggStart[Start Aggregation on client_foliodetail]

    subgraph Aggregation
        AggStart --> MatchUser[Match userid]
        MatchUser --> LookupCAMS[Lookup CAMS Folio]
        LookupCAMS --> LookupKarvy[Lookup Karvy Folio]
        LookupKarvy --> MergeMatched[Merge CAMS & Karvy Data]
        MergeMatched --> LookupPortfolio[Lookup Portfolio Value]
        LookupPortfolio --> FinalProj[Project Final Fields]
    end

    FinalProj --> CheckRes{Data Found?}
    CheckRes -- No --> Response404([Return 404: No data found])
    CheckRes -- Yes --> Success[Prepare Success Payload]
    
    Success --> Response200([Return 200 OK: Folio Details])
    
    AggStart -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/user/client-list-folios
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "userid": "user123"
}
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Successful",
    "payload": {
        "length": 1,
        "folioDetail": [
            {
                "folioname": "John Doe",
                "mappedname": "John Doe",
                "pan": "ABCDE1234F",
                "folio": "123456789",
                "product": "Product Name",
                "gpan": "",
                "scheme": "Scheme Name",
                "rta": "CAMS",
                "userid": "user123",
                "email": "john@example.com",
                "mobile": "9876543210",
                "dob": "1990-01-01",
                "status": "Individual",
                "bank": "Bank Name",
                "account": "1234567890",
                "amount": 50000
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
