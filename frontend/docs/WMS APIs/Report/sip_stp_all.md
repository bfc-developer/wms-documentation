# SIP/STP All Transactions
Retrieves all SIP (Systematic Investment Plan) or STP (Systematic Transfer Plan) transactions within a specified date range, with optional RM (Relationship Manager) filtering. The API aggregates transaction data from both CAMS and KARVY registrars, applies RM-based access control, filters by transaction type (SIP/STP), sorts by trade date, and returns the complete transaction list. This endpoint requires authentication via a bearer token.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request[Receive POST Request]
    
    Request --> VerifyToken{Verify Token}
    VerifyToken -->|Invalid| Response401([Return 401: Unauthorized])
    
    VerifyToken -->|Valid| ExtractTokenData[Extract RMID from Token]
    
    ExtractTokenData --> ValidateInput{Validate Dates}
    ValidateInput -->|Missing startDate or endDate| Response400([Return 400: Invalid request or missing fields])
    
    ValidateInput -->|Valid| BuildDateRange[Build Date Range from startDate and endDate]
    
    BuildDateRange --> BuildRMFilter[Build RM Filter based on Token RMID and Request RMID]
    
    BuildRMFilter --> QueryBothRTAs[Query CAMS and KARVY in Parallel with trans_type Filter]
    
    subgraph Parallel_Queries ["Parallel RTA Queries"]
        QueryCAMS[Query trans_cams with RM, Date, and DESC Filter]
        QueryKARVY[Query trans_karvy with RM, Date, and DESC Filter]
    end
    
    QueryBothRTAs --> QueryCAMS
    QueryBothRTAs --> QueryKARVY
    
    QueryCAMS --> MergeData[Merge CAMS and KARVY Data]
    QueryKARVY --> MergeData
    
    MergeData --> CheckData{Data Found?}
    CheckData -->|No| Response404([Return 404: No data found])
    
    CheckData -->|Yes| SortByDate[Sort Transactions by Trade Date]
    
    SortByDate --> PreparePayload[Prepare Payload with length and allData]
    
    PreparePayload --> Response200([Return 200: Success with SIP/STP Transactions])
    
    Request -.Error.-> HandleError[Catch Error]
    HandleError --> Response500([Return 500: Internal Server Error])
```

### Method
```
POST
```

### Route
```
/sip-stp-all
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "trans_type": "SIP",
    "rmid": 123
}
```

### Parameters
| Name | Type | Description |
|------|------|-------------|
| startDate | String | **Required**. The start date for the transaction range (format: YYYY-MM-DD). |
| endDate | String | **Required**. The end date for the transaction range (format: YYYY-MM-DD). |
| trans_type | String | **Required**. The transaction type to filter - either "SIP" or "STP". |
| rmid | Number | **Optional**. The Relationship Manager ID to filter transactions. If not provided, uses the RMID from the authentication token. |

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Success",
    "payload": {
        "length": 3,
        "allData": [
            {
                "INVNAME": "John Doe",
                "FOLIO": "1234567/89",
                "SCHEME": "HDFC Equity Fund",
                "TRXNNO": "SIP001",
                "TRADDATE": "2024-06-15",
                "UNITS": 10.50,
                "AMOUNT": 5000,
                "TRXNTYPE": "Purchase",
                "DESC": "SIP",
                "PAN": "ABCDE1234F",
                "RMID": 123,
                "RM": "RM Name"
            },
            {
                "INVNAME": "Jane Doe",
                "FOLIO": "9876543/21",
                "SCHEME": "ICICI Prudential Balanced Fund",
                "TRXNNO": "SIP002",
                "TRADDATE": "2024-07-15",
                "UNITS": 10.25,
                "AMOUNT": 5000,
                "TRXNTYPE": "Purchase",
                "DESC": "SIP",
                "PAN": "XYZAB5678C",
                "RMID": 123,
                "RM": "RM Name"
            },
            {
                "INVNAME": "Robert Smith",
                "FOLIO": "5555555/55",
                "SCHEME": "SBI Bluechip Fund",
                "TRXNNO": "SIP003",
                "TRADDATE": "2024-08-15",
                "UNITS": 10.00,
                "AMOUNT": 5000,
                "TRXNTYPE": "Purchase",
                "DESC": "SIP",
                "PAN": "PQRST9876Z",
                "RMID": 123,
                "RM": "RM Name"
            }
        ]
    }
}
```

### Response `Status: (400)`
```json
{
    "status": false,
    "message": "Invalid request or missing fields"
}
```

### Response `Status: (401)`
```json
{
    "status": false,
    "message": "Unauthorized"
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
    "message": "Error message details"
}
```

## API Behavior Details

### Authentication & Authorization
- **Token Required**: This endpoint requires a valid bearer token
- **Token Data**: The token contains the user's RMID (Relationship Manager ID)
- **Access Control**: RM filter is built based on the authenticated user's RMID

### RM Filter Logic
The `buildRMFilter()` function determines which transactions the user can access:
- If `rmid` is provided in the request body, it's used for filtering (subject to user permissions)
- If `rmid` is not provided, the RMID from the authentication token is used
- This ensures users only see transactions they're authorized to access

### Transaction Type Filtering
- **DESC Field**: Filters transactions by the `DESC` field which contains transaction description
- **Common Values**: 
  - `"SIP"` - Systematic Investment Plan transactions
  - `"STP"` - Systematic Transfer Plan transactions
- **Filter Application**: Applied to both CAMS and KARVY queries via the pipeline

### Data Aggregation
1. **Parallel Queries**: Simultaneously queries both CAMS and KARVY collections
2. **Pipeline**: Uses `buildPipelineAll()` to construct aggregation pipelines with:
   - RM filter for access control
   - Date range filter (start to end)
   - Transaction type filter (`DESC: trans_type`)
   - RTA-specific field mappings
3. **Merge**: Combines results from both RTAs into a single array

### Data Processing
1. **Sorting**: All transactions are sorted by trade date (`TRADDATE`) in chronological order
2. **Response Format**: Returns the total count and complete transaction array
3. **No Grouping**: Returns a flat list of all matching transactions

### Collections Queried
- **trans_cams**: CAMS transaction collection
- **trans_karvy**: KARVY transaction collection

### Helper Functions Used
- `buildDateRange(startDate, endDate)`: Converts date strings to date range objects
- `buildRMFilter(tokenRMID, requestRMID)`: Constructs RM-based access control filter
- `buildPipelineAll()`: Creates aggregation pipeline for querying all transactions with additional filters
- `sortByTradDate()`: Sorts transaction array by trade date in ascending order

### Key Differences from `/all-transaction`
1. **Transaction Type Filter**: Includes `trans_type` parameter to filter by SIP/STP
2. **DESC Field**: Filters on transaction description field
3. **Use Case**: Specifically designed for systematic transaction reporting

### Use Cases
- Generate SIP transaction reports for a specific period
- Monitor STP activities within a date range
- Track systematic investment patterns
- RM-specific SIP/STP reporting and analysis
- Compliance reporting for systematic transactions
- Client SIP/STP portfolio analysis

### Response Fields
- **INVNAME**: Full name of the investor
- **FOLIO**: Folio number
- **SCHEME**: Scheme name
- **TRXNNO**: Transaction number
- **TRADDATE**: Trade date
- **UNITS**: Number of units
- **AMOUNT**: Transaction amount
- **TRXNTYPE**: Transaction type (Purchase, Redemption, etc.)
- **DESC**: Transaction description (SIP, STP, etc.)
- **PAN**: Permanent Account Number
- **RMID**: Relationship Manager ID
- **RM**: Relationship Manager name
- **length**: Total number of transactions found
