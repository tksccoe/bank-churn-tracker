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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();
  const { id: _id, userId: _uid, createdAt: _ca, updatedAt: _ua, ...body } =
    await req.json();

  const account = await Account.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    { $set: body },
    { new: true }
  );

  if (!account) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }
  return NextResponse.json(serialize(account));
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();
  const account = await Account.findOneAndDelete({
    _id: id,
    userId: session.user.id,
  });

  if (!account) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Deleted' });
}
