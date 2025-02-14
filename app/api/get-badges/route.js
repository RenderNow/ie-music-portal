//import fetch from 'node-fetch';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { OCId } = req.query; // Assuming OCId is passed as a query parameter

  if (!OCId) {
    return res.status(400).json({ error: 'OCId is required' });
  }

  try {
    const response = await fetch(`https://id.sandbox.opencampus.xyz/public/credentials?username=${OCId}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
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

    res.status(200).json(achievements);
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
  