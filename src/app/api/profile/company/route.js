import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "company" && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let collection;
    try {
      collection = dbConnect(collectionNamesObj.userCollection);
    } catch (e) {
      return NextResponse.json(defaultCompanyProfile(session), { status: 200 });
    }

    const identifier = session.user.providerAccountId
      ? { providerAccountId: session.user.providerAccountId }
      : { email: session.user.email };
    const user = await collection.findOne(identifier);

    const company = user?.company || {};
    return NextResponse.json(mergeCompanyProfile(company, session));
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "company" && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    let collection;
    try {
      collection = dbConnect(collectionNamesObj.userCollection);
    } catch (e) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    const identifier = session.user.providerAccountId
      ? { providerAccountId: session.user.providerAccountId }
      : { email: session.user.email };

    const update = {
      $set: {
        company: {
          name: body.name || session.user.companyName || "",
          logo: body.logo || session.user.image || "",
          website: body.website || "",
          location: body.location || "",
          size: body.size || "",
          industry: body.industry || "",
          founded: body.founded || "",
          about: body.about || "",
          socials: body.socials || { linkedin: "", twitter: "", facebook: "" },
          perks: body.perks || [],
          techStack: body.techStack || [],
          culture: body.culture || [],
          hiring: body.hiring || true,
          updatedAt: new Date(),
        },
      },
    };

    const result = await collection.updateOne(identifier, update, { upsert: true });
    if (result.acknowledged) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function defaultCompanyProfile(session) {
  return mergeCompanyProfile({}, session);
}

function mergeCompanyProfile(company, session) {
  return {
    name: company.name || session?.user?.companyName || "",
    logo: company.logo || session?.user?.image || "",
    website: company.website || "",
    location: company.location || "",
    size: company.size || "",
    industry: company.industry || "",
    founded: company.founded || "",
    about: company.about || "",
    socials: company.socials || { linkedin: "", twitter: "", facebook: "" },
    perks: company.perks || [],
    techStack: company.techStack || [],
    culture: company.culture || [],
    hiring: company.hiring ?? true,
  };
}


