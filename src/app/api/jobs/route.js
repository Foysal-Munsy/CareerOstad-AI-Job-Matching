import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";

// GET /api/jobs - list jobs (public access for job seekers, filtered for companies)
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const isPublic = searchParams.get('public') === 'true';
        
        const session = await getServerSession(authOptions);
        const jobsCollection = dbConnect(collectionNamesObj.jobsCollection);

        let filter = {};
        let sort = { createdAt: -1 };

        // If user is authenticated and is a company/admin, show only their jobs
        if (session && (session.user.role === 'company' || session.user.role === 'admin') && !isPublic) {
            const companyIdentifier = session.user.providerAccountId 
                ? { companyProviderAccountId: session.user.providerAccountId }
                : { companyEmail: session.user.email };
            filter = companyIdentifier;
        } else {
            // Public access - only show open jobs
            filter = { status: 'open' };
        }

        const jobs = await jobsCollection.find(filter).sort(sort).toArray();
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
        const { 
            title, category, employmentType, jobLevel, overview, requirements, 
            preferredQualifications, toolsTechnologies = [], location, workMode,
            salaryMin, salaryMax, salaryType, isNegotiable, perksBenefits,
            applicationDeadline, howToApply, applicationUrl, applicationEmail,
            numberOfVacancies, experienceRequired, educationRequired,
            genderPreference, ageLimit, tags = [], companyWebsite
        } = body;

        if (!title || !category || !overview || !requirements) {
            return NextResponse.json({ error: "Title, category, overview, and requirements are required" }, { status: 400 });
        }

        const jobsCollection = dbConnect(collectionNamesObj.jobsCollection);

        const jobDoc = {
            title,
            category,
            employmentType: employmentType || 'Full-time',
            jobLevel: jobLevel || 'Mid-level',
            overview,
            requirements,
            preferredQualifications: preferredQualifications || '',
            toolsTechnologies: Array.isArray(toolsTechnologies) ? toolsTechnologies : [],
            location: location || '',
            workMode: workMode || 'On-site',
            salaryMin: typeof salaryMin === 'number' ? salaryMin : null,
            salaryMax: typeof salaryMax === 'number' ? salaryMax : null,
            salaryType: salaryType || 'BDT',
            isNegotiable: Boolean(isNegotiable),
            perksBenefits: perksBenefits || '',
            applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
            howToApply: howToApply || 'Website',
            applicationUrl: applicationUrl || '',
            applicationEmail: applicationEmail || '',
            numberOfVacancies: typeof numberOfVacancies === 'number' ? numberOfVacancies : 1,
            experienceRequired: experienceRequired || '',
            educationRequired: educationRequired || '',
            genderPreference: genderPreference || '',
            ageLimit: ageLimit || '',
            tags: Array.isArray(tags) ? tags : [],
            companyName: session.user.name || '',
            companyEmail: session.user.email || '',
            companyWebsite: companyWebsite || '',
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


