// app/api/user/projects/github/[githubId]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ githubId: string }> }
) {
    try {
        // Await params - Next.js 15+ requirement
        const { githubId } = await params;
        
        if (!githubId) {
            return NextResponse.json({ error: "GitHub repository ID is required" }, { status: 400 });
        }

        // Fetch from GitHub API
        const response = await fetch(`https://api.github.com/repos/${githubId}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                ...(process.env.GITHUB_TOKEN && {
                    'Authorization': `token ${process.env.GITHUB_TOKEN}`
                })
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json({ error: "GitHub repository not found" }, { status: 404 });
            }
            return NextResponse.json({ error: "Failed to fetch from GitHub API" }, { status: response.status });
        }

        const repoData = await response.json();

        // Return relevant info
        return NextResponse.json({
            name: repoData.name,
            fullName: repoData.full_name,
            description: repoData.description,
            stars: repoData.stargazers_count,
            forks: repoData.forks_count,
            language: repoData.language,
            url: repoData.html_url,
            createdAt: repoData.created_at,
            updatedAt: repoData.updated_at,
            owner: {
                login: repoData.owner.login,
                avatarUrl: repoData.owner.avatar_url,
                url: repoData.owner.html_url
            },
            topics: repoData.topics || [],
            license: repoData.license?.name || null,
            defaultBranch: repoData.default_branch
        });

    } catch (error) {
        console.error("Error fetching GitHub repo:", error);
        return NextResponse.json({ 
            error: "Failed to fetch GitHub repository",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}