import { NextResponse } from "next/server";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect"; // adjust import path if needed

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const category = (searchParams.get("category") || "All").toLowerCase();

    if (!q) return NextResponse.json({ results: [] });

    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const results = [];
    const limit = 5;

    // ---- Jobs ----
    if (category === "all" || category === "jobs") {
      const jobCollection = await dbConnect(collectionNamesObj.jobsCollection);
      const jobs = await jobCollection
        .find({
          $or: [{ title: regex }, { description: regex }, { company: regex }],
        })
        .limit(limit)
        .project({ title: 1, company: 1, description: 1 })
        .toArray();

      results.push(
        ...jobs.map((j) => ({
          _id: j._id,
          title: j.title,
          subtitle: j.company,
          description: j.description,
          _type: "job",
        }))
      );
    }

    if (category === "all" || category === "candidates") {
      const userCollection = await dbConnect(collectionNamesObj.userCollection);
      const candidates = await userCollection
        .find({
          role: "candidate",
          $or: [
            { name: regex },
            { about: regex },
            { skills: regex },
            { title: regex },
          ],
        })
        .limit(limit)
        .project({ name: 1, title: 1, about: 1, email: 1 })
        .toArray();

      results.push(
        ...candidates.map((c) => ({
          _id: c._id,
          title: c.name,
          subtitle: c.title || "Candidate",
          description: c.about,
          email: c.email,
          _type: "candidate",
        }))
      );
    }

    // --- Companies ---
    if (category === "all" || category === "companies") {
      const userCollection = await dbConnect(collectionNamesObj.userCollection);
      const companies = await userCollection
        .find({
          role: "company",
          $or: [{ name: regex }, { about: regex }, { companyName: regex }],
        })
        .limit(limit)
        .project({ name: 1, about: 1, email: 1 })
        .toArray();

      results.push(
        ...companies.map((c) => ({
          _id: c._id,
          title: c.name,
          subtitle: "Company",
          description: c.about,
          email: c.email,
          _type: "company",
        }))
      );
    }

    // Only keep up to 5 results max
    const finalResults = results;

    return NextResponse.json({ results: finalResults });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
