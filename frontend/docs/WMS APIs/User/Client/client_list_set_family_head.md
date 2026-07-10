# Client List Set Family Head
Set a user as the Family Head and map other family members to them.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    Request --> Verify[Verify Token]
    
    Verify -- Valid --> Validate{Validate Schema}
    Verify -- Invalid --> Response401([Return 401 Unauthorized])
    
    Validate -- Valid --> Detach[Detach Users from Existing Families]
    Validate -- Invalid --> Response400([Return 400 Bad Request])
    
    Detach --> CheckUserIds{User IDs Provided?}
    
    CheckUserIds -- No --> SetSingleHead[Set User as Independent Family Head]
    SetSingleHead --> Response200([Return 200 OK: Successful])
    
    CheckUserIds -- Yes --> FetchMembers[Fetch Details of User IDs]
    FetchMembers --> FetchHead[Fetch Current Family Head Details]
    
    FetchHead --> Merge[Merge Existing & New Family Members]
    Merge --> UpdateHead[Update Family Head Record]
    UpdateHead --> UpdateMembers[Update Members' Family Head Field]
    
    UpdateMembers --> CleanupChildren[Cleanup Previous Children of Members]
    CleanupChildren --> DemoteAdmins[Demote Members from Admin Status]
    
    DemoteAdmins --> Response200
    
    UpdateHead -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/user/client-list-set-family-head
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "familyHead": {
        "userId": "UserHead123",
        "name": "Head Name"
    },
    "userids": ["Member1", "Member2"]
}
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Successful"
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
