import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Account from '@/lib/models/Account';
import { serializeAccount } from '@/lib/serialize';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const accounts = await Account.find({ userId: session.user.id }).sort({
    institutionName: 1,
  });
  return NextResponse.json(accounts.map(serializeAccount));
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
  return NextResponse.json(serializeAccount(account), { status: 201 });
}
