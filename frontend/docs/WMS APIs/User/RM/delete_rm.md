# Delete RM
Delete a Relationship Manager (RM) from the system, provided they have no mapped clients.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    Request --> Verify[Verify Token]
    
    Verify -- Valid --> GetID[Get _id from Body]
    Verify -- Invalid --> Response401([Return 401 Unauthorized])
    
    GetID --> FindRM[Find RM by _id]
    FindRM --> CheckMap[Check Mapped Clients in mappedrmSchema]
    
    CheckMap -- Clients Found --> Response404([Return 404: Rm cannot be deleted])
    CheckMap -- No Clients --> Delete[Delete RM from Login]
    
    Delete --> Success[Prepare Success Response]
    Success --> Response200([Return 200 OK: Deleted Successfully])
    
    FindRM -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/user/delete-rm
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "_id": "60d5ec49f1b2c82a8c8e1234"
}
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Deleted Successfully"
}
```

### Response `Status: (404)`
```json
{
    "status": false,
    "message": "Rm cannot be deleted"
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
