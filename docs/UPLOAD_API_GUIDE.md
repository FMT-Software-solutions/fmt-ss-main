# File Upload API Guide

This guide explains how to use the file upload API endpoint to upload files to Cloudflare R2 storage.

## API Endpoint

```
POST /api/upload
```

## Overview

The upload API allows you to upload files to Cloudflare R2 buckets. Files are uploaded using multipart/form-data and can be accessed through a proxy API that serves files directly from your application.

## Prerequisites

### Environment Variables

Before using the API, ensure these environment variables are configured in your `.env.local` file:

```env
# Cloudflare R2 Configuration
CLOUDFLARE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key-id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-access-key

# Optional: Your app's base URL (defaults to http://localhost:3000)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000`
- `http://localhost:4000`

## Request Format

### Content Type
```
Content-Type: multipart/form-data
```

### Request Body (FormData)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | ✅ Yes | The file to upload |
| `bucketName` | string | ✅ Yes | The R2 bucket name where the file will be stored |
| `fileName` | string | ❌ No | Custom filename (if not provided, uses original filename) |

### Example Request (JavaScript)

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('bucketName', 'my-bucket');
formData.append('fileName', 'custom-name.jpg'); // Optional

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
```

### Example Request (cURL)

```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@/path/to/your/file.jpg" \
  -F "bucketName=my-bucket" \
  -F "fileName=custom-name.jpg"
```

## Response Format

### Success Response (200)

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "fileName": "custom-name.jpg",
  "bucketName": "my-bucket",
  "etag": "\"d41d8cd98f00b204e9800998ecf8427e\"",
  "size": 1024000,
  "contentType": "image/jpeg",
  "url": "http://localhost:3000/api/files/my-bucket/custom-name.jpg",
  "downloadUrl": "http://localhost:3000/api/files/my-bucket/custom-name.jpg"
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicates if the upload was successful |
| `message` | string | Success message |
| `fileName` | string | Final filename used for storage |
| `bucketName` | string | R2 bucket where file was stored |
| `etag` | string | ETag returned by R2 (file hash) |
| `size` | number | File size in bytes |
| `contentType` | string | MIME type of the uploaded file |
| `url` | string | Direct URL to access the file |
| `downloadUrl` | string | URL for downloading the file |

### Error Responses

#### 400 - Bad Request
```json
{
  "error": "File is required"
}
```

```json
{
  "error": "Bucket name is required"
}
```

```json
{
  "error": "File name is required"
}
```

#### 403 - CORS Error
```json
{
  "error": "CORS: Origin not allowed"
}
```

#### 500 - Server Error
```json
{
  "success": false,
  "error": "Failed to upload file",
  "details": "Detailed error message"
}
```

## File Access

### Accessing Uploaded Files

Once uploaded, files can be accessed through the proxy API:

```
GET /api/files/{bucketName}/{fileName}
```

Example:
```
GET /api/files/my-bucket/custom-name.jpg
```

### File URLs

The API returns two URLs:
- **`url`**: Direct access URL for viewing/previewing files
- **`downloadUrl`**: Same URL, can be used to trigger downloads

Both URLs point to the same proxy endpoint that serves files from R2.

## Usage Examples

### Basic File Upload

```javascript
async function uploadFile(file, bucketName) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('bucketName', bucketName);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Upload successful:', result);
    return result;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}
```

### Upload with Custom Filename

```javascript
async function uploadWithCustomName(file, bucketName, customName) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('bucketName', bucketName);
  formData.append('fileName', customName);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  return await response.json();
}
```

### Download File

```javascript
function downloadFile(downloadUrl, filename) {
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Usage
const result = await uploadFile(file, 'my-bucket');
downloadFile(result.downloadUrl, result.fileName);
```

## Security Considerations

1. **CORS Protection**: The API only accepts requests from configured origins
2. **File Validation**: Basic file validation is performed
3. **Proxy Access**: Files are served through your application, not directly from R2
4. **Environment Variables**: Sensitive credentials are stored in environment variables

## Limitations

1. **File Size**: Limited by your server's configuration and R2 limits
2. **CORS Origins**: Only configured origins can access the API
3. **Bucket Access**: Requires proper R2 bucket permissions

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your origin is in the `allowedOrigins` array
2. **Missing Environment Variables**: Check that all required env vars are set
3. **Bucket Permissions**: Verify R2 bucket permissions and credentials
4. **File Size Limits**: Check server and R2 file size limits

### Testing

Use the test page at `/test-upload` to verify the API functionality with a user-friendly interface.

## Related Files

- **Upload API**: `/app/api/upload/route.ts`
- **File Proxy API**: `/app/api/files/[...path]/route.ts`
- **Test Page**: `/app/test-upload/page.tsx`