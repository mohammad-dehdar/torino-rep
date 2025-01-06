const fs = require('fs').promises;
const path = require('path');

// استفاده از مسیر موقت Vercel برای نوشتن و خواندن داده‌ها
const dataDirectory = path.join('/tmp', 'DB');

const readData = async (filename) => {
  try {
    const filePath = path.join(dataDirectory, filename);
    console.log(`Reading data from: ${filePath}`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn(`File not found: ${filename}`);
      return [];
    }
    console.error(`Error reading file: ${error.message}`);
    throw error;
  }
};

const writeData = async (filename, data) => {
  try {
    // اطمینان از اینکه پوشه DB در /tmp ساخته شده
    await fs.mkdir(dataDirectory, { recursive: true });

    const filePath = path.join(dataDirectory, filename);
    console.log(`Writing data to: ${filePath}`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing file: ${error.message}`);
    throw error;
  }
};

// Find an item by a specific key-value pair
const findByKey = async (filename, key, value) => {
  const data = await readData(filename);
  return data.filter(item => item[key] === value);
};

module.exports = {
  readData,
  writeData,
  findByKey
};
