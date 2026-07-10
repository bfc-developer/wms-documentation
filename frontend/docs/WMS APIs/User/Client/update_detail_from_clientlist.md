# Update Detail From Clientlist
Update specific details of a user/client such as email, mobile, address, city, pincode, and DOB.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    Request --> Verify[Verify Token]
    
    Verify -- Valid --> Validate{Validate Schema}
    Verify -- Invalid --> Response401([Return 401 Unauthorized])
    
    Validate -- Valid --> PrepareUpdates[Prepare Update Fields]
    Validate -- Invalid --> Response400([Return 400 Bad Request])
    
    PrepareUpdates --> UpdateDB[Update User Master]
    
    UpdateDB --> CheckResult{User Found?}
    
    CheckResult -- Yes --> Response200([Return 200 OK: Updated Successfully])
    CheckResult -- No --> Response404([Return 404: User not found])
    
    UpdateDB -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/user/update-clientlist-detail
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "userid": "USER12345",
    "email": "newemail@example.com",
    "mobile": "9876543210",
    "add1": "Address Line 1",
    "add2": "Address Line 2",
    "add3": "Address Line 3",
    "city": "New City",
    "pincode": "654321",
    "dob": "1995-05-15"
}
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Updated Successfully"
}
```

### Response `Status: (404)`
```json
{
    "status": false,
    "message": "User not found"
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
