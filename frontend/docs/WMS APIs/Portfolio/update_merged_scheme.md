# Update Merged Scheme
Updates scheme information across CAMS and KARVY collections when schemes have been merged. Fetches merged scheme data from the last 200 days, identifies affected folios, retrieves new scheme details, and performs bulk updates across folio, transaction, and portfolio collections for both RTAs.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive GET Request}
    
    Request --> FetchMerged[Fetch Merged Schemes from Last 200 Days]
    
    FetchMerged --> CheckData{Data Found?}
    
    CheckData -- No --> Response404([Return 404: No data update])
    CheckData -- Yes --> ExtractCodes[Extract Scheme Codes & Merged Codes]
    
    ExtractCodes --> ParallelFolio[Query Folios in Parallel]
    
    subgraph Folio_Queries
        ParallelFolio --> QueryCamsFolio[Query folio_cams by ACCORD_SCHEMECODE]
        ParallelFolio --> QueryKarvyFolio[Query folio_karvy by ACCORD_SCHEMECODE]
    end
    
    QueryCamsFolio & QueryKarvyFolio --> ExtractUnique[Extract Unique Scheme Codes]
    
    ExtractUnique --> ParallelScheme[Query Scheme Details in Parallel]
    
    subgraph Scheme_Queries
        ParallelScheme --> QueryCamsScheme[Query scheme_details for CAMS]
        ParallelScheme --> QueryKarvyScheme[Query scheme_details for KARVY]
        ParallelScheme --> QueryMergedScheme[Query scheme_details for Merged]
    end
    
    QueryCamsScheme & QueryKarvyScheme & QueryMergedScheme --> BuildMap[Build Merged Scheme Map]
    
    BuildMap --> PrepareBulk[Prepare Bulk Update Operations]
    
    subgraph Bulk_Preparation
        PrepareBulk --> PrepCamsFolio[Prepare folio_cams Updates]
        PrepareBulk --> PrepCamsTrans[Prepare trans_cams Updates]
        PrepareBulk --> PrepCamsPort[Prepare Portfolio CAMS Updates]
        PrepareBulk --> PrepKarvyFolio[Prepare folio_karvy Updates]
        PrepareBulk --> PrepKarvyTrans[Prepare trans_karvy Updates]
        PrepareBulk --> PrepKarvyPort[Prepare Portfolio KARVY Updates]
    end
    
    PrepCamsFolio & PrepCamsTrans & PrepCamsPort & PrepKarvyFolio & PrepKarvyTrans & PrepKarvyPort --> ExecuteBulk[Execute Bulk Writes in Parallel]
    
    subgraph Bulk_Execution
        ExecuteBulk --> UpdateCamsFolio[Update folio_cams]
        ExecuteBulk --> UpdateCamsTrans[Update trans_cams]
        ExecuteBulk --> UpdateCamsPort[Update folioWise_portfolio CAMS]
        ExecuteBulk --> UpdateKarvyFolio[Update folio_karvy]
        ExecuteBulk --> UpdateKarvyTrans[Update trans_karvy]
        ExecuteBulk --> UpdateKarvyPort[Update folioWise_portfolio KARVY]
    end
    
    UpdateCamsFolio & UpdateCamsTrans & UpdateCamsPort & UpdateKarvyFolio & UpdateKarvyTrans & UpdateKarvyPort --> LogResults[Log Update Results]
    
    LogResults --> Response200([Return 200 OK: Success with Counts])
    
    Request -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
GET
```

### Route
```
/update-merged-scheme
```

### Authorization
```
Bearer <token>
```

### Parameters
| Name | Type | Description |
|------|------|-------------|
| None | - | - |

### Sample Request
```http
GET: https://<host>/update-merged-scheme
```

### Response `Status: (200)`
```json
{
    "success": true,
    "message": "Successfully updated schemes",
    "foliocModified": 15,
    "transcModified": 120,
    "portfoliocModified": 15,
    "foliokModified": 8,
    "transkModified": 65,
    "portfoliokModified": 8
}
```

### Response `Status: (404)`
```json
{
    "status": false,
    "message": "No data update"
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
