# Export All Data
Export all client data matching specific filters without pagination, suitable for reporting or downloading.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    Request --> Verify[Verify Token]

    Verify -- Valid --> InitParams[Init Filters/Sort]
    Verify -- Invalid --> Response401([Return 401 Unauthorized])

    InitParams --> BuildQuery[Build Match Query]
    
    subgraph QueryBuilder
        BuildQuery --> CheckFilters{Check Filters}
        CheckFilters -- FamilyHead --> GetFamily[Get Family IDs]
        GetFamily --> AddFamilyFilter["Add $in Filter"]
        CheckFilters -- Other --> AddRegex[Add Regex/Value Filter]
        
        AddFamilyFilter --> SortLogic[Determine Sort Order]
        AddRegex --> SortLogic
    end

    SortLogic --> ExecQuery[Execute Find Query]

    subgraph DB_Operation
        ExecQuery --> Find["Find Users (No Pagination)"]
        Find --> Select["Select Fields (Exclude _id, userid, familymember)"]
        Select --> Sort[Sort Results]
    end

    Sort --> CheckRes{Data Found?}
    CheckRes -- No --> Response404([Return 404: No data found])
    CheckRes -- Yes --> Success[Prepare Success Payload]
    
    Success --> Response200([Return 200 OK: Export List])
    
    ExecQuery -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/user/export-all
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
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
    "message": "Successful",
    "payload": {
        "length": 50,
        "userList": [
            {
                "folioname": "John Doe",
                "pan": "ABCDE1234F",
                "add1": "123 Street Name",
                "mobile": "9876543210",
                "email": "john@example.com",
                "rmid": "RM123",
                "familyhead": "head123",
                "city": "New York",
                "pincode": "10001"
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
