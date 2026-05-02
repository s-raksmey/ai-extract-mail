import { GoogleGenAI } from "@google/genai";

const categoryLabels: Record<string, string> = {
  greeting: "អ៊ីមែលស្វាគមន៍",
  meeting: "អ៊ីមែលប្រជុំ",
  fyi: "អ៊ីមែលជូនដំណឹង",
  confirmation: "អ៊ីមែលបញ្ជាក់",
  thank_you: "អ៊ីមែលថ្លែងអំណរគុណ",
  apology: "អ៊ីមែលសុំទោស",
};

function demoEmail({
  subject,
  category,
  info,
  datetime,
  location,
}: {
  subject: string;
  category: string;
  info: string;
  datetime?: string;
  location?: string;
}) {
  return `ប្រធានបទ៖ ${subject}

សូមគោរពលោក/លោកស្រី,

ខ្ញុំសូមជម្រាបជូនអំពី ${categoryLabels[category] || category}។

ព័ត៌មានសំខាន់ៗ៖
${info}

${datetime ? `កាលបរិច្ឆេទ និងម៉ោង៖ ${datetime}` : ""}
${location ? `ទីតាំង៖ ${location}` : ""}

សូមអរគុណចំពោះការយកចិត្តទុកដាក់។

ដោយក្តីគោរព,
[ឈ្មោះរបស់អ្នក]`;
}

export async function POST(req: Request) {
  try {
    const { subject, category, info, datetime, location } = await req.json();

    if (!subject || !category || !info) {
      return Response.json(
        { message: "សូមបំពេញ ប្រធានបទ ប្រភេទ និងព័ត៌មានសំខាន់។" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json({
        message: demoEmail({
          subject,
          category,
          info,
          datetime,
          location,
        }),
      });
    }

    const client = new GoogleGenAI({ apiKey });

    const prompt = `
សូមបង្កើតអ៊ីមែលពេញលេញជាភាសាខ្មែរ។

ប្រធានបទ: ${subject}
ប្រភេទអ៊ីមែល: ${categoryLabels[category] || category}
ព័ត៌មានសំខាន់ៗ: ${info}
កាលបរិច្ឆេទ និងម៉ោង: ${datetime || "មិនមាន"}
ទីតាំង: ${location || "មិនមាន"}

លក្ខខណ្ឌ:
- សរសេរជាភាសាខ្មែរ
- ប្រើសំនៀងផ្លូវការ សាមញ្ញ និងសមរម្យ
- មានទម្រង់អ៊ីមែលពេញលេញ
- មាន ប្រធានបទ, សេចក្តីគោរព, ខ្លឹមសារ, និងការបញ្ចប់
- កុំសរសេរអត្ថបទពន្យល់បន្ថែមក្រៅពីអ៊ីមែល
`;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return Response.json({
      message: response.text ?? "មិនអាចបង្កើតអ៊ីមែលបានទេ។",
    });
  } catch {
    return Response.json(
      { message: "មានបញ្ហា សូមព្យាយាមម្តងទៀត។" },
      { status: 500 },
    );
  }
}
