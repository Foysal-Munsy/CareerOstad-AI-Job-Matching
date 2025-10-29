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

    const requiredSkills = Array.from(new Set(
      String(jobRequirement)
        .split(',')
        .map(skill => skill.trim().toLowerCase())
        .filter(Boolean)
    ));

    if (requiredSkills.length === 0) {
      return new Response(
        JSON.stringify({ message: 'Please provide at least one valid skill keyword' }),
        { status: 400 }
      );
    }

    const collection = await dbConnect(collectionNamesObj.userCollection);
    // Limit to 1000 candidates to prevent memory issues
    const candidates = await collection.find({ role: 'candidate' }).limit(1000).toArray();

    // calculate matching score
    const scoredCandidates = candidates.map(candidate => {
      const candidateSkills = Array.isArray(candidate?.skills)
        ? candidate.skills
            .map(s => {
              if (typeof s === 'string') return s.toLowerCase();
              if (s && typeof s === 'object') {
                const name = s.name || s.skill || s.title || '';
                return String(name).toLowerCase();
              }
              return '';
            })
            .filter(Boolean)
        : [];

      const candidateSkillSet = new Set(candidateSkills);
      const matchedCount = requiredSkills.reduce((acc, skill) => acc + (candidateSkillSet.has(skill) ? 1 : 0), 0);

      const matchPercent = requiredSkills.length > 0
        ? Math.round((matchedCount / requiredSkills.length) * 100)
        : 0;

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
