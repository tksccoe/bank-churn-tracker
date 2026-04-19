import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Offer from '@/lib/models/Offer';

function serialize(doc: any) {
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  return {
    ...obj,
    id: obj._id?.toString(),
    _id: undefined,
    __v: undefined,
  };
}

// Public: get a single offer by slug
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  await connectDB();
  const offer = await Offer.findOne({ slug, active: true });
  if (!offer) {
    return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
  }
  return NextResponse.json(serialize(offer));
}

// Admin-only: update an offer
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { slug } = await params;
  await connectDB();
  const body = await req.json();
  const offer = await Offer.findOneAndUpdate(
    { slug },
    { $set: body },
    { returnDocument: 'after' }
  );
  if (!offer) {
    return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
  }
  return NextResponse.json(serialize(offer));
}

// Admin-only: delete an offer
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { slug } = await params;
  await connectDB();
  const offer = await Offer.findOneAndDelete({ slug });
  if (!offer) {
    return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
