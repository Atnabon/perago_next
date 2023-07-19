import mongoose from "mongoose";
import connect from "@/utils/db";
import { NextResponse } from "next/server";
import Position from "@/models/Position";

export async function GET(request) {
  try {
    await connect();
    const positions = await Position.find();
    return NextResponse.json(positions, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.error(error);
  }
}

export async function POST(request) {
  await connect();
  const { name, description, parentId } = await request.json();
  console.log("our data");
  const position = {
    name,
    description,
    parentId: parentId,
  };
  const result = await Position.create(position);
  return NextResponse.json({ result });
}

export async function PUT(request) {
  await connect();
  const { id, name, description, parentId } = await request.json();
  const position = {
    name,
    description,
    parentId: parentId ? new mongoose.Types.ObjectId() : null,
  };
  const result = await Position.findByIdAndUpdate(id, position);
  return NextResponse.json(result, { status: 200 });
}

export async function DELETE(request) {
  await connect();
  const { positionId } = await request.json();
  const result = await Position.findByIdAndDelete(positionId);
  return NextResponse.json(result, { status: 200 });
}