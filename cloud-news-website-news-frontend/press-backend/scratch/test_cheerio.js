const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
  try {
    const { data } = await axios.get('https://vnexpress.net/thu-tuong-keu-goi-doanh-nghiep-my-dau-tu-vao-viet-nam-4654942.html', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(data);
    const paragraphs = [];
    $('article.fck_detail p.Normal').each((i, el) => {
      paragraphs.push({ type: "paragraph", text: $(el).text() });
    });
    console.log(paragraphs.slice(0, 3));
  } catch(e) {
    console.error(e.message);
  }
}
test();
