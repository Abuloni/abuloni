export async function getText(file?: File) {
  const formData = new FormData();

  if (file) {
    formData.append('inputFile', file, 'file');
  }



  try {
    const response = await fetch('https://api.cloudmersive.com/convert/pdf/to/txt', {
      method: 'POST',
      headers: {
        'Apikey': 'c4df8cfb-5420-4e81-9233-9840a146d7a1'
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}