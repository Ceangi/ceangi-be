const fs = require('fs');
const pdf = require('pdf-parse');

// Function to extract and parse the PDF
const parsePdf = async (filePath) => {
  try {
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath);
      return;
    }

    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    const text = data.text;

    // Parse the text into songs
    const songs = parseSongs(text);

    // Write the songs array to a JSON file
    fs.writeFileSync('songs.json', JSON.stringify(songs, null, 2));
    console.log('Songs extracted and saved to songs.json');
  } catch (error) {
    console.error('Error parsing PDF:', error);
  }
};

// Function to parse text into song objects
const parseSongs = (text) => {
  const songArray = [];
  let expectedNumber = 1;

  // Split text by pages (assuming each page is separated by "\f")
  const pages = text.split('\f');

  pages.forEach((page) => {
    // Regex pattern to match song numbers and uppercase titles, and separate lyrics
    const songPattern = /(\d+)\.\s*([A-Z\s]+)\n([\s\S]+?)(?=\n\d+\.\s|$)/g;

    let match;
    while ((match = songPattern.exec(page)) !== null) {
      const song = {
        number: expectedNumber,  // Use 'number' for sequential numbering
        title: match[2].trim(),  // Song title (captured as uppercase)
        lyrics: match[3].trim()   // Keep lyrics with all symbols
      };

      songArray.push(song);
      expectedNumber++;          // Increment the expected number
    }
  });

  return songArray;
};

// Provide the path to your PDF file
const filePath = 'corario-2-128.pdf'; // Adjust the path to your actual PDF file
parsePdf(filePath);
