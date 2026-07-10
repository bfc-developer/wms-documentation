# User Via Name
Search for users by name, PAN, mobile number, or email using a regex match.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    Request --> Validate[Validate Request Body: Extract 'name']
    Validate --> Query[Query Users Collection]
    Query -- Match name, PAN, mobileNo, or email --> Check{Users Found?}
    Check -- Yes --> Success[Prepare Success Payload]
    Success --> Response200([Return 200 OK: Users found successfully])
    Check -- No --> Response404([Return 404 Not Found: No data found])
    Query -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/user/user-via-name
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "name": "search_term"
}
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Users found successfully",
    "payload": {
        "userList": [
            {
                "name": "John Doe",
                "mobileNo": "1234567890",
                "PAN": "ABCDE1234F",
                "city": "New York",
                "address": "123 Street Name",
                "country": "Country Name",
                "userEmail": "john.doe@example.com",
                "createdAt": "2024-01-01T10:00:00.000Z"
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
