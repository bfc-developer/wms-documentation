# Delete Transaction
Deletes specific transaction records for a given folio and product code. It performs a soft backup of the deleted transactions into the `karvycamsfolioproductcode` collection before deletion. After deletion, it either triggers a synchronization (if transactions remain) or resets the portfolio values to zero (if no transactions remain).

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    
    Request --> Validate{Validate Schema}
    Validate -- Invalid --> Response400([Return 400 Bad Request])
    Validate -- Valid --> MapRTA[Map RTA Specific Fields]
    
    MapRTA --> CheckIDs{Check if All IDs Exist}
    CheckIDs -- Missing --> Response400ID([Return 400: Some IDs do not exist])
    
    CheckIDs -- All Exist --> CheckFP{Check Folio/Product}
    CheckFP -- Invalid --> Response400FP([Return 400: Invalid folio/product])
    
    CheckFP -- Valid --> Backup[Aggregate & Merge to karvycamsfolioproductcode]
    
    Backup --> DeleteOps[Delete Transactions from DB]
    
    DeleteOps --> CheckRemaining{Transactions Remaining?}
    
    CheckRemaining -- Yes --> CheckStatus{Status?}
    
    CheckStatus -- Active --> SyncActive[Trigger Sync Active]
    CheckStatus -- Liquidated --> SyncLiq[Trigger Sync Liquidated]
    
    CheckRemaining -- No --> ZeroPortfolio[Reset foliowisePortfolio to Zero]
    
    SyncActive & SyncLiq & ZeroPortfolio --> Response200([Return 200 OK: Success])
    
    Request -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/delete-transaction
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "ids": ["60d5ecb8b4873434788b4567", "60d5ecb8b4873434788b4568"],
    "rta": "CAMS",
    "status": "Active",
    "folio": "12345/67",
    "product": "P001"
}
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Success"
}
```

### Response `Status: (400)`
```json
{
    "status": false,
    "message": "Some transaction IDs do not exist in database"
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
