# Get New ProdigyPro User List
Fetch a list of new ProdigyPro users, sorted by creation date, with mapped Relationship Manager (RM) details if available.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive GET Request}
    Request --> Verify[Verify Token]
    
    Verify -- Valid --> Query[Aggregate Users2 Collection]
    Verify -- Invalid --> Response401([Return 401 Unauthorized])
    
    Query --> Sort[Sort by CreatedAt Descending]
    Sort --> Lookup[Lookup Mapped RM]
    
    subgraph MappedRM_Lookup
        Lookup --> MatchPAN[Match PAN]
        MatchPAN --> MatchEmptyGPAN[Match Empty GPAN]
        MatchEmptyGPAN --> Limit[Limit 1]
    end
    
    Lookup --> Unwind[Unwind RM Details]
    Unwind --> Project[Project Required Fields]
    Project --> PreparePayload[Prepare Response Payload]
    
    PreparePayload --> Response200([Return 200 OK: Users found successfully])
    
    Query -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
GET
```

### Route
```
/user/get-new-prodigypro-userlist
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
GET: https://<host>/user/get-new-prodigypro-userlist
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Users found successfully",
    "payload": {
        "length": 1,
        "userList": [
            {
                "mobile": "9876543210",
                "bankDetails": {},
                "createdAt": "2023-01-01T00:00:00.000Z",
                "doneKYC": true,
                "iins": [],
                "isVerified": true,
                "nomination": {},
                "otp": "1234",
                "otpAttempts": 0,
                "otpBlockedUntil": null,
                "personalDetails": {},
                "primaryIIN": null,
                "updatedAt": "2023-01-01T00:00:00.000Z",
                "userId": "USER123",
                "PAN": "ABCDE1234F",
                "name": "User Name",
                "rm": "RM Name"
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
