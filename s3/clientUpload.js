var file = acceptedFiles[0];
       
var options = {
  headers: {
    'Content-Type': file.type,
    'x-amz-acl': 'public-read'
      }
  };

  try {
      response = axios.put(url, file, options);
  }
  catch(err) {
      console.log(err);
  }

console.log(response.data);

  return;