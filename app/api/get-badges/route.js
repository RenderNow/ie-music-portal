import cheerio from 'cheerio';
// If using Node.js 18+, you can remove node-fetch since global fetch is available.
// Otherwise, uncomment the following line:
// import fetch from 'node-fetch';

export async function GET(request) {
  // Extract the OCId from query parameters
  const { searchParams } = new URL(request.url);
  const OCId = searchParams.get('OCId');

  if (!OCId) {
    return new Response(
      JSON.stringify({ error: 'OCId is required' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const response = await fetch(`https://id.sandbox.opencampus.xyz/public/credentials?username=${OCId}`);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `API Error: ${response.status} - ${response.statusText}` }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract achievements from the HTML
    const achievements = [];
    $('.credentials-page__board .credential-item').each((index, element) => {
      const name = $(element).find('.credential-name').text().trim();
      const description = $(element).find('.credential-description').text().trim();
      const image = $(element).find('.credential-image').attr('src');
      achievements.push({ name, description, image });
    });

    return new Response(JSON.stringify(achievements), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching badges:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

  