# Get Logged-in RM Client List
Retrieve a list of clients mapped to the currently logged-in Relationship Manager (RM).

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    Request --> Verify[Verify Token]

    Verify -- Valid --> GetRMID[Get RMID from Token]
    Verify -- Invalid --> Response401([Return 401 Unauthorized])

    GetRMID --> Query[Query mappedrmSchema]

    subgraph DB_Operation[Database Operation]
        Query --> Find[Find by RMID]
        Find --> Select[Select RM, RMID, CLIENTNAME, PAN, ENTRY_DATE]
        Select --> Sort[Sort by RM]
    end

    Sort --> Check{Data Found?}
    Check -- No --> Response404([Return 404 Not Found: No data found])
    Check -- Yes --> Success[Prepare Success Payload]
    Success --> Response200([Return 200 OK: Client list fetched])
    
    Query -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/user/rm-login-clients
```

### Authorization
```
Bearer <token>
```

### Parameters
| Name | Type | Description |
|------|------|-------------|
| - | - | No parameters required |

### Sample Request
```http
POST /user/rm-login-clients HTTP/1.1
Host: <host>
Authorization: Bearer <token>
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Successful",
    "payload": {
        "list": [
            {
                "_id": "60d5ec49f1b2c82a8c8e9012",
                "RM": "RM Name",
                "RMID": "RM123",
                "CLIENTNAME": "Client Name",
                "PAN": "ABCDE1234F",
                "ENTRY_DATE": "2024-01-01T10:00:00.000Z"
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
