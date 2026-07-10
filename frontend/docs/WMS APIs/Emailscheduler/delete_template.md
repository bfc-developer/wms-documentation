# Delete Template
Deletes a specific email template from the system using its unique database ID (`_id`).

### User flow diagram
```mermaid
flowchart TD
    Start([Start]) --> Request{Receive POST Request}
    
    Request --> CheckID{Is Template ID provided?}
    
    CheckID -- No --> Response400([Return 400: Template ID is required])
    
    CheckID -- Yes --> DBDelete[Delete template from Collection by _id]
    
    DBDelete --> CheckDeleted{Template Deleted?}
    
    CheckDeleted -- No --> Response404([Return 404: Template not found])
    CheckDeleted -- Yes --> Response200([Return 200 OK: Deleted Successfully])
    
    Request -. Error .-> HandleError[Catch Error]
    HandleError --> Response500([Return 500 Internal Server Error])
```

### Method
```
POST
```

### Route
```
/delete-template
```

### Authorization
```
Bearer <token>
```

### Request Body
```json
{
    "id": "60d5ec9f1a2b3c4d5e6f7a8b"
}
```

### Parameters
| Name | Type | Description |
|------|------|-------------|
| id | String | The unique database ID (`_id`) of the template to delete. |

### Response `Status: (200)`
```json
{
    "status": true,
    "message": "Deleted Successfully"
}
```

### Response `Status: (400)`
```json
{
    "status": false,
    "message": "Template ID is required"
}
```

### Response `Status: (404)`
```json
{
    "status": false,
    "message": "Template not found"
}
```

### Response `Status: (500)`
```json
{
    "status": false,
    "message": "Internal Server Error"
}
```
