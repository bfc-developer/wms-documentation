# Get RM Client List
Retrieve a list of clients mapped to a specific Relationship Manager (RM).

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    Request --> Validate[Validate 'rm' input]
    
    Validate -- Invalid --> Response400([Return 400 Bad Request: Invalid RM input])
    Validate -- Valid --> Query[Query mappedrmSchema]

    subgraph DB_Operation[Database Operation]
        Query --> Find[Find by RM]
        Find --> Select[Select RM, RMID, CLIENTNAME, PAN, GPAN, ENTRY_DATE]
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
/user/rm-client-list
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "rm": "RM Name"
}
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Successful",
    "payload": {
        "list": [
            {
                "_id": "60d5ec49f1b2c82a8c8e5678",
                "RM": "RM Name",
                "RMID": "RM123",
                "CLIENTNAME": "Client Name",
                "PAN": "ABCDE1234F",
                "GPAN": "ABCDE1234F",
                "ENTRY_DATE": "2024-01-01T10:00:00.000Z"
            }
        ]
    }
}
```

### Response `Status: (400)`
```json
{
    "status": false,
    "message": "Invalid RM input"
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
