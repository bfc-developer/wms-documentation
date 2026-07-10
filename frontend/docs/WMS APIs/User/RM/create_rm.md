# Create RM
Register a new Relationship Manager (RM) with their details.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    Request --> Verify[Verify Token]
    
    Verify -- Valid --> Validate[Validate Input]
    Verify -- Invalid --> Response401([Return 401 Unauthorized])
    
    Validate -- Valid --> Process[Process Data]
    Validate -- Invalid --> Response400([Return 400 Bad Request])

    subgraph Processing
        Process --> Trim[Trim & Uppercase Name]
        Trim --> Hash[Hash Password]
        Hash --> GenID[Generate 6-digit RMID]
        GenID --> CreateObj[Create Login Object]
    end

    CreateObj --> Save[Save to Database]
    Save --> Success[Prepare Success Response]
    Success --> Response200([Return 200 OK: Saved Successfully])
    
    Save -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/user/create-rm
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "rm": "RM Name",
    "mobile": "9876543210",
    "email": "rm@example.com",
    "password": "password123"
}
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Saved Successfully."
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
