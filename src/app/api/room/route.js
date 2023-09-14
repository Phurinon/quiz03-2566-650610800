import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const GET = async () => {
  readDB();
  let totalRooms = DB.rooms.length;
  return NextResponse.json({
    ok: true,
    rooms: DB.rooms,
    totalRooms,
  });
};

export const POST = async (request) => {
  const payload = checkToken();
  if (
    !payload ||
    (payload.role !== "ADMIN" && payload.role !== "SUPER_ADMIN")
  ) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  readDB();
  const body = await request.json();
  const { roomName } = body;
  if (DB.rooms.find((room) => room.roomName === roomName)) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${roomName} already exists`,
      },
      { status: 400 }
    );
  }

  const roomId = nanoid();
  DB.rooms.push({
    roomId,
    roomName,
  });
  //call writeDB after modifying Database
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${roomName} has been created`,
  });
};
