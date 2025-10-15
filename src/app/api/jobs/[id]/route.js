import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

// GET /api/jobs/[id] - get a specific job by ID (public access)
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
        }

        const jobsCollection = await dbConnect(collectionNamesObj.jobsCollection);
        const companiesCollection = await dbConnect(collectionNamesObj.companiesCollection);
        
        const job = await jobsCollection.findOne({ _id: new ObjectId(id) });

        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        // Fetch company logo from company profile
        let companyLogo = null;
        try {
            const companyIdentifier = job.companyProviderAccountId 
                ? { providerAccountId: job.companyProviderAccountId }
                : { email: job.companyEmail };
            
            const company = await companiesCollection.findOne(companyIdentifier);
            if (company && company.logo) {
                companyLogo = company.logo;
            }
        } catch (error) {
            console.log("Could not fetch company logo:", error.message);
        }

        // Add company logo to job data
        const jobWithLogo = {
            ...job,
            companyLogo
        };

        // Only return open jobs for public access, or all jobs for authenticated company/admin users
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== 'company' && session.user.role !== 'admin')) {
            if (job.status !== 'open') {
                return NextResponse.json({ error: "Job not found" }, { status: 404 });
            }
        }

        return NextResponse.json({ job: jobWithLogo });
    } catch (error) {
        console.error("Error fetching job:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PUT /api/jobs/[id] - update a specific job
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (session.user.role !== 'company' && session.user.role !== 'admin') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
        }

        const body = await request.json();
        const { 
            title, category, employmentType, jobLevel, overview, requirements, 
            preferredQualifications, toolsTechnologies = [], location, workMode,
            salaryMin, salaryMax, salaryType, isNegotiable, perksBenefits,
            applicationDeadline, howToApply, applicationUrl, applicationEmail,
            numberOfVacancies, experienceRequired, educationRequired,
            genderPreference, ageLimit, tags = [], status, companyWebsite
        } = body;

        if (!title || !category || !overview || !requirements) {
            return NextResponse.json({ error: "Title, category, overview, and requirements are required" }, { status: 400 });
        }

        const jobsCollection = await dbConnect(collectionNamesObj.jobsCollection);

        // Check if job exists and belongs to the authenticated company
        const existingJob = await jobsCollection.findOne({ _id: new ObjectId(id) });
        if (!existingJob) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        // Verify ownership
        const companyIdentifier = session.user.providerAccountId 
            ? { companyProviderAccountId: session.user.providerAccountId }
            : { companyEmail: session.user.email };

        const isOwner = (existingJob.companyProviderAccountId && existingJob.companyProviderAccountId === session.user.providerAccountId) ||
                       (existingJob.companyEmail && existingJob.companyEmail === session.user.email);

        if (!isOwner && session.user.role !== 'admin') {
            return NextResponse.json({ error: "Forbidden - You can only edit your own jobs" }, { status: 403 });
        }

        const updateDoc = {
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
            companyWebsite: companyWebsite || '',
            updatedAt: new Date(),
            ...(status && { status }) // Only update status if provided
        };

        const result = await jobsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateDoc }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        const updatedJob = await jobsCollection.findOne({ _id: new ObjectId(id) });
        return NextResponse.json({ success: true, job: updatedJob });
    } catch (error) {
        console.error("Error updating job:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE /api/jobs/[id] - delete a specific job
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (session.user.role !== 'company' && session.user.role !== 'admin') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
        }

        const jobsCollection = await dbConnect(collectionNamesObj.jobsCollection);

        // Check if job exists and belongs to the authenticated company
        const existingJob = await jobsCollection.findOne({ _id: new ObjectId(id) });
        if (!existingJob) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        // Verify ownership
        const isOwner = (existingJob.companyProviderAccountId && existingJob.companyProviderAccountId === session.user.providerAccountId) ||
                       (existingJob.companyEmail && existingJob.companyEmail === session.user.email);

        if (!isOwner && session.user.role !== 'admin') {
            return NextResponse.json({ error: "Forbidden - You can only delete your own jobs" }, { status: 403 });
        }

        const result = await jobsCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Job deleted successfully" });
    } catch (error) {
        console.error("Error deleting job:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
