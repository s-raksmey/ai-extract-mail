import OpenAI from "openai";

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

    const apiKey = process.env.OPENAI_API_KEY;

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

    const client = new OpenAI({ apiKey });

    const prompt = `
អ្នកគឺជាអ្នកជំនាញសរសេរអ៊ីមែលផ្លូវការជាភាសាខ្មែរ។

សូមសរសេរអ៊ីមែលជាភាសាខ្មែរដែលមានលក្ខណៈ:
- ផ្លូវការ
- វិជ្ជាជីវៈ
- សុភាពរាបសារ
- លម្អិតគ្រប់គ្រាន់
- អានងាយ
- មានរចនាសម្ព័ន្ធច្បាស់

ព័ត៌មានសម្រាប់បង្កើតអ៊ីមែល:
ប្រធានបទ៖ ${subject}
ប្រភេទអ៊ីមែល៖ ${categoryLabels[category] || category}
ព័ត៌មានសំខាន់ៗ៖ ${info}
កាលបរិច្ឆេទ និងម៉ោង៖ ${datetime || "មិនមាន"}
ទីតាំង៖ ${location || "មិនមាន"}

រចនាសម្ព័ន្ធអ៊ីមែល:
1. ប្រធានបទ
2. ពាក្យគោរព
3. កថាខណ្ឌបើក ដើម្បីប្រាប់គោលបំណង
4. កថាខណ្ឌសំខាន់ ពន្យល់ព័ត៌មានលម្អិត
5. កថាខណ្ឌបន្ថែម បញ្ជាក់កាលបរិច្ឆេទ ម៉ោង ទីតាំង ឬសកម្មភាពបន្ទាប់
6. កថាខណ្ឌបិទ ដោយសុភាព
7. ហត្ថលេខា

ច្បាប់:
- កុំប្រើ emoji
- កុំប្រើ Markdown
- កុំប្រើសញ្ញា **
- កុំសរសេរពន្យល់ក្រៅពីអ៊ីមែល
- កុំធ្វើឲ្យខ្លីពេក
- សរសេរឲ្យដូចអ៊ីមែលដែលអាចផ្ញើបានពិតប្រាកដ

សូមបង្ហាញតែអ៊ីមែលចុងក្រោយប៉ុណ្ណោះ។
`;

    const response = await client.responses.create({
      model: "gpt-5.4-mini",
      input: prompt,
    });

    return Response.json({
      message: response.output_text || "មិនអាចបង្កើតអ៊ីមែលបានទេ។",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        message: "មានបញ្ហា សូមព្យាយាមម្តងទៀត។",
      },
      { status: 500 },
    );
  }
}
