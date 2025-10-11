import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';

// Initialize S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

// Allowed origins for CORS
const allowedOrigins = ['http://localhost:4000', 'http://localhost:3000'];

// Function to get CORS headers based on origin
const getCorsHeaders = (origin: string | null) => {
  const isAllowed = origin && allowedOrigins.includes(origin);
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
};

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(origin),
  });
}

export async function POST(request: NextRequest) {
  try {
    // Check origin for CORS
    const origin = request.headers.get('origin');
    if (!origin || !allowedOrigins.includes(origin)) {
      return NextResponse.json(
        { error: 'CORS: Origin not allowed' },
        { status: 403 }
      );
    }

    const corsHeaders = getCorsHeaders(origin);

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucketName = formData.get('bucketName') as string;
    const fileName = formData.get('fileName') as string;

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!bucketName) {
      return NextResponse.json(
        { error: 'Bucket name is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Use provided fileName or generate one from the original file name
    const finalFileName = fileName || file.name;

    if (!finalFileName) {
      return NextResponse.json(
        { error: 'File name is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudflare R2
    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: finalFileName,
      Body: buffer,
      ContentType: file.type,
      ContentLength: buffer.length,
    });

    const result = await s3Client.send(uploadCommand);

    // Construct the file URL using your own API proxy
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const fileUrl = `${baseUrl}/api/files/${bucketName}/${finalFileName}`;

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'File uploaded successfully',
        fileName: finalFileName,
        bucketName: bucketName,
        etag: result.ETag,
        size: buffer.length,
        contentType: file.type,
        url: fileUrl, // Direct URL to access the file through your API
        downloadUrl: fileUrl, // Same URL can be used for download
      },
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Upload error:', error);
    
    // Get CORS headers for error response
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}