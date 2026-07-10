# Get Family Portfolio
Retrieves aggregated portfolio data for all family members linked to a given PAN, including calculations for current value, purchase value, CAGR, gain/loss, and absolute returns.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    Request --> Validate{Validate Schema}
    
    Validate -- Valid --> GetPans[Get All Linked PANs]
    Validate -- Invalid --> Response400([Return 400 Bad Request])
    
    GetPans --> Aggregate[Aggregate Portfolio Data]
    
    subgraph Aggregation_Pipeline
        Aggregate --> Match1[Match Linked PANs]
        Match1 --> Match2[Filter Units > 0]
        Match2 --> Group[Group by Name]
        Group --> CalcBasic[Calculate CV, Purchase, Days]
        CalcBasic --> CalcGainLoss[Calculate Gain/Loss]
        CalcGainLoss --> CalcRatios[Calculate CV/PV Ratio]
        CalcRatios --> CalcDays[Calculate Days/365]
        CalcDays --> CalcPower[Calculate Power for CAGR]
        CalcPower --> CalcAbs[Calculate Absolute Return]
        CalcAbs --> CalcCAGR[Calculate CAGR]
        CalcCAGR --> Project[Project Final Fields]
        Project --> Sort[Sort by Name]
    end
    
    Sort --> CheckResult{Data Found?}
    
    CheckResult -- Yes --> Response200([Return 200 OK: Success])
    CheckResult -- No --> Response404([Return 404: No data found])
    
    Aggregate -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/get-family-portfolio
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "pan": "ABCDE1234F"
}
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Success",
    "payload": {
        "familyPortfolio": [
            {
                "Gpan": "ABCDE1234F",
                "Pan": "ABCDE1234F",
                "Name": "Client Name",
                "Totalpurchase": 100000.50,
                "TotalMarketValue": 125000,
                "Cagr": 12.50,
                "Gainloss": 24999,
                "days": 730,
                "absoluteReturn": 25.00
            },
            {
                "Gpan": "ABCDE1234F",
                "Pan": "FGHIJ5678K",
                "Name": "Family Member Name",
                "Totalpurchase": 50000.25,
                "TotalMarketValue": 55000,
                "Cagr": 8.75,
                "Gainloss": 5000,
                "days": 365,
                "absoluteReturn": 10.00
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
