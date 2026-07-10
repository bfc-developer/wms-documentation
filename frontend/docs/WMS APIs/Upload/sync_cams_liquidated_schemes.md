# Sync CAMS Liquidated Schemes

This API identifies and synchronizes liquidated schemes from CAMS portfolios. It isolates liquidated folios, calculates their detailed performance metrics using FIFO logic, and updates the central portfolio collection with the finalized data.

### User flow diagram

```mermaid
graph TD
    Start([Start]) --> MatchLiquidated["Match Liquidated Status in folioc"]
    MatchLiquidated --> ProjectData["Project Folio & Scheme Details"]
    ProjectData --> MergeStaging["Merge into karvycamsfolioproductcode<br>(Staging Collection)"]
    
    MergeStaging --> AggStaging["Aggregate karvycams (Staging)"]
    AggStaging --> LookupNav["Lookup Liquidated Current NAV"]
    LookupNav --> LookupTrans["Lookup Transactions (trans_cams)"]
    LookupTrans --> CalcMetrics["Calculate FIFO, Units, CAGR, Abs Return,<br>Market Value"]
    
    CalcMetrics --> MergePortfolio["Merge into foliowisePortfolio<br>(Final Portfolio Collection)"]
    MergePortfolio --> CleanStaging["Delete All from karvycams"]
    CleanStaging --> End([End])
```

### Method
```
GET
```

### Route
```
/sync-cams-liquidated-schemes
```

### Authorization
```
Bearer <token>
```

### Parameters
None.

### Request Body
```json
{}
```

### Response `Status: (200)`
```json
{
    "success": true,
    "message": "Sync Successfully"
}
```

### Response `Status: (500)`
```json
{
    "success": false,
    "message": "<Error Message>"
}
```
