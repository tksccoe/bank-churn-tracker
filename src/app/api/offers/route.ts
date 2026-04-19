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

// Public: anyone can list active offers; admin sees all offers
export async function GET() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.isAdmin === true;

  await connectDB();
  const filter = isAdmin ? {} : { active: true };
  const offers = await Offer.find(filter).sort({
    featured: -1,
    createdAt: -1,
  });
  return NextResponse.json(offers.map(serialize));
}

// Admin-only: create a new offer
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await connectDB();
  const body = await req.json();
  const offer = await Offer.create(body);
  return NextResponse.json(serialize(offer), { status: 201 });
}
