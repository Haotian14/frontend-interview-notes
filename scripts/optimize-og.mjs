import sharp from 'sharp';

await sharp('public/og.png')
  .resize(1200, 675, { fit: 'cover' })
  .webp({ quality: 82, effort: 6 })
  .toFile('public/og.webp');
