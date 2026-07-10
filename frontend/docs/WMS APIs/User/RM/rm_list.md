# Get RM List
Retrieve a list of Relationship Managers (RMs) with their contact details.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive GET Request}
    Request --> Verify[Verify Token]
    
    Verify -- Valid --> Query[Query Database]
    Verify -- Invalid --> Response401([Return 401 Unauthorized])

    subgraph DB_Operation[Database Operation]
        Query --> Find[Find Users where USERTYPE='rm']
        Find --> Select[Select NAME, RMID, MOBILE, EMAIL]
        Select --> Sort[Sort by NAME]
    end

    Sort --> Success[Prepare Success Payload]
    Success --> Response200([Return 200 OK: RM list fetched])
    
    Query -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
GET
```

### Route
```
/user/rm-list
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
GET /user/rm-list HTTP/1.1
Host: <host>
Authorization: Bearer <token>
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Success",
    "payload": {
        "list": [
            {
                "_id": "60d5ec49f1b2c82a8c8e1234",
                "NAME": "RM Name",
                "RMID": "RM123",
                "MOBILE": "9876543210",
                "EMAIL": "rm@example.com"
            }
        ]
    }
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
