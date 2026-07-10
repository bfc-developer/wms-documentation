# Update Scheme Name
Updates scheme names and statuses across folios, transactions, and portfolios based on recent changes recorded in the `scheme_namechange` collection (data from the last 40 days).

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive GET Request}
    
    Request --> FetchChanges[Fetch schemes from scheme_namechange where Effectivedate > 40 days ago]
    
    FetchChanges --> CheckData{Data Found?}
    CheckData -- No --> Response404([Return 404: No data found to update])
    
    CheckData -- Yes --> ExtractCodes[Extract Unique SchemeCodes]
    
    ExtractCodes --> ParallelFolio[Query CAMS and KARVY Folios for matching SchemeCodes]
    
    ParallelFolio --> ExtractUnique[Extract Unique SchemeCodes from found Folios]
    
    ExtractUnique --> FetchDetails[Fetch s_name, amfi_name, status from scheme_detail]
    
    FetchDetails --> PrepareUpdates[Prepare Bulk Updates for Folios, Transactions, and Portfolio]
    
    PrepareUpdates --> ExecuteBulk[Execute Parallel Bulk Writes to DB]
    
    subgraph Parallel_Bulk_Execution
        ExecuteBulk --> UpdateFolioc[Update folioc]
        ExecuteBulk --> UpdateTransc[Update transc]
        ExecuteBulk --> UpdatePortfolioc[Update portfolio CAMS]
        ExecuteBulk --> UpdateFoliok[Update foliok]
        ExecuteBulk --> UpdateTransk[Update transk]
        ExecuteBulk --> UpdatePortfoliok[Update portfolio KARVY]
    end
    
    UpdateFolioc & UpdateTransc & UpdatePortfolioc & UpdateFoliok & UpdateTransk & UpdatePortfoliok --> Response200([Return 200: Successfully updated schemes with counts])
    
    Request -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
GET
```

### Route
```
/update-cams-schemename
```

### Authorization
```
Bearer <token>
```

### Sample Request
```http
GET: https://<host>/update-cams-schemename
```

### Response `Status: (200)`
```json
{
    "success": true,
    "message": "Successfully updated schemes",
    "foliocModified": 5,
    "transcModified": 10,
    "portfoliocModified": 5,
    "foliokModified": 2,
    "transkModified": 4,
    "portfoliokModified": 2
}
```

### Response `Status: (404)`
```json
{
    "status": false,
    "message": "No data found to update"
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
