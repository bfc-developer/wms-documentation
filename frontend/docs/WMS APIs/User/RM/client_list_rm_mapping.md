# Client List RM Mapping
Map a Relationship Manager (RM) to a list of clients and their family members.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    Request --> Verify[Verify Token]
    
    Verify -- Valid --> Validate{Validate Schema}
    Verify -- Invalid --> Response401([Return 401 Unauthorized])
    
    Validate -- Valid --> CheckFamily{Check Family & Admin Status}
    Validate -- Invalid --> Response400([Return 400 Bad Request])
    
    CheckFamily -- "Blank Family & Not Admin" --> Response404RM([Return 404: No rm alloted])
    
    CheckFamily -- Valid --> Flatten[Collect All Client & Family IDs]
    Flatten --> UpdateAll[Update DB Collections]
    
    subgraph Update_Operations
        UpdateAll --> UpdateUser[Update User Master]
        UpdateAll --> UpdateFolioK[Update Folio Karvy]
        UpdateAll --> UpdateFolioC[Update Folio Cams]
        UpdateAll --> UpdatePortfolio[Update Portfolio]
        UpdateAll --> UpdateTransc[Update Transc]
        UpdateAll --> UpdateTransk[Update Transk]
        UpdateAll --> UpdateMapped[Update Mapped RM]
    end
    
    UpdateMapped --> CheckMissing{Check Missing Mappings}
    CheckMissing -- "Missing IDs Found" --> FindMissing[Find Missing Users]
    FindMissing --> InsertNew[Insert New Mapped Records]
    InsertNew --> CalcModified[Calculate Total Modified]
    
    CheckMissing -- "No Missing IDs" --> CalcModified
    
    CalcModified --> CheckTotal{Total Modified > 0?}
    CheckTotal -- Yes --> Response200([Return 200 OK: Mapped Successfully])
    CheckTotal -- No --> Response404Update([Return 404: No records updated])
    
    UpdateAll -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/user/client-list-rm-mapping
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "clientIds": ["USER123", "USER456"],
    "rm": "RM Name",
    "rmId": "RM001"
}
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Mapped Successfully 7 records updated",
    "payload": {
        "totalmodified": 7
    }
}
```

### Response `Status: (404)`
```json
{
    "status": false,
    "message": "No rm alloted"
}
```
OR
```json
{
    "status": false,
    "message": "No records updated"
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
