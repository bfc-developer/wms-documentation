# Get Users
Retrieve a list of all users with their associated Relationship Manager (RM) and IIN status details.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive GET Request}
    Request --> Pipeline[Start Aggregation Pipeline]
    
    subgraph Aggregation[Aggregation Logic]
        Pipeline --> LookupRM[Lookup 'mapped_rm']
        LookupRM -- Match PAN & (Guard PAN or False) --> LookupIIN[Lookup 'user_NSE_IIN']
        LookupIIN -- Match PAN & Status 'YES' --> LookupTemp[Lookup 'tempiin']
        LookupTemp -- Match PAN --> AddFields[Add Fields: rm, IIN, IINdetail]
        AddFields --> Project[Project & Sort by createdAt]
    end

    Project --> Check{Users Found?}
    Check -- Yes --> Success[Prepare Success Payload]
    Success --> Response200([Return 200 OK: User list fetched])
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
/user/get-user
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
GET: https://localhost:3000/user/get-user
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Success",
    "payload": {
        "length": 1,
        "userList": [
            {
                "name": "John Doe",
                "mobileNo": "1234567890",
                "PAN": "ABCDE1234F",
                "city": "New York",
                "address": "123 Street Name",
                "country": "Country Name",
                "userEmail": "john.doe@example.com",
                "createdAt": "2024-01-01T10:00:00.000Z",
                "rm": "RM Name",
                "IIN": true,
                "IINdetail": false
            }
        ]
        ...
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
