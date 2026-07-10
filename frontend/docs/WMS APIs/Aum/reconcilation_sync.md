# Sync from AUM Reconciliation
Syncs reconciliation data from AUM inputs into the consolidated `karvycams` collection. It processes a list of records, maps them to the required format, performs bulk upsert operations, and triggers liquidation syncs for the specific RTA found in the data.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    
    Request --> Verify[Verify Token]
    
    Verify -- Valid --> ValidateSchema[Validate Request Schema]
    Verify -- Invalid --> Response401([Return 401 Unauthorized])
    
    ValidateSchema -- Valid --> CheckArray{Data Array<br/>Valid?}
    ValidateSchema -- Invalid --> Response400A([Return 400 Bad Request])
    
    CheckArray -- Empty/Invalid --> Response400B([Return 400: No data provided])
    CheckArray -- Valid --> MapData[Map Data Fields]
    
    MapData --> PrepareBulk[Prepare Bulk Upsert Operations]
    
    PrepareBulk --> ExecuteBulk[Execute Bulk Write to karvycams]
    
    ExecuteBulk --> CheckRTA{Check RTA of<br/>First Record}
    
    CheckRTA -- KARVY --> SyncKarvy[Execute syncKarvyLiquidatedScheme]
    CheckRTA -- CAMS --> SyncCams[Execute syncCamsLiquidatedScheme]
    CheckRTA -- Other --> Response200
    
    SyncKarvy --> Response200([Return 200 OK: Successfully sync])
    SyncCams --> Response200
    
    Request -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/reconcilation-sync
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "data": [
        {
            "folio": "12345/67",
            "product": "P001",
            "rta": "CAMS",
            "foliowise_appicant": "Investor Name",
            "gpan": "ABCDE1234F",
            "pan": "ABCDE1234F",
            "schemecode": "S001",
            "rm": "RM Name",
            "rmid": "RM001",
            "ASSETTYPE": "Equity",
            "SCHEME": "Scheme Name"
        }
    ]
}
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Successfully sync"
}
```

### Response `Status: (400)`
```json
{
    "status": false,
    "message": "No data provided for sync"
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
