# Login Via Email
Authenticate a user using email and password.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    Request --> Validate[Validate Request Body: email, password]
    Validate --> FindUser[Find User by RMID]
    FindUser -- User Found --> ComparePass{Compare Password}
    FindUser -- User Not Found --> Response404([Return 404: Invalid UserID or Password])
    
    ComparePass -- Match --> GenerateToken[Generate JWT Token]
    ComparePass -- No Match --> Response404
    
    GenerateToken --> PreparePayload[Prepare User Data Payload]
    PreparePayload --> Response200([Return 200 OK: Loggedin Successfully])
    
    FindUser -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/login-user
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Loggedin Successfully",
    "payload": {
        "userData": {
            "userrole": "ADMIN",
            "name": "John Doe",
            "token": "eyJhbGciOiJIUzI1NiIsInR...",
            "rmid": "user@example.com"
        }
    }
}
```

### Response `Status: (404)`
```json
{
    "status": false,
    "message": "Invalid UserID or Password"
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
