import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Account from '@/lib/models/Account';

function serialize(doc: any) {
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  return {
    ...obj,
    id: obj._id?.toString(),
    userId: obj.userId?.toString(),
    monthlyFeeFreeMet:
      obj.monthlyFeeFreeMet instanceof Map
        ? Object.fromEntries(obj.monthlyFeeFreeMet)
        : obj.monthlyFeeFreeMet ?? {},
    _id: undefined,
    __v: undefined,
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const accounts = await Account.find({ userId: session.user.id }).sort({
    institutionName: 1,
  });
  return NextResponse.json(accounts.map(serialize));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const { id: _id, userId: _uid, createdAt: _ca, updatedAt: _ua, ...body } =
    await req.json();
  const account = await Account.create({ ...body, userId: session.user.id });
  return NextResponse.json(serialize(account), { status: 201 });
}
