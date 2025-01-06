const fs = require('fs').promises;
const path = require('path');

// استفاده از مسیر موقت Vercel برای نوشتن
const dataDirectory = path.join('/tmp', 'DB');

const readData = async (filename) => {
  try {
    const filePath = path.join(dataDirectory, filename);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
};

const writeData = async (filename, data) => {
  try {
    // اطمینان از ایجاد پوشه در مسیر tmp
    await fs.mkdir(dataDirectory, { recursive: true });

    const filePath = path.join(dataDirectory, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
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
