import { NextRequest, NextResponse } from "next/server";
import analyzeRepo from "@/utils/analyzeRepo";

export async function POST(request: NextRequest) {
  try {
    const { repoUrl } = await request.json();

    if (!repoUrl) {
      return NextResponse.json(
        { error: "Repository URL is required" },
        { status: 400 }
      );
    }

    const analysis = await analyzeRepo(repoUrl);
    return NextResponse.json(analysis);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
