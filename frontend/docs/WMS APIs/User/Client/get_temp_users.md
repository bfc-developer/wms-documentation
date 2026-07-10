# Get Temp Users
Retrieve a list of temporary users (registrations with OTP/unverified status).

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive GET Request}
    Request --> Pipeline[Start Aggregation Pipeline]
    
    subgraph Aggregation[Aggregation Logic]
        Pipeline --> Project["Project Fields: mobileNo, email, createdAt, otp"]
        Project --> Sort["Sort by createdAt (Desc)"]
    end

    Sort --> Check{Temp Users Found?}
    Check -- Yes --> Success[Prepare Success Payload]
    Success --> Response200([Return 200 OK: Data found])
    Check -- No --> Response404([Return 404 Not Found: No data found])
    
    Pipeline -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
GET
```

### Route
```
/user/get-temp-user
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
GET: https://localhost:3000/user/get-temp-user
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Success",
    "payload": {
        "tempUserList": [
            {
                "mobileNo": "1234567890",
                "userEmail": "temp.user@example.com",
                "createdAt": "2024-01-01T10:00:00.000Z",
                "otp": "1234"
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
