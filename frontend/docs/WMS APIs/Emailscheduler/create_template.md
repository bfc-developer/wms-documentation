# Create Template
Creates a new email template with a customized name, category, and content.

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    
    Request --> Extract[Extract Body Parameters]
    Extract --> CreateInstance[Create Template Instance]
    
    CreateInstance --> SaveDB[Save to Database]
    
    SaveDB --> Success{Save Successful?}
    
    Success -- Yes --> Response200([Return 200 OK: Saved Successfully])
    
    SaveDB -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/create-template
```

### Authorization
```
None
```

### Request Body
```json
{
    "name": "Template Name",
    "category": "Newsletter",
    "content": "<h1>Hello World</h1><p>This is the email content.</p>"
}
```

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Saved Successfully."
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
