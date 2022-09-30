const CropAvatarImage = async (target) => {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const MAX_WIDTH = 512;
        const MAX_HEIGHT = 512;
        let width = img.width;
        let height = img.height;

        if (width === height) {
          width = MAX_WIDTH;
          height = MAX_HEIGHT;
        }

        if (width > height) {
          width = (width * MAX_HEIGHT) / height;
          height = MAX_HEIGHT;
        }

        if (height > width) {
          height = (height * MAX_HEIGHT) / width;
          width = MAX_WIDTH;
        }

        canvas.width = MAX_WIDTH;
        canvas.height = MAX_HEIGHT;
        ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataurl = canvas.toDataURL(target.type);
        resolve(dataurl);
      };
    };
    reader.readAsDataURL(target);
  });
};

export default CropAvatarImage;
