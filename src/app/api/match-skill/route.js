import dbConnect, { collectionNamesObj } from '@/lib/dbConnect';

export async function POST(req) {
  try {
    const { inputSkill } = await req.json();
    if (!inputSkill) {
      return new Response(JSON.stringify({ message: 'Skills are required' }), {
        status: 400,
      });
    }

    const skillArray = inputSkill
      .split(',')
      .map(skill => skill.trim().toLowerCase())
      .filter(Boolean);

    const collection = await dbConnect(collectionNamesObj.jobsCollection);
    const jobs = await collection.find({}).toArray();

    const matchedJobs = jobs.map(job => {
      const jobSkills = job.skills?.map(s => s.toLowerCase()) || [];
      const matchedCount = skillArray.filter(skill =>
        jobSkills.includes(skill)
      ).length;
      const matchPercent = Math.round((matchedCount / jobSkills.length) * 100);
      return { ...job, matchPercent };
    });

    const sorted = matchedJobs
      .filter(j => j.matchPercent > 0)
      .sort((a, b) => b.matchPercent - a.matchPercent);

    return new Response(JSON.stringify(sorted), { status: 200 });
  } catch (error) {
    console.error('Error matching skills:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
    });
  }
}
