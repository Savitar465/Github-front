import { NextResponse } from "next/server";
import { getServiceToken } from "@/lib/keycloak";

export async function GET() {
  try {
    const token = await getServiceToken();
    return NextResponse.json({ access_token: token });
  } catch {
    return NextResponse.json(
      { error: "Failed to obtain token from Keycloak" },
      { status: 502 }
    );
  }
}
