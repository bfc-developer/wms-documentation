# Edit RM
Update the details of an existing Relationship Manager (RM).

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
        Hash --> Find[Find Existing RM by _id]
        Find --> GetOld[Get Old RMID]
        GetOld --> UpdateLogin[Update Login Collection]
        UpdateLogin --> UpdateMapped[Update Mapped RM Schema]
    end

    UpdateMapped --> Success[Prepare Success Response]
    Success --> Response200([Return 200 OK: Update Successfully])
    
    UpdateMapped -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/user/edit-rm
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "_id": "60d5ec49f1b2c82a8c8e1234",
    "rm": "Updated RM Name",
    "mobile": "9876543210",
    "email": "updated.rm@example.com",
    "rmid": "RM999",
    "password": "newpassword123"
}
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Update Successfully."
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
