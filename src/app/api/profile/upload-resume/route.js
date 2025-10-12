import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import dbConnect, { collectionNamesObj } from '@/lib/dbConnect';
import crypto from 'crypto';

async function uploadToCloudinary(file) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) throw new Error('Missing CLOUDINARY_CLOUD_NAME');

  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const folder = process.env.CLOUDINARY_FOLDER || 'resumes';
  const preset = process.env.CLOUDINARY_UPLOAD_PRESET || null;

  // Use raw endpoint for PDFs and other non-image files
  const baseUrl = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;

  const form = new FormData();
  form.append('file', file);

  // Prefer signed uploads when API credentials are available
  if (apiKey && apiSecret) {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      // Only sign parameters that are included in the request (alphabetically sorted)
      const params = [`folder=${folder}`, `timestamp=${timestamp}`];
      const paramsToSign = params.join('&');
      const signature = crypto
        .createHash('sha1')
        .update(paramsToSign + apiSecret)
        .digest('hex');

      form.append('timestamp', String(timestamp));
      form.append('folder', folder);
      form.append('api_key', apiKey);
      form.append('signature', signature);

      const res = await fetch(baseUrl, { method: 'POST', body: form });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Signed upload failed: ${txt}`);
      }
      return await res.json();
    } catch (signedErr) {
      // Fall back to unsigned if possible
      if (!preset) throw signedErr;
      // Reset form with file again for a clean request
      const unsignedForm = new FormData();
      unsignedForm.append('file', file);
      unsignedForm.append('upload_preset', preset);
      unsignedForm.append('folder', folder);
      const res2 = await fetch(baseUrl, { method: 'POST', body: unsignedForm });
      if (!res2.ok) {
        const txt2 = await res2.text();
        throw new Error(`Unsigned upload failed: ${txt2}`);
      }
      return await res2.json();
    }
  }

  // Fallback to unsigned preset uploads
  if (!preset) throw new Error('Missing CLOUDINARY_UPLOAD_PRESET for unsigned upload');
  form.append('upload_preset', preset);
  form.append('folder', folder);

  const res = await fetch(baseUrl, { method: 'POST', body: form });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Cloudinary upload failed: ${txt}`);
  }
  return await res.json();
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    const form = await request.formData();
    const file = form.get('file');
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    // Limit to reasonable size (e.g., 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
    }

    // Upload to Cloudinary
    const uploaded = await uploadToCloudinary(file);
    const resumeUrl = uploaded.secure_url || uploaded.url;

    // Save URL to user's profile
    const userCollection = await dbConnect(collectionNamesObj.userCollection);
    const identifier = session.user.providerAccountId 
      ? { providerAccountId: session.user.providerAccountId } 
      : { email: session.user.email };

    await userCollection.updateOne(identifier, { $set: { resumeUrl, updatedAt: new Date() } }, { upsert: true });

    return NextResponse.json({ success: true, resumeUrl });
  } catch (e) {
    console.error('Resume upload error:', e);
    const message = e instanceof Error ? e.message : 'Failed to upload resume';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


