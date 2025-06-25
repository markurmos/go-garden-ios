const https = require('https');
const fs = require('fs');
const path = require('path');

// Create images directory
const imagesDir = path.join(__dirname, 'plant-images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

// High-quality plant images from Unsplash
const plantImages = {
  'lettuce': 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=300&fit=crop&auto=format&q=80',
  'spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop&auto=format&q=80',
  'kale': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format&q=80',
  'arugula': 'https://images.unsplash.com/photo-1609501676725-7186f0a57e1d?w=400&h=300&fit=crop&auto=format&q=80',
  'swiss-chard': 'https://images.unsplash.com/photo-1583664421503-eeca45d57c3e?w=400&h=300&fit=crop&auto=format&q=80',
  'carrots': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop&auto=format&q=80',
  'radishes': 'https://images.unsplash.com/photo-1597691946873-e3c0987e3b89?w=400&h=300&fit=crop&auto=format&q=80',
  'beets': 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop&auto=format&q=80',
  'turnips': 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=300&fit=crop&auto=format&q=80',
  'tomatoes': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop&auto=format&q=80',
  'peppers': 'https://images.unsplash.com/photo-1583398701364-05e4e5aba4d2?w=400&h=300&fit=crop&auto=format&q=80',
  'zucchini': 'https://images.unsplash.com/photo-1566840803306-3b0dd8f77da4?w=400&h=300&fit=crop&auto=format&q=80',
  'cucumber': 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&h=300&fit=crop&auto=format&q=80',
  'eggplant': 'https://images.unsplash.com/photo-1618156640685-bfa4c6df5a49?w=400&h=300&fit=crop&auto=format&q=80',
  'basil': 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=400&h=300&fit=crop&auto=format&q=80',
  'cilantro': 'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=400&h=300&fit=crop&auto=format&q=80',
  'parsley': 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=300&fit=crop&auto=format&q=80',
  'rosemary': 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=400&h=300&fit=crop&auto=format&q=80',
  'broccoli': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=300&fit=crop&auto=format&q=80',
  'cauliflower': 'https://images.unsplash.com/photo-1568584711271-6d9a52b22f78?w=400&h=300&fit=crop&auto=format&q=80',
  'cabbage': 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&h=300&fit=crop&auto=format&q=80',
  'green-beans': 'https://images.unsplash.com/photo-1564590220821-c23e3c04a1e5?w=400&h=300&fit=crop&auto=format&q=80',
  'peas': 'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=400&h=300&fit=crop&auto=format&q=80',
  'onions': 'https://images.unsplash.com/photo-1582284540020-8acbb4de4d32?w=400&h=300&fit=crop&auto=format&q=80',
  'green-onions': 'https://images.unsplash.com/photo-1553907144-5f1742a6f32e?w=400&h=300&fit=crop&auto=format&q=80'
};

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imagesDir, filename);
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      console.error(`❌ Error downloading ${filename}:`, err.message);
      reject(err);
    });
  });
}

async function downloadAllImages() {
  console.log('🌱 Downloading plant images...\n');
  
  const downloads = Object.entries(plantImages).map(([name, url]) => 
    downloadImage(url, `${name}.jpg`)
  );
  
  try {
    await Promise.all(downloads);
    console.log(`\n✅ All ${downloads.length} images downloaded successfully!`);
    console.log(`📁 Images saved to: ${imagesDir}`);
    console.log('\n📋 Next steps:');
    console.log('1. Go to your Supabase dashboard Storage > plant-images');
    console.log('2. Upload all images from the plant-images folder');
    console.log('3. Test the app to see the new images');
  } catch (error) {
    console.error('\n❌ Some images failed to download:', error);
  }
}

downloadAllImages();