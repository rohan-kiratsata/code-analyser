import { NextRequest, NextResponse } from "next/server";
import analyzeRepo from "@/utils/analyzeRepo";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received request body:", body);

    const { repoUrl } = body;

    if (!repoUrl || typeof repoUrl !== "string") {
      return NextResponse.json(
        { error: "Repository URL is required and must be a string" },
        { status: 400 }
      );
    }

    const analysis = await analyzeRepo(repoUrl);
    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
