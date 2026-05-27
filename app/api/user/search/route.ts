// app/api/user/search/route.ts - Fixed Drizzle query syntax
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { 
  internships, 
  careers, 
  projects, 
  forms, 
  companies,
  users,
  certificates,
  internshipApplications,
  careerApplications
} from "@/db/schema";
import { like, or, eq, and, sql } from "drizzle-orm";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    let userId: number | null = null;
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; roleType: string };
        userId = decoded.id;
      } catch (error) {
        console.error("Token verification error:", error);
      }
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";

    if (query.length < 2) {
      return NextResponse.json({ success: true, results: [], total: 0 });
    }

    const searchTerm = `%${query}%`;

    let allResults: any[] = [];

    // 1. Search Companies
    try {
      const companiesResults = await db
        .select({
          id: companies.id,
          title: companies.name,
          description: companies.description,
          type: sql<string>`'company'`,
          extra: sql<string>`''`,
          url: sql<string>`'/dashboard/company/profile'`,
        })
        .from(companies)
        .where(
          or(
            like(companies.name, searchTerm),
            like(companies.description, searchTerm),
            like(companies.category, searchTerm)
          )
        )
        .limit(5);
      
      allResults.push(...companiesResults.map(r => ({ ...r, priority: 1 })));
    } catch (err) {
      console.error("Companies search error:", err);
    }

    // 2. Search Internships
    try {
      const internshipsResults = await db
        .select({
          id: internships.id,
          title: internships.title,
          description: internships.content,
          type: sql<string>`'internship'`,
          extra: sql<string>`concat(${internships.duration}, ' weeks')`,
          url: sql<string>`concat('/dashboard/internships/', ${internships.id})`,
        })
        .from(internships)
        .where(
          or(
            like(internships.title, searchTerm),
            like(internships.content, searchTerm)
          )
        )
        .limit(5);
      
      allResults.push(...internshipsResults.map(r => ({ ...r, priority: 2 })));
    } catch (err) {
      console.error("Internships search error:", err);
    }

    // 3. Search Careers/Jobs
    try {
      const careersResults = await db
        .select({
          id: careers.id,
          title: careers.name,
          description: careers.content,
          type: sql<string>`'job'`,
          extra: careers.position,
          url: sql<string>`concat('/dashboard/careers/', ${careers.id})`,
        })
        .from(careers)
        .where(
          or(
            like(careers.name, searchTerm),
            like(careers.content, searchTerm),
            like(careers.position, searchTerm)
          )
        )
        .limit(5);
      
      allResults.push(...careersResults.map(r => ({ ...r, priority: 2 })));
    } catch (err) {
      console.error("Careers search error:", err);
    }

    // 4. Search Forms (available to user)
    try {
      // Build conditions properly
      let formConditions = [
        eq(forms.status, 'active'),
        or(
          like(forms.title, searchTerm),
          like(forms.description, searchTerm)
        )
      ];
      
      // Filter private/authenticated forms if user not logged in
      if (!userId) {
        formConditions.push(eq(forms.formType, 'public'));
      }
      
      const formsResults = await db
        .select({
          id: forms.id,
          title: forms.title,
          description: forms.description,
          type: sql<string>`'form'`,
          extra: sql<string>`'Fill Form'`,
          url: sql<string>`concat('/forms/', ${forms.slug})`,
        })
        .from(forms)
        .where(and(...formConditions))
        .limit(5);
      
      allResults.push(...formsResults.map(r => ({ ...r, priority: 3 })));
    } catch (err) {
      console.error("Forms search error:", err);
    }

    // 5. Search Projects (user's projects only)
    if (userId) {
      try {
        const projectsResults = await db
          .select({
            id: projects.id,
            title: projects.name,
            description: projects.description,
            type: sql<string>`'project'`,
            extra: projects.isPublic ? sql<string>`'Public'` : sql<string>`'Private'`,
            url: sql<string>`concat('/dashboard/projects/', ${projects.id})`,
          })
          .from(projects)
          .where(
            and(
              eq(projects.userId, userId),
              or(
                like(projects.name, searchTerm),
                like(projects.description, searchTerm)
              )
            )
          )
          .limit(5);
        
        allResults.push(...projectsResults.map(r => ({ ...r, priority: 4 })));
      } catch (err) {
        console.error("Projects search error:", err);
      }
    }

    // 6. Search Certificates (user's certificates only)
    if (userId) {
      try {
        // First get user name
        const userData = await db.select({ name: users.name }).from(users).where(eq(users.id, userId)).limit(1);
        const userName = userData[0]?.name || '';
        
        const certificatesResults = await db
          .select({
            id: certificates.id,
            title: certificates.internshipTitle,
            description: certificates.companyName,
            type: sql<string>`'certificate'`,
            extra: certificates.certificateNumber,
            url: sql<string>`concat('/dashboard/certificates/', ${certificates.id})`,
          })
          .from(certificates)
          .where(
            and(
              eq(certificates.userName, userName),
              or(
                like(certificates.internshipTitle, searchTerm),
                like(certificates.companyName, searchTerm),
                like(certificates.certificateNumber, searchTerm)
              )
            )
          )
          .limit(5);
        
        allResults.push(...certificatesResults.map(r => ({ ...r, priority: 5 })));
      } catch (err) {
        console.error("Certificates search error:", err);
      }
    }

    // 7. Search User's Internship Applications
    if (userId) {
      try {
        const internshipAppsResults = await db
          .select({
            id: internshipApplications.id,
            title: internships.title,
            description: companies.name,
            type: sql<string>`'application'`,
            extra: internshipApplications.status,
            url: sql<string>`concat('/dashboard/internships/my-applications/', ${internshipApplications.id})`,
          })
          .from(internshipApplications)
          .leftJoin(internships, eq(internshipApplications.internshipId, internships.id))
          .leftJoin(companies, eq(internships.companyId, companies.id))
          .where(
            and(
              eq(internshipApplications.userId, userId),
              or(
                like(internships.title, searchTerm),
                like(companies.name, searchTerm)
              )
            )
          )
          .limit(5);
        
        allResults.push(...internshipAppsResults.map(r => ({ ...r, priority: 5 })));
      } catch (err) {
        console.error("Internship applications search error:", err);
      }
    }

    // 8. Search User's Career Applications
    if (userId) {
      try {
        const careerAppsResults = await db
          .select({
            id: careerApplications.id,
            title: careers.name,
            description: companies.name,
            type: sql<string>`'application'`,
            extra: careerApplications.status,
            url: sql<string>`concat('/dashboard/my-jobs-history/', ${careerApplications.id})`,
          })
          .from(careerApplications)
          .leftJoin(careers, eq(careerApplications.careerId, careers.id))
          .leftJoin(companies, eq(careers.companyId, companies.id))
          .where(
            and(
              eq(careerApplications.userId, userId),
              or(
                like(careers.name, searchTerm),
                like(companies.name, searchTerm),
                like(careers.position, searchTerm)
              )
            )
          )
          .limit(5);
        
        allResults.push(...careerAppsResults.map(r => ({ ...r, priority: 5 })));
      } catch (err) {
        console.error("Career applications search error:", err);
      }
    }

    // Remove duplicates based on id and type
    const uniqueResults = [];
    const seen = new Set();
    for (const result of allResults) {
      const key = `${result.type}-${result.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueResults.push(result);
      }
    }

    // Sort results - exact matches first
    uniqueResults.sort((a, b) => {
      const aExactMatch = a.title?.toLowerCase() === query.toLowerCase();
      const bExactMatch = b.title?.toLowerCase() === query.toLowerCase();
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;
      
      const aTitleMatch = a.title?.toLowerCase().includes(query.toLowerCase());
      const bTitleMatch = b.title?.toLowerCase().includes(query.toLowerCase());
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      
      return (a.priority || 99) - (b.priority || 99);
    });

    // Format output
    const finalResults = uniqueResults.slice(0, 30).map(result => {
      let badge = '';
      let badgeColor = '';
      
      switch (result.type) {
        case 'company':
          badge = 'Company';
          badgeColor = 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
          break;
        case 'internship':
          badge = 'Internship';
          badgeColor = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
          break;
        case 'job':
          badge = 'Job';
          badgeColor = 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
          break;
        case 'form':
          badge = 'Form';
          badgeColor = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
          break;
        case 'project':
          badge = 'Project';
          badgeColor = 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
          break;
        case 'certificate':
          badge = 'Certificate';
          badgeColor = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
          break;
        case 'application':
          badge = 'Application';
          badgeColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
          break;
        default:
          badge = result.type;
          badgeColor = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      }
      
      return {
        id: result.id,
        title: result.title || 'Untitled',
        description: result.description ? (result.description.substring(0, 150) + (result.description.length > 150 ? '...' : '')) : 'No description',
        type: result.type,
        badge: badge,
        badgeColor: badgeColor,
        extra: result.extra || '',
        url: result.url,
      };
    });

    return NextResponse.json({
      success: true,
      results: finalResults,
      total: finalResults.length,
      query: query,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ 
      success: false,
      error: "Failed to search",
      results: [],
      total: 0,
    }, { status: 500 });
  }
}