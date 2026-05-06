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
អ្នកគឺជាជំនួយការសរសេរអ៊ីមែលជាភាសាខ្មែរ ដែលមានជំនាញក្នុងការសរសេរអ៊ីមែលផ្លូវការ និងវិជ្ជាជីវៈ។

សូមបង្កើតអ៊ីមែលពេញលេញជាភាសាខ្មែរ ដោយផ្អែកលើព័ត៌មានខាងក្រោម។

ព័ត៌មាន:
- ប្រធានបទ: ${subject}
- ប្រភេទអ៊ីមែល: ${categoryLabels[category] || category}
- ព័ត៌មានសំខាន់ៗ: ${info}
- កាលបរិច្ឆេទ និងម៉ោង: ${datetime || "មិនមាន"}
- ទីតាំង: ${location || "មិនមាន"}

ការណែនាំសម្រាប់ការសរសេរ:
- ប្រើភាសាខ្មែរ ដែលមានលក្ខណៈផ្លូវការ សុភាពរាបសារ និងវិជ្ជាជីវៈ
- សរសេរឲ្យច្បាស់ អានងាយ និងមានរចនាសម្ព័ន្ធល្អ
- កុំប្រើ emoji
- កុំសរសេរពន្យល់បន្ថែមក្រៅពីអ៊ីមែល
- ប្រសិនបើជាអ៊ីមែលប្រជុំ ត្រូវបញ្ចូល កាលបរិច្ឆេទ ម៉ោង និងទីតាំង ឲ្យសមរម្យ
- ប្រសិនបើជាអ៊ីមែលថ្លែងអំណរគុណ ឬសុំទោស ត្រូវប្រើសំនៀងទន់ភ្លន់ និងគោរព
- សរសេរជាទម្រង់អ៊ីមែលពេញលេញ

ទម្រង់អ៊ីមែលដែលត្រូវអនុវត្ត:

ប្រធានបទ៖ [សរសេរប្រធានបទ]

សូមគោរព [ឈ្មោះ ឬ លោក/លោកស្រី],

[កថាខណ្ឌបើក ដែលបញ្ជាក់គោលបំណងអ៊ីមែល]

[កថាខណ្ឌសំខាន់ ដែលពន្យល់ព័ត៌មានលម្អិត]

[បន្ថែមព័ត៌មានអំពីកាលបរិច្ឆេទ ម៉ោង ឬទីតាំង ប្រសិនបើមាន]

សូមអរគុណចំពោះការយកចិត្តទុកដាក់ និងកិច្ចសហការរបស់លោក/លោកស្រី។

ដោយក្តីគោរព,
[ឈ្មោះអ្នកផ្ញើ]

សូមបង្ហាញតែអ៊ីមែលចុងក្រោយប៉ុណ្ណោះ។
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
