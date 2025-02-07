document.getElementById('upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById('original-image');
            img.src = e.target.result;
            img.style.display = 'block';

            // Show original image size
            const originalSize = (file.size / 1024).toFixed(2); // Convert to KB
            document.getElementById('original-size').textContent = `Size: ${originalSize} KB`;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('compress-btn').addEventListener('click', async function() {
    const file = document.getElementById('upload').files[0];
    if (!file) {
        alert('Please upload an image first.');
        return;
    }

    // Get user input for manual size control
    const width = document.getElementById('width').value;
    const height = document.getElementById('height').value;
    const maxSizeKB = document.getElementById('max-size').value;

    const options = {
        maxSizeMB: maxSizeKB ? maxSizeKB / 1024 : 1, // Convert KB to MB
        maxWidthOrHeight: width || height ? Math.max(width, height) : 1024, // Use the larger dimension
        useWebWorker: true // Use web worker for better performance
    };

    try {
        const compressedFile = await imageCompression(file, options);
        const compressedImg = document.getElementById('compressed-image');
        compressedImg.src = URL.createObjectURL(compressedFile);
        compressedImg.style.display = 'block';

        // Show compressed image size
        const compressedSize = (compressedFile.size / 1024).toFixed(2); // Convert to KB
        document.getElementById('compressed-size').textContent = `Size: ${compressedSize} KB`;

        // Show download link
        const downloadLink = document.getElementById('download-link');
        downloadLink.href = URL.createObjectURL(compressedFile);
        downloadLink.style.display = 'block';
    } catch (error) {
        console.error('Error compressing image:', error);
        alert('Error compressing image. Please try again.');
    }
});