import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import JobCategory from '@/models/JobCategory';
import Job from '@/models/Job';

export async function GET() {
  try {
    await dbConnect();
    
    const categories = await JobCategory.find({}).sort({ createdAt: -1 });
    
    // Get job count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const jobCount = await Job.countDocuments({ category: category._id });
        return {
          _id: category._id,
          name: category.name,
          description: category.description,
          jobCount,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        };
      })
    );
    
    return NextResponse.json({ 
      success: true, 
      categories: categoriesWithCount 
    });
  } catch (error) {
    console.error('Categories fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const { name, description } = body;
    
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }
    
    const category = await JobCategory.create({ name, description });
    
    return NextResponse.json({
      success: true,
      category
    }, { status: 201 });
  } catch (error) {
    console.error('Category creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
