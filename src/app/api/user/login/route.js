import jwt from "jsonwebtoken";

import { DB, readDB } from "@/app/libs/DB";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const POST = async (request) => {
  readDB();
  const body = await request.json();
  const { username, password } = body;
  const user = DB.users.find(
    (user) => user.username === username && user.password === password
  );
  if (!user) {
    return NextResponse.json(
      {
        ok: false,
        message: "Username or Password is incorrect",
      },
      { status: 400 }
    );
  }

  const payload = {
    username,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET);

  return NextResponse.json({ ok: true, token });
};
