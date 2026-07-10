# Enable/Disable Client
Enable or disable access for multiple client accounts in bulk.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    Request --> Verify[Verify Token]

    Verify -- Valid --> ExecUpdate[Execute Update]
    Verify -- Invalid --> Response401([Return 401 Unauthorized])

    ExecUpdate --> DB_Update[Update Many Users]

    subgraph DB_Operation
        DB_Update --> Match["Match Users by IDs ($in)"]
        Match --> SetActive["Set 'active' Field"]
    end

    SetActive --> Success[Prepare Success Payload]
    
    Success --> Response200([Return 200 OK: Updated Count])
    
    DB_Update -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/user/enable-disable-client
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "active": true,
    "userid": ["user1", "user2", "user3"]
}
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Updated 3 users"
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
