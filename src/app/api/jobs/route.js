import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";

// GET /api/jobs - list jobs for the authenticated company
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (session.user.role !== 'company' && session.user.role !== 'admin') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const jobsCollection = dbConnect(collectionNamesObj.jobsCollection);

        const companyIdentifier = session.user.providerAccountId 
            ? { companyProviderAccountId: session.user.providerAccountId }
            : { companyEmail: session.user.email };

        const jobs = await jobsCollection.find(companyIdentifier).sort({ createdAt: -1 }).toArray();
        return NextResponse.json({ jobs });
    } catch (error) {
        console.error("Error listing jobs:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST /api/jobs - create a new job post for the authenticated company
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (session.user.role !== 'company' && session.user.role !== 'admin') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const { title, description, location, employmentType, salaryMin, salaryMax, skills = [] } = body;

        if (!title || !description) {
            return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
        }

        const jobsCollection = dbConnect(collectionNamesObj.jobsCollection);

        const jobDoc = {
            title,
            description,
            location: location || '',
            employmentType: employmentType || 'Full-time',
            salaryMin: typeof salaryMin === 'number' ? salaryMin : null,
            salaryMax: typeof salaryMax === 'number' ? salaryMax : null,
            skills: Array.isArray(skills) ? skills : [],
            companyName: session.user.name || '',
            companyEmail: session.user.email || '',
            companyProviderAccountId: session.user.providerAccountId || null,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'open'
        };

        const result = await jobsCollection.insertOne(jobDoc);
        return NextResponse.json({ success: true, job: { _id: result.insertedId, ...jobDoc } }, { status: 201 });
    } catch (error) {
        console.error("Error creating job:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


