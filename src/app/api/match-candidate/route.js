import dbConnect, { collectionNamesObj } from '@/lib/dbConnect';

export async function POST(req) {
  try {
    const { jobRequirement } = await req.json();
    if (!jobRequirement) {
      return new Response(
        JSON.stringify({ message: 'Job requirement is required' }),
        { status: 400 }
      );
    }

    const requiredSkills = jobRequirement
      .split(',')
      .map(skill => skill.trim().toLowerCase())
      .filter(Boolean);

    const collection = await dbConnect(collectionNamesObj.userCollection);
    const candidates = await collection.find({}).toArray();

    // calculate matching score
    const scoredCandidates = candidates.map(candidate => {
      const candidateSkills = candidate.skills?.map(s => s.toLowerCase()) || [];
      const matchedCount = requiredSkills.filter(skill =>
        candidateSkills.includes(skill)
      ).length;

      const matchPercent = Math.round(
        (matchedCount / requiredSkills.length) * 100
      );

      return { ...candidate, matchPercent };
    });

    // sort by matchPercent (descending)
    const sorted = scoredCandidates
      .filter(c => c.matchPercent > 0)
      .sort((a, b) => b.matchPercent - a.matchPercent);

    return new Response(JSON.stringify(sorted), { status: 200 });
  } catch (error) {
    console.error('Error matching candidates:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
    });
  }
}
