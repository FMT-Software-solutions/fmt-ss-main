'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, CheckCircle, XCircle, Loader2, Download, ExternalLink, Copy } from 'lucide-react';

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [bucketName, setBucketName] = useState('');
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-fill filename if not provided
      if (!fileName) {
        setFileName(selectedFile.name);
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !bucketName) {
      setError('Please select a file and enter a bucket name');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucketName', bucketName);
      if (fileName) {
        formData.append('fileName', fileName);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadResult(result);
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setBucketName('');
    setFileName('');
    setUploadResult(null);
    setError(null);
    setCopySuccess(null);
    // Reset file input
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`${type} copied to clipboard!`);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-6 w-6" />
            File Upload Test
          </CardTitle>
          <CardDescription>
            Test the Cloudflare R2 file upload functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bucket-name">Bucket Name *</Label>
              <Input
                id="bucket-name"
                type="text"
                placeholder="Enter R2 bucket name"
                value={bucketName}
                onChange={(e) => setBucketName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-input">Select File *</Label>
              <Input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                required
              />
              {file && (
                <p className="text-sm text-muted-foreground">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-name">Custom File Name (optional)</Label>
              <Input
                id="file-name"
                type="text"
                placeholder="Leave empty to use original name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={isUploading || !file || !bucketName}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload File
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm}
                disabled={isUploading}
              >
                Reset
              </Button>
            </div>
          </form>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {copySuccess && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{copySuccess}</AlertDescription>
            </Alert>
          )}

          {uploadResult && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-4">
                  <p className="font-semibold">Upload Successful!</p>
                  <div className="text-sm space-y-1">
                    <p><strong>File:</strong> {uploadResult.fileName}</p>
                    <p><strong>Bucket:</strong> {uploadResult.bucketName}</p>
                    <p><strong>Size:</strong> {(uploadResult.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p><strong>Content Type:</strong> {uploadResult.contentType}</p>
                    {uploadResult.etag && (
                      <p><strong>ETag:</strong> {uploadResult.etag}</p>
                    )}
                  </div>
                  
                  {uploadResult.url && (
                    <div className="space-y-3 pt-2 border-t">
                      <p className="font-semibold text-sm">File URLs:</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium min-w-[80px]">View URL:</span>
                          <code className="flex-1 text-xs bg-muted p-1 rounded break-all">
                            {uploadResult.url}
                          </code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(uploadResult.url, 'View URL')}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(uploadResult.url, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        {uploadResult.downloadUrl && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium min-w-[80px]">Download:</span>
                            <code className="flex-1 text-xs bg-muted p-1 rounded break-all">
                              {uploadResult.downloadUrl}
                            </code>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(uploadResult.downloadUrl, 'Download URL')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadFile(uploadResult.downloadUrl, uploadResult.fileName)}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => window.open(uploadResult.url, '_blank')}
                          className="flex-1"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open File
                        </Button>
                        {uploadResult.downloadUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadFile(uploadResult.downloadUrl, uploadResult.fileName)}
                            className="flex-1"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Instructions:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Enter your Cloudflare R2 bucket name</li>
              <li>Select a file to upload</li>
              <li>Optionally provide a custom filename</li>
              <li>Click "Upload File" to test the functionality</li>
            </ul>
            <p className="mt-4">
              <strong>Note:</strong> Make sure your environment variables are configured:
              <code className="block mt-1 p-2 bg-muted rounded text-xs">
                CLOUDFLARE_R2_ENDPOINT<br/>
                CLOUDFLARE_R2_ACCESS_KEY_ID<br/>
                CLOUDFLARE_R2_SECRET_ACCESS_KEY
              </code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}