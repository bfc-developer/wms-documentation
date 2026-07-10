# Update Usermaster AUM
Calculates and updates the Assets Under Management (AUM) for all users in the User Master collection by aggregating data from their portfolios.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive GET Request}
    
    Request --> Aggregate[Aggregate User Master]
    
    Aggregate --> Lookup[Lookup Portfolio Data]
    
    subgraph Portfolio_Calculation
        Lookup --> MatchUser[Match User ID]
        MatchUser --> SumValue[Sum Current Value]
        SumValue --> Group[Group by User]
    end
    
    Lookup --> AddFields[Add AUM Field]
    AddFields --> Project[Project Required Fields]
    
    Project --> Merge[Merge into New User Master]
    
    Merge --> Response200([Return 200 OK: Updated Successfully])
    
    Aggregate -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
GET
```

### Route
```
/user/update-usermaster-aum
```

### Authorization
```
None
```

### Parameters
| Name | Type | Description |
|------|------|-------------|
| None | - | - |

### Sample Request
```http
GET: https://<host>/user/update-usermaster-aum
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Updated Successfully"
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
