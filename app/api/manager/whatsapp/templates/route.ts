// app/api/manager/whatsapp/templates/route.ts

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { whatsappAccounts, whatsappTemplates } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { whatsappManager } from "@/lib/whatsapp-client";

type JwtPayload = {
  id: number;
  roleType: string;
};

async function verifyManager(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    if (decoded.roleType !== "manager") {
      return {
        error: NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        ),
      };
    }

    return { user: decoded };

  } catch {

    return {
      error: NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      ),
    };
  }
}

/*
========================
GET Templates
========================
*/

export async function GET(
  request: NextRequest
) {

  try {

    const auth =
      await verifyManager(
        request
      );

    if (auth.error)
      return auth.error;

    const accountId =
      parseInt(
        request.nextUrl.searchParams.get(
          "accountId"
        ) || "0"
      );

    if (!accountId) {

      return NextResponse.json(
        {
          error:
            "accountId required"
        },
        {
          status:400
        }
      );

    }

    // sync from meta first
    await whatsappManager
      .syncTemplatesToDatabase(
        accountId
      );

    const templates =
      await db
        .select()
        .from(
          whatsappTemplates
        )
        .where(
          eq(
            whatsappTemplates.whatsappAccountId,
            accountId
          )
        )
        .orderBy(
          desc(
            whatsappTemplates.createdAt
          )
        );

    return NextResponse.json({

      success:true,
      templates

    });

  } catch(error){

    console.log(
      "GET template error",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed"
      },
      {
        status:500
      }
    );

  }

}


/*
========================
POST Create Template
========================
*/

export async function POST(
request:NextRequest
){

try{

const auth=
await verifyManager(
request
);

if(auth.error)
return auth.error;

const body=
await request.json();

const{

accountId,
templateName,
bodyText,
headerText,
footerText,
category,
language

}=body;


if(
!accountId||
!templateName||
!bodyText
){

return NextResponse.json(
{
error:
"Missing required fields"
},
{
status:400
}
);

}


const result=
await whatsappManager
.createTemplateOnMeta(
accountId,
{

templateName,

bodyText,

headerText,

footerText,

category:
category||
"MARKETING",

language:
language||
"en"

}
);


return NextResponse.json({

success:true,

message:
"Template created and sent for approval",

template:
result.template,

metaResponse:
result.metaResponse

});

}
catch(error){

console.log(error);

return NextResponse.json(
{
error:
error instanceof Error
?error.message
:"Failed to create"
},
{
status:500
}
);

}

}



/*
========================
PUT Sync Templates
========================
*/

export async function PUT(
request:NextRequest
){

try{

const auth=
await verifyManager(
request
);

if(auth.error)
return auth.error;


const{
accountId
}
=
await request.json();


if(
!accountId
){

return NextResponse.json(
{
error:
"accountId required"
},
{
status:400
}
);

}


const templates=
await whatsappManager
.syncTemplatesToDatabase(
accountId
);


return NextResponse.json({

success:true,

message:
"Templates synced",

templates

});

}
catch(error){

console.log(error);

return NextResponse.json(
{
error:
error instanceof Error
?error.message
:"Sync failed"
},
{
status:500
}
);

}

}