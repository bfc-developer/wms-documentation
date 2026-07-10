# Get Client List
Retrieve a paginated, filtered, and sorted list of clients. Support filtering by various fields and family head.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    Request --> Verify[Verify Token]

    Verify -- Valid --> InitParams[Init Page/Limit/Filters]
    Verify -- Invalid --> Response401([Return 401 Unauthorized])

    InitParams --> BuildQuery[Build Match Query]
    
    subgraph QueryBuilder
        BuildQuery --> CheckFilters{Check Filters}
        CheckFilters -- FamilyHead --> GetFamily[Get Family IDs]
        GetFamily --> AddFamilyFilter[Add $in Filter]
        CheckFilters -- Other --> AddRegex[Add Regex/Value Filter]
        
        AddFamilyFilter --> SortLogic[Determine Sort Order]
        AddRegex --> SortLogic
    end

    SortLogic --> ExecQuery[Execute Aggregation]

    subgraph DB_Operation
        ExecQuery --> Count[Count Total Documents]
        ExecQuery --> Fetch[Fetch Page Data]
        Fetch --> ConcatAddr[Concat Address Fields]
    end

    Fetch --> CheckRes{Data Found?}
    CheckRes -- No --> Response404([Return 404: No data found])
    CheckRes -- Yes --> Success[Prepare Success Payload]
    
    Success --> Response200([Return 200 OK: Client List])
    
    ExecQuery -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/user/client-list
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "page": 1,
    "limit": 10,
    "filters": {
        "folioname": "John",
        "pan": "ABCDE1234F",
        "rm": "RM123",
        "familyHead": "UserId123",
        "address": "Street",
        "gpan": "ABCDE1234F",
        "mobile": "9876543210",
        "email": "john@example.com",
        "city": "New York",
        "pincode": "10001"
    },
    "isAdmin": false,
    "order": "asc",
    "orderBy": "folioname"
}
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Client list found successful",
    "payload": {
        "length": 1,
        "total": 50,
        "clientList": [
            {
                "userid": "user123",
                "folioname": "John Doe",
                "pan": "ABCDE1234F",
                "add1": "123 Street Name Apt 4",
                "mobile": "9876543210",
                "email": "john@example.com",
                "rmid": "RM123",
                "familyhead": "head123"
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
