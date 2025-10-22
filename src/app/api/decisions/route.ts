// src/app/api/decisions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// CREATE - Save a new decision
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const decision = await prisma.decision.create({
      data: {
        //caseId: body.caseId,
        caseType: body.caseType,
        caseTitle: body.caseTitle,
        caseSummary: body.caseSummary,
        selectedEvidence: JSON.stringify(body.selectedEvidence || []),
        selectedWitness: body.selectedWitness || null,
        objection: body.objection || 'none',
        juryVotesGuilty: body.juryVotesGuilty || 0,
        notes: body.notes || '',
       // strength: body.strength || 0,
      },
    });

    return NextResponse.json({ 
      success: true, 
      id: decision.id,
      message: 'Decision saved successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('Error saving decision:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to save decision' 
    }, { status: 500 });
  }
}

// READ - Get all decisions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const caseType = searchParams.get('caseType');

    const where = caseType ? { caseType } : {};

    const decisions = await prisma.decision.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma.decision.count({ where });

    // Parse JSON strings back to objects
    const formattedDecisions = decisions.map(d => ({
      ...d,
      selectedEvidence: JSON.parse(d.selectedEvidence),
    }));

    return NextResponse.json({
      success: true,
      data: formattedDecisions,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching decisions:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch decisions' 
    }, { status: 500 });
  }
}

// UPDATE - Update an existing decision
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Decision ID is required' 
      }, { status: 400 });
    }

    const decision = await prisma.decision.update({
      where: { id: parseInt(id) },
      data: {
        //caseId: data.caseId,
        caseType: data.caseType,
        caseTitle: data.caseTitle,
        caseSummary: data.caseSummary,
        selectedEvidence: JSON.stringify(data.selectedEvidence || []),
        selectedWitness: data.selectedWitness || null,
        objection: data.objection || 'none',
        juryVotesGuilty: data.juryVotesGuilty || 0,
        notes: data.notes || '',
        //strength: data.strength || 0,
      },
    });

    return NextResponse.json({ 
      success: true, 
      id: decision.id,
      message: 'Decision updated successfully' 
    });
  } catch (error) {
    console.error('Error updating decision:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update decision' 
    }, { status: 500 });
  }
}

// DELETE - Delete a decision
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Decision ID is required' 
      }, { status: 400 });
    }

    await prisma.decision.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Decision deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting decision:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete decision' 
    }, { status: 500 });
  }
}