# Upload SIP Karvy Expiry
This API processes Karvy SIP (Systematic Investment Plan) expiry and registration data. It uploads raw data into a staging collection (`sip_karvy_expiry_dump`) and then processes it into the main `sipExpiry` collection. The API handles two distinct data formats/types: records with a `SIPFLAG` (typically expiries or modifications) and records with a `TRTYPE` (typically registrations).

### User flow diagram
```mermaid
graph TD
    Start([Start]) --> ClearDump[Delete All Data in sip_karvy_expiry_dump]
    ClearDump --> InsertData[Insert Bulk Data into sip_karvy_expiry_dump]
    InsertData --> ProcessSipFlag[Process Records with SIPFLAG<br/>Expiries or Mods]
    InsertData --> ProcessTrType[Process Records with TRTYPE<br/>Registrations]
    
    subgraph "Processing Logic"
        ProcessSipFlag --> MatchFolio1[Match Folio Details]
        ProcessTrType --> MatchFolio2[Match Folio Details]
        
        MatchFolio1 --> FormatDates1[Format Dates and Parse<br/>Start, End, Term, Reg]
        MatchFolio2 --> FormatDates2[Format Dates and Parse<br/>Start, End, Term, Reg]
        
        FormatDates1 --> TrTypeLogic1[Derive TRTYPE from SIPFLAG<br/>SIP STP SWP]
        FormatDates2 --> TrTypeLogic2[Use Existing TRTYPE]
        
        TrTypeLogic1 --> LinkFamily1[Link Family PANs]
        TrTypeLogic2 --> LinkFamily2[Link Family PANs]
        
        LinkFamily1 --> Merge[Merge into sipExpiry]
        LinkFamily2 --> Merge
    end

    Merge --> End([End])
```

### Method
```
POST
```

### Route
```
/upload/upload-sip-karvy-expiry
```
*(Note: Route prefix `/upload` assumed based on project structure. The route defined in code is `/upload-sip-karvy-expiry` relative to the router).*

### Authorization
```
Bearer <token>
```

### Parameters
None.

### Request Body
```json
{
    "uploaddata": [
        {
            "ACNO": "String",
            "PRODCODE": "String",
            "AMOUNT": "Number/String",
            "STARTDATE": "DD/MM/YYYY",
            "ENDDATE": "DD/MM/YYYY",
            "TERMDATE": "DD/MM/YYYY",
            "SIPREGDT": "DD/MM/YYYY",
            "REGDATE": "DD/MM/YYYY",
            "SIPFLAG": "String (Optional)",
            "TRTYPE": "String (Optional)",
            "IHNO": "String",
            "INVNAME": "String",
            "FREQ": "String"
            // ... other fields
        }
    ]
}
```

### Response `Status: (200)`
```json
{
    "success": true,
    "message": "Successfully uploaded"
}
```

### Response `Status: (500)`
```json
{
    "success": false,
    "message": "<Error Message>"
}
```
