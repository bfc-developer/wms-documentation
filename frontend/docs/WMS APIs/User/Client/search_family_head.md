# Search Family Head
Search for users who are family heads (admin with family members) based on a search string.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    Request --> Verify[Verify Token]
    
    Verify -- Valid --> Validate{Validate Schema}
    Verify -- Invalid --> Response401([Return 401 Unauthorized])
    
    Validate -- Valid --> PrepareQuery[Prepare Search Regex]
    Validate -- Invalid --> Response400([Return 400 Bad Request])
    
    PrepareQuery --> DBQuery[Query User Master Collection]
    
    subgraph QueryMatch
        direction TB
        MatchHead[Match Family Head Name regex]
        MatchAdmin[Match Admin = true]
        MatchMembers[Match Family Member Size > 0]
        MatchHead & MatchAdmin & MatchMembers --> DBQuery
    end
    
    DBQuery --> FetchData[Fetch Family Data]
    FetchData --> PreparePayload[Prepare Response Payload]
    
    PreparePayload --> Response200([Return 200 OK: Successful])
    
    DBQuery -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/user/search-family-head
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "search": "Sharma"
}
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Successful",
    "payload": {
        "length": 2,
        "familyData": [
            {
                "familyhead": "Rajesh Sharma",
                "userid": "USER001",
                "pan": "ABCDE1234F",
                "gpan": "ABCDE1234F"
            },
            {
                "familyhead": "Suresh Sharma",
                "userid": "USER005",
                "pan": "FGHIJ5678K",
                "gpan": "FGHIJ5678K"
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
